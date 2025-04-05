import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId: params.id,
        userId: user.id,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'You are already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId: params.id,
        userId: user.id,
        status: 'IN_PROGRESS',
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
        },
      },
    });

    // Create notification for the instructor
    await prisma.notification.create({
      data: {
        userId: course.instructorId,
        type: 'COURSE_ENROLLMENT',
        title: 'New Course Enrollment',
        message: `${user.firstName} ${user.lastName} has enrolled in your course "${course.title}"`,
        data: {
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      },
    });

    return NextResponse.json({
      message: 'Successfully enrolled in the course',
      enrollment,
    }, { status: 201 });
  } catch (error) {
    console.error('Course enrollment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if enrollment exists
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId: params.id,
        userId: user.id,
      },
      include: {
        course: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course' },
        { status: 404 }
      );
    }

    // Delete enrollment
    await prisma.courseEnrollment.delete({
      where: { id: enrollment.id },
    });

    // Create notification for the instructor
    await prisma.notification.create({
      data: {
        userId: enrollment.course.instructorId,
        type: 'COURSE_WITHDRAWAL',
        title: 'Course Withdrawal',
        message: `${user.firstName} ${user.lastName} has withdrawn from your course "${enrollment.course.title}"`,
        data: {
          courseId: enrollment.courseId,
        },
      },
    });

    return NextResponse.json({
      message: 'Successfully withdrawn from the course',
    });
  } catch (error) {
    console.error('Course withdrawal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 