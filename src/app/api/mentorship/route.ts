import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth';

// Define validation schema for mentorship request
const mentorshipSchema = z.object({
  mentorId: z.string().min(1, 'Mentor ID is required'),
  message: z.string().min(1, 'Message is required'),
  preferredMeetingTime: z.string().datetime('Invalid meeting time').optional(),
  goals: z.array(z.string()).min(1, 'At least one goal is required'),
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

    // Get mentorship connections where user is either mentor or mentee
    const mentorships = await prisma.mentorship.findMany({
      where: {
        OR: [
          { mentorId: user.id },
          { menteeId: user.id },
        ],
      },
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            jobTitle: true,
            company: true,
          },
        },
        mentee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            jobTitle: true,
            company: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(mentorships);
  } catch (error) {
    console.error('Get mentorships error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const result = mentorshipSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }

    // Check if mentor exists and is actually a mentor
    const mentor = await prisma.user.findUnique({
      where: { id: result.data.mentorId },
    });

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      );
    }

    if (mentor.role !== 'MENTOR') {
      return NextResponse.json(
        { error: 'Selected user is not a mentor' },
        { status: 400 }
      );
    }

    // Check if mentorship already exists
    const existingMentorship = await prisma.mentorship.findFirst({
      where: {
        mentorId: result.data.mentorId,
        menteeId: user.id,
        status: { not: 'REJECTED' },
      },
    });

    if (existingMentorship) {
      return NextResponse.json(
        { error: 'Mentorship request already exists' },
        { status: 400 }
      );
    }

    // Create mentorship request
    const mentorship = await prisma.mentorship.create({
      data: {
        mentorId: result.data.mentorId,
        menteeId: user.id,
        message: result.data.message,
        preferredMeetingTime: result.data.preferredMeetingTime,
        goals: result.data.goals,
        status: 'PENDING',
      },
      include: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            jobTitle: true,
            company: true,
          },
        },
        mentee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            jobTitle: true,
            company: true,
          },
        },
      },
    });

    // Create notification for mentor
    await prisma.notification.create({
      data: {
        userId: result.data.mentorId,
        type: 'MENTORSHIP_REQUEST',
        title: 'New Mentorship Request',
        message: `${user.firstName} ${user.lastName} has requested you as a mentor`,
        data: {
          mentorshipId: mentorship.id,
        },
      },
    });

    return NextResponse.json({
      message: 'Mentorship request sent successfully',
      mentorship,
    }, { status: 201 });
  } catch (error) {
    console.error('Create mentorship error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 