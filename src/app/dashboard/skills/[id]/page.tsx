'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  BookOpenIcon,
  CheckCircleIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';

// Mock course data for demonstration
const mockCourse = {
  id: 1,
  title: 'Advanced Web Development with React',
  provider: 'Tech Academy',
  instructor: 'Sarah Johnson',
  duration: '8 weeks',
  level: 'Advanced',
  rating: 4.8,
  reviews: 124,
  students: 1234,
  description: `Learn advanced React concepts and best practices in this comprehensive course. 
  You'll master state management, performance optimization, and advanced patterns that will 
  help you build scalable and maintainable React applications.`,
  curriculum: [
    {
      week: 1,
      title: 'Introduction to Advanced React',
      lessons: [
        { id: 1, title: 'Course Overview', duration: '15 min', completed: true },
        { id: 2, title: 'Setting Up Your Development Environment', duration: '30 min', completed: true },
        { id: 3, title: 'Advanced React Hooks', duration: '45 min', completed: false },
      ],
    },
    {
      week: 2,
      title: 'State Management Patterns',
      lessons: [
        { id: 4, title: 'Context API Deep Dive', duration: '45 min', completed: false },
        { id: 5, title: 'Redux Toolkit', duration: '60 min', completed: false },
        { id: 6, title: 'State Machines with XState', duration: '45 min', completed: false },
      ],
    },
    {
      week: 3,
      title: 'Performance Optimization',
      lessons: [
        { id: 7, title: 'React.memo and useMemo', duration: '45 min', completed: false },
        { id: 8, title: 'Code Splitting', duration: '30 min', completed: false },
        { id: 9, title: 'Virtualization Techniques', duration: '45 min', completed: false },
      ],
    },
  ],
  requirements: [
    'Basic understanding of React fundamentals',
    'JavaScript ES6+ knowledge',
    'Node.js and npm installed',
    'Code editor (VS Code recommended)',
  ],
  skills: ['React', 'JavaScript', 'State Management', 'Performance Optimization', 'Web Development'],
};

export default function CourseDetailsPage() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsEnrolled(true);
    setIsLoading(false);
  };

  return (
    <div>
      {/* Course header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">{mockCourse.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <AcademicCapIcon className="mr-1.5 h-5 w-5 text-gray-400" />
            {mockCourse.provider}
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="mr-1.5 h-5 w-5 text-gray-400" />
            {mockCourse.instructor}
          </div>
          <div className="flex items-center">
            <ClockIcon className="mr-1.5 h-5 w-5 text-gray-400" />
            {mockCourse.duration}
          </div>
          <div className="flex items-center">
            <StarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
            {mockCourse.rating} ({mockCourse.reviews} reviews)
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900">About this course</h2>
            <p className="mt-2 text-gray-600">{mockCourse.description}</p>
          </div>

          {/* Curriculum */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900">Curriculum</h2>
            <div className="mt-4 space-y-4">
              {mockCourse.curriculum.map((week) => (
                <div key={week.week} className="rounded-lg border border-gray-200">
                  <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                    <h3 className="font-medium text-gray-900">
                      Week {week.week}: {week.title}
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {week.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center">
                          {lesson.completed ? (
                            <CheckCircleIcon className="mr-3 h-5 w-5 text-green-500" />
                          ) : (
                            <PlayCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                          )}
                          <span className="text-gray-900">{lesson.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900">Requirements</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
              {mockCourse.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Course Details</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <BookOpenIcon className="mr-2 h-5 w-5 text-gray-400" />
                  Level: {mockCourse.level}
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="mr-2 h-5 w-5 text-gray-400" />
                  {mockCourse.students.toLocaleString()} students
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Skills you'll learn</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {mockCourse.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleEnroll}
              disabled={isLoading || isEnrolled}
            >
              {isLoading ? 'Enrolling...' : isEnrolled ? 'Continue Learning' : 'Enroll Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 