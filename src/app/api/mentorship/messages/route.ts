import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getAuthenticatedUser } from '@/lib/auth';

// Define validation schema for message
const messageSchema = z.object({
  mentorshipId: z.string().min(1, 'Mentorship ID is required'),
  content: z.string().min(1, 'Message content is required'),
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

    const { searchParams } = new URL(request.url);
    const mentorshipId = searchParams.get('mentorshipId');

    if (!mentorshipId) {
      return NextResponse.json(
        { error: 'Mentorship ID is required' },
        { status: 400 }
      );
    }

    // Check if user is part of the mentorship
    const mentorship = await prisma.mentorship.findFirst({
      where: {
        id: mentorshipId,
        OR: [
          { mentorId: user.id },
          { menteeId: user.id },
        ],
      },
    });

    if (!mentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get messages for the mentorship
    const messages = await prisma.message.findMany({
      where: { mentorshipId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
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
    const result = messageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }

    // Check if user is part of the mentorship
    const mentorship = await prisma.mentorship.findFirst({
      where: {
        id: result.data.mentorshipId,
        OR: [
          { mentorId: user.id },
          { menteeId: user.id },
        ],
      },
    });

    if (!mentorship) {
      return NextResponse.json(
        { error: 'Mentorship not found or unauthorized' },
        { status: 404 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        mentorshipId: result.data.mentorshipId,
        senderId: user.id,
        content: result.data.content,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    // Create notification for the other user
    const recipientId = mentorship.mentorId === user.id ? mentorship.menteeId : mentorship.mentorId;
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'MENTORSHIP_MESSAGE',
        title: 'New Message',
        message: `You have a new message from ${user.firstName} ${user.lastName}`,
        data: {
          mentorshipId: mentorship.id,
          messageId: message.id,
        },
      },
    });

    return NextResponse.json({
      message: 'Message sent successfully',
      message: message,
    }, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 