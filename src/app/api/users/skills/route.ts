import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth';

// Define validation schema for skills update
const skillsUpdateSchema = z.object({
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userSkills = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        skills: true,
      },
    });

    if (!userSkills) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(userSkills.skills);
  } catch (error) {
    console.error('Get skills error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const result = skillsUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        skills: result.data.skills,
      },
      select: {
        skills: true,
      },
    });

    return NextResponse.json({
      message: 'Skills updated successfully',
      skills: updatedUser.skills,
    });
  } catch (error) {
    console.error('Update skills error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 