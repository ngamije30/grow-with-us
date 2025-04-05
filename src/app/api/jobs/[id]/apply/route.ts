import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth';

// Define validation schema for job application
const applicationSchema = z.object({
  coverLetter: z.string().min(1, 'Cover letter is required'),
  resumeUrl: z.string().optional(),
});

// POST /api/jobs/[id]/apply - Apply for a job
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const body = await request.json();
    
    // Validate request body
    const result = applicationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { coverLetter, resumeUrl } = result.data;
    
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id },
    });
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Check if job is active
    if (!job.isActive) {
      return NextResponse.json(
        { error: 'This job is no longer accepting applications' },
        { status: 400 }
      );
    }
    
    // Check if user has already applied for this job
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        userId: user.id,
        jobId: id,
      },
    });
    
    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      );
    }
    
    // Create job application
    const application = await prisma.jobApplication.create({
      data: {
        userId: user.id,
        jobId: id,
        coverLetter,
        resumeUrl,
        status: 'APPLIED',
      },
    });
    
    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'APPLICATION',
        title: 'Application Submitted',
        message: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
        link: `/dashboard/applications`,
      },
    });
    
    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        application
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 