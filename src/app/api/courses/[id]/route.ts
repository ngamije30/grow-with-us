import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';

// Define validation schema for course updates
const courseUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  duration: z.number().min(1, 'Duration must be at least 1 hour').optional(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  instructorId: z.string().min(1, 'Instructor ID is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: 'asc' },
        },
        enrollments: {
          include: {
            user: {
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

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Only admins can update courses
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Only admins can update courses' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const result = courseUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // If instructor is being updated, check if new instructor exists
    if (result.data.instructorId) {
      const instructor = await prisma.user.findUnique({
        where: { id: result.data.instructorId },
      });

      if (!instructor) {
        return NextResponse.json(
          { error: 'Instructor not found' },
          { status: 404 }
        );
      }
    }

    // Update course
    const course = await prisma.course.update({
      where: { id: params.id },
      data: result.data,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    console.error('Update course error:', error);
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

    // Only admins can delete courses
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Only admins can delete courses' },
        { status: 403 }
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

    // Delete course and all related data
    await prisma.$transaction([
      prisma.courseEnrollment.deleteMany({
        where: { courseId: params.id },
      }),
      prisma.lesson.deleteMany({
        where: { module: { courseId: params.id } },
      }),
      prisma.module.deleteMany({
        where: { courseId: params.id },
      }),
      prisma.course.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json({
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 