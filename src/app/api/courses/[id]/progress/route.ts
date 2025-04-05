import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { z } from 'zod';

// Define validation schema for progress updates
const progressSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  completed: z.boolean(),
});

export async function GET(
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

    // Check if user is enrolled in the course
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId: params.id,
        userId: user.id,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course' },
        { status: 404 }
      );
    }

    // Get course with modules and lessons
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Get user's progress for all lessons in the course
    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lesson: {
          module: {
            courseId: params.id,
          },
        },
      },
    });

    // Calculate overall progress
    const totalLessons = course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0
    );
    const completedLessons = progress.filter(p => p.completed).length;
    const progressPercentage = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    // Update enrollment status if all lessons are completed
    if (completedLessons === totalLessons && enrollment.status !== 'COMPLETED') {
      await prisma.courseEnrollment.update({
        where: { id: enrollment.id },
        data: { status: 'COMPLETED' },
      });

      // Create notification for the instructor
      await prisma.notification.create({
        data: {
          userId: course.instructorId,
          type: 'COURSE_COMPLETION',
          title: 'Course Completion',
          message: `${user.firstName} ${user.lastName} has completed your course "${course.title}"`,
          data: {
            courseId: course.id,
            enrollmentId: enrollment.id,
          },
        },
      });
    }

    return NextResponse.json({
      progress: progress.map(p => ({
        lessonId: p.lessonId,
        completed: p.completed,
        lastAccessed: p.updatedAt,
      })),
      overallProgress: progressPercentage,
      totalLessons,
      completedLessons,
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    
    // Validate request body
    const result = progressSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.courseEnrollment.findFirst({
      where: {
        courseId: params.id,
        userId: user.id,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'You are not enrolled in this course' },
        { status: 404 }
      );
    }

    // Check if lesson belongs to the course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: result.data.lessonId,
        module: {
          courseId: params.id,
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found in this course' },
        { status: 404 }
      );
    }

    // Update or create lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: result.data.lessonId,
        },
      },
      update: {
        completed: result.data.completed,
      },
      create: {
        userId: user.id,
        lessonId: result.data.lessonId,
        completed: result.data.completed,
      },
    });

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress,
    });
  } catch (error) {
    console.error('Update course progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 