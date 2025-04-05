'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

// Mock job data for demonstration
const mockJob = {
  id: 1,
  title: 'Senior Frontend Developer',
  company: 'Tech Solutions Inc',
  location: 'Lagos, Nigeria',
  type: 'Full-time',
  posted: '2024-03-15',
  salary: '$3,000 - $5,000',
  description: `We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have strong experience with React, TypeScript, and modern web development practices.

Key Responsibilities:
- Develop and maintain responsive web applications
- Write clean, maintainable, and efficient code
- Collaborate with designers and backend developers
- Mentor junior developers
- Participate in code reviews and technical discussions

Requirements:
- 5+ years of experience in frontend development
- Strong proficiency in React and TypeScript
- Experience with state management (Redux, Context API)
- Knowledge of modern build tools and workflows
- Understanding of web performance optimization
- Experience with testing frameworks (Jest, React Testing Library)`,
  requirements: [
    '5+ years of experience in frontend development',
    'Strong proficiency in React and TypeScript',
    'Experience with state management (Redux, Context API)',
    'Knowledge of modern build tools and workflows',
    'Understanding of web performance optimization',
    'Experience with testing frameworks (Jest, React Testing Library)',
  ],
  benefits: [
    'Competitive salary',
    'Health insurance',
    'Remote work options',
    'Professional development budget',
    'Flexible working hours',
    'Annual bonus',
  ],
  skills: ['React', 'TypeScript', 'Redux', 'Jest', 'Webpack', 'CSS'],
  companyInfo: {
    name: 'Tech Solutions Inc',
    description: 'Tech Solutions Inc is a leading software company specializing in enterprise solutions.',
    size: '50-200 employees',
    industry: 'Software Development',
    website: 'https://techsolutions.example.com',
    location: 'Lagos, Nigeria',
  },
};

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleApply = async () => {
    setIsApplying(true);
    setApplicationStatus('submitting');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setApplicationStatus('success');
    } catch (error) {
      setApplicationStatus('error');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          ← Back to Jobs
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{mockJob.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <BuildingOfficeIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                {mockJob.company}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                {mockJob.location}
              </div>
              <div className="flex items-center">
                <BriefcaseIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                {mockJob.type}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                Posted {new Date(mockJob.posted).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleApply}
              disabled={isApplying || applicationStatus === 'success'}
              className="min-w-[120px]"
            >
              {applicationStatus === 'success' ? (
                <>
                  <CheckCircleIcon className="mr-2 h-5 w-5" />
                  Applied
                </>
              ) : applicationStatus === 'error' ? (
                <>
                  <XCircleIcon className="mr-2 h-5 w-5" />
                  Try Again
                </>
              ) : (
                'Apply Now'
              )}
            </Button>
            <Button variant="outline">Save Job</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Job Description</h2>
              <div className="mt-4 prose max-w-none text-gray-600">
                {mockJob.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Requirements</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                {mockJob.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Benefits</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                {mockJob.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Job Details</h2>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Salary</dt>
                  <dd className="mt-1 flex items-center text-sm text-gray-900">
                    <CurrencyDollarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {mockJob.salary}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Job Type</dt>
                  <dd className="mt-1 flex items-center text-sm text-gray-900">
                    <BriefcaseIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {mockJob.type}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Posted Date</dt>
                  <dd className="mt-1 flex items-center text-sm text-gray-900">
                    <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {new Date(mockJob.posted).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 flex items-center text-sm text-gray-900">
                    <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {mockJob.location}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Required Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {mockJob.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">About the Company</h2>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-gray-600">{mockJob.companyInfo.description}</p>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Industry</dt>
                    <dd className="text-sm text-gray-900">{mockJob.companyInfo.industry}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company Size</dt>
                    <dd className="text-sm text-gray-900">{mockJob.companyInfo.size}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                    <dd className="text-sm text-gray-900">
                      <a
                        href={mockJob.companyInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        {mockJob.companyInfo.website.replace('https://', '')}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 