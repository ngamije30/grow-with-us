import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';

// Define validation schema for job creation
const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE', 'HYBRID']),
  description: z.string().min(1, 'Job description is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  benefits: z.array(z.string()).optional(),
  salary: z.string().optional(),
  expiryDate: z.string().optional(),
  companyId: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

// GET /api/jobs - List all jobs with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const type = searchParams.get('type') || '';
    const skill = searchParams.get('skill') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const where: any = {
      isActive: true,
    };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    
    if (type) {
      where.type = type;
    }
    
    // Get jobs with pagination
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          skills: true,
          companyInfo: true,
        },
        orderBy: { postedDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);
    
    // Filter by skill if provided
    let filteredJobs = jobs;
    if (skill) {
      filteredJobs = jobs.filter(job => 
        job.skills.some(jobSkill => 
          jobSkill.skill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }
    
    return NextResponse.json({
      jobs: filteredJobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Only admins can create jobs' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate request body
    const result = jobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { 
      title, 
      company, 
      location, 
      type, 
      description, 
      requirements, 
      benefits, 
      salary, 
      expiryDate, 
      companyId,
      skills 
    } = result.data;
    
    // Create job with transaction to handle skills
    const job = await prisma.$transaction(async (tx) => {
      // Create the job
      const newJob = await tx.job.create({
        data: {
          title,
          company,
          location,
          type,
          description,
          requirements,
          benefits: benefits || [],
          salary,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          companyId,
        },
      });
      
      // Add skills if provided
      if (skills && skills.length > 0) {
        await tx.jobSkill.createMany({
          data: skills.map(skill => ({
            jobId: newJob.id,
            skill,
          })),
        });
      }
      
      // Return job with skills
      return tx.job.findUnique({
        where: { id: newJob.id },
        include: { skills: true },
      });
    });
    
    return NextResponse.json(
      { 
        message: 'Job created successfully',
        job
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 