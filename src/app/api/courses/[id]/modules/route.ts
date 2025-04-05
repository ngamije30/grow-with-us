import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';
import { z } from 'zod';

// Define validation schema for module creation
const moduleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  order: z.number().min(0, 'Order must be non-negative'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
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

    return NextResponse.json(course.modules);
  } catch (error) {
    console.error('Get course modules error:', error);
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

    // Only admins can create modules
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Only admins can create modules' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const result = moduleSchema.safeParse(body);
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

    // Create module
    const module = await prisma.module.create({
      data: {
        ...result.data,
        courseId: params.id,
      },
      include: {
        lessons: true,
      },
    });

    return NextResponse.json({
      message: 'Module created successfully',
      module,
    }, { status: 201 });
  } catch (error) {
    console.error('Create module error:', error);
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

    // Only admins can update modules
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Only admins can update modules' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const result = moduleSchema.partial().safeParse(body);
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

    // Update all modules in the course
    const updatedModules = await prisma.$transaction(
      Object.entries(body).map(([moduleId, data]) =>
        prisma.module.update({
          where: { id: moduleId },
          data,
          include: {
            lessons: true,
          },
        })
      )
    );

    return NextResponse.json({
      message: 'Modules updated successfully',
      modules: updatedModules,
    });
  } catch (error) {
    console.error('Update modules error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 