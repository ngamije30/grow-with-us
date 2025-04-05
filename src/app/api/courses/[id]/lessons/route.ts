import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';
import { z } from 'zod';

// Define validation schema for lesson creation
const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  moduleId: z.string().min(1, 'Module ID is required'),
  order: z.number().min(0, 'Order must be non-negative'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  type: z.enum(['VIDEO', 'TEXT', 'QUIZ', 'ASSIGNMENT']),
  resources: z.array(z.string().url('Invalid resource URL')).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          where: moduleId ? { id: moduleId } : undefined,
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
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

    // If moduleId is provided, return lessons for that module only
    if (moduleId) {
      const module = course.modules[0];
      if (!module) {
        return NextResponse.json(
          { error: 'Module not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(module.lessons);
    }

    // Return all lessons from all modules
    const lessons = course.modules.flatMap(module => module.lessons);
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Get course lessons error:', error);
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

    // Only admins can create lessons
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Only admins can create lessons' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const result = lessonSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
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

    // Check if module exists and belongs to the course
    const module = await prisma.module.findFirst({
      where: {
        id: result.data.moduleId,
        courseId: params.id,
      },
    });

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found in this course' },
        { status: 404 }
      );
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        ...result.data,
      },
    });

    return NextResponse.json({
      message: 'Lesson created successfully',
      lesson,
    }, { status: 201 });
  } catch (error) {
    console.error('Create lesson error:', error);
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

    // Only admins can update lessons
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Only admins can update lessons' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const result = lessonSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
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

    // Update all lessons in the course
    const updatedLessons = await prisma.$transaction(
      Object.entries(body).map(([lessonId, data]) =>
        prisma.lesson.update({
          where: { id: lessonId },
          data,
        })
      )
    );

    return NextResponse.json({
      message: 'Lessons updated successfully',
      lessons: updatedLessons,
    });
  } catch (error) {
    console.error('Update lessons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 