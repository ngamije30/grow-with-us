import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';

// GET /api/applications/[id] - Get job application details
export async function GET(
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
    
    // Get application with job details
    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            type: true,
            description: true,
            requirements: true,
            benefits: true,
            salary: true,
            postedDate: true,
            expiryDate: true,
            isActive: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            jobTitle: true,
            company: true,
            location: true,
          },
        },
      },
    });
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    // Check if user is authorized to view this application
    if (application.userId !== user.id && !isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized to view this application' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ application });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/applications/[id] - Update application status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is admin
    const user = await getAuthenticatedUser(request);
    if (!user || !isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const { status } = await request.json();
    
    // Validate status
    if (!['APPLIED', 'REVIEWING', 'INTERVIEW', 'OFFER', 'REJECTED', 'ACCEPTED', 'WITHDRAWN'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Check if application exists
    const application = await prisma.jobApplication.findUnique({
      where: { id },
    });
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    // Update application status
    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: { status },
    });
    
    // Create notification for the applicant
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: 'APPLICATION_STATUS',
        title: 'Application Status Updated',
        message: `Your application status has been updated to ${status}.`,
        link: `/dashboard/applications/${id}`,
      },
    });
    
    return NextResponse.json({
      message: 'Application status updated successfully',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 