import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';

// Define validation schema for job update
const jobUpdateSchema = z.object({
  title: z.string().min(1, 'Job title is required').optional(),
  company: z.string().min(1, 'Company name is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE', 'HYBRID']).optional(),
  description: z.string().min(1, 'Job description is required').optional(),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed').optional(),
  benefits: z.array(z.string()).optional(),
  salary: z.string().optional(),
  expiryDate: z.string().optional(),
  isActive: z.boolean().optional(),
  companyId: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

// GET /api/jobs/[id] - Get a specific job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        skills: true,
        companyInfo: true,
      },
    });
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/[id] - Update a specific job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: 'Only admins can update jobs' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    const body = await request.json();
    
    // Validate request body
    const result = jobUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id },
    });
    
    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Update job with transaction to handle skills
    const updatedJob = await prisma.$transaction(async (tx) => {
      // Update the job
      const job = await tx.job.update({
        where: { id },
        data: {
          title: result.data.title,
          company: result.data.company,
          location: result.data.location,
          type: result.data.type,
          description: result.data.description,
          requirements: result.data.requirements,
          benefits: result.data.benefits,
          salary: result.data.salary,
          expiryDate: result.data.expiryDate ? new Date(result.data.expiryDate) : undefined,
          isActive: result.data.isActive,
          companyId: result.data.companyId,
        },
      });
      
      // Update skills if provided
      if (result.data.skills) {
        // Delete existing skills
        await tx.jobSkill.deleteMany({
          where: { jobId: id },
        });
        
        // Add new skills
        if (result.data.skills.length > 0) {
          await tx.jobSkill.createMany({
            data: result.data.skills.map(skill => ({
              jobId: id,
              skill,
            })),
          });
        }
      }
      
      // Return job with skills
      return tx.job.findUnique({
        where: { id },
        include: { skills: true },
      });
    });
    
    return NextResponse.json({
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a specific job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        { error: 'Only admins can delete jobs' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id },
    });
    
    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Delete job (cascade will handle related records)
    await prisma.job.delete({
      where: { id },
    });
    
    return NextResponse.json({
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 