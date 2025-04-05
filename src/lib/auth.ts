import { NextRequest } from 'next/server';
import { prisma } from './prisma';

export async function getAuthenticatedUser(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  
  if (!userId) {
    return null;
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        jobTitle: true,
        company: true,
        location: true,
        bio: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return user;
  } catch (error) {
    console.error('Error fetching authenticated user:', error);
    return null;
  }
}

export function isAdmin(request: NextRequest) {
  const userRole = request.headers.get('x-user-role');
  return userRole === 'ADMIN';
}

export function isMentor(request: NextRequest) {
  const userRole = request.headers.get('x-user-role');
  return userRole === 'MENTOR';
} 