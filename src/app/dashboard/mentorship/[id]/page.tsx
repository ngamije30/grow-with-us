'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  UserCircleIcon,
  BriefcaseIcon,
  MapPinIcon,
  StarIcon,
  AcademicCapIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

// Mock mentor data for demonstration
const mockMentor = {
  id: 1,
  name: 'Dr. Sarah Johnson',
  title: 'Senior Software Engineer',
  company: 'Tech Solutions Inc',
  location: 'Lagos, Nigeria',
  image: '/placeholder-avatar.jpg',
  rating: 4.9,
  reviews: 56,
  hourlyRate: 50,
  availability: 'Available for 10 hours/week',
  bio: `Dr. Sarah Johnson is a seasoned software engineer with over 15 years of experience in web development
  and cloud architecture. She has mentored over 100 developers and helped them advance their careers in tech.
  Sarah specializes in React, Node.js, and AWS, and is passionate about helping African developers succeed
  in the global tech industry.`,
  expertise: [
    'Web Development',
    'Cloud Architecture',
    'React',
    'Node.js',
    'AWS',
    'Career Development',
  ],
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc',
      period: '2018 - Present',
      description: 'Leading the development of cloud-native applications and mentoring junior developers.',
    },
    {
      title: 'Technical Lead',
      company: 'Digital Innovations',
      period: '2015 - 2018',
      description: 'Managed a team of developers and implemented agile methodologies.',
    },
  ],
  education: [
    {
      degree: 'Ph.D. in Computer Science',
      school: 'University of Lagos',
      period: '2010 - 2015',
    },
    {
      degree: 'M.Sc. in Software Engineering',
      school: 'University of Cape Town',
      period: '2008 - 2010',
    },
  ],
  availabilitySlots: [
    { day: 'Monday', slots: ['9:00 AM', '2:00 PM', '4:00 PM'] },
    { day: 'Wednesday', slots: ['10:00 AM', '3:00 PM', '5:00 PM'] },
    { day: 'Friday', slots: ['11:00 AM', '2:00 PM', '4:00 PM'] },
  ],
};

export default function MentorProfilePage() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestMentorship = async () => {
    if (!selectedSlot) return;
    setIsRequesting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRequesting(false);
    // Show success message or redirect
  };

  return (
    <div>
      {/* Mentor header */}
      <div className="mb-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:gap-6">
          <div className="mb-4 sm:mb-0">
            <img
              src={mockMentor.image}
              alt={mockMentor.name}
              className="h-32 w-32 rounded-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-semibold text-gray-900">{mockMentor.name}</h1>
            <p className="mt-1 text-lg text-gray-600">{mockMentor.title}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 sm:justify-start">
              <div className="flex items-center">
                <BriefcaseIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                {mockMentor.company}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                {mockMentor.location}
              </div>
              <div className="flex items-center">
                <StarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                {mockMentor.rating} ({mockMentor.reviews} reviews)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Bio */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900">About</h2>
            <p className="mt-2 text-gray-600">{mockMentor.bio}</p>
          </div>

          {/* Expertise */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900">Areas of Expertise</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {mockMentor.expertise.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900">Experience</h2>
            <div className="mt-4 space-y-4">
              {mockMentor.experience.map((exp, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900">{exp.title}</h3>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.period}</p>
                  <p className="mt-2 text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900">Education</h2>
            <div className="mt-4 space-y-4">
              {mockMentor.education.map((edu, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                  <p className="text-sm text-gray-500">{edu.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Availability */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-medium text-gray-900">Schedule a Session</h3>
              <div className="mt-4 space-y-4">
                {mockMentor.availabilitySlots.map((day) => (
                  <div key={day.day}>
                    <h4 className="font-medium text-gray-900">{day.day}</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {day.slots.map((slot) => (
                        <button
                          key={slot}
                          className={`rounded-md px-3 py-1 text-sm ${
                            selectedSlot === slot
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request mentorship */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hourly Rate</span>
                  <span className="font-medium text-gray-900">${mockMentor.hourlyRate}/hour</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Availability</span>
                  <span className="font-medium text-gray-900">{mockMentor.availability}</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleRequestMentorship}
                disabled={isRequesting || !selectedSlot}
              >
                {isRequesting ? 'Sending Request...' : 'Request Mentorship'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 