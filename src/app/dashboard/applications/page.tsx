'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

// Mock applications data for demonstration
const mockApplications = [
  {
    id: 1,
    jobId: 1,
    title: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc',
    location: 'Lagos, Nigeria',
    appliedDate: '2024-03-15',
    status: 'applied',
    lastUpdated: '2024-03-15',
  },
  {
    id: 2,
    jobId: 2,
    title: 'Full Stack Developer',
    company: 'Digital Innovations',
    location: 'Remote',
    appliedDate: '2024-03-10',
    status: 'interviewing',
    lastUpdated: '2024-03-12',
  },
  {
    id: 3,
    jobId: 3,
    title: 'UI/UX Designer',
    company: 'Creative Studios',
    location: 'Accra, Ghana',
    appliedDate: '2024-03-05',
    status: 'rejected',
    lastUpdated: '2024-03-08',
  },
  {
    id: 4,
    jobId: 4,
    title: 'Product Manager',
    company: 'Startup Hub',
    location: 'Nairobi, Kenya',
    appliedDate: '2024-03-01',
    status: 'offered',
    lastUpdated: '2024-03-14',
  },
];

const statusColors = {
  applied: 'bg-blue-100 text-blue-800',
  interviewing: 'bg-yellow-100 text-yellow-800',
  offered: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusIcons = {
  applied: ClockIcon,
  interviewing: CheckCircleIcon,
  offered: CheckCircleIcon,
  rejected: XCircleIcon,
};

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredApplications = mockApplications.filter((application) => {
    const matchesSearch =
      application.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || application.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage your job applications.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              placeholder="Search applications"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications list */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <ul className="divide-y divide-gray-200">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => {
              const StatusIcon = statusIcons[application.status as keyof typeof statusIcons];
              return (
                <li key={application.id} className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          <a href={`/dashboard/jobs/${application.jobId}`} className="hover:text-primary">
                            {application.title}
                          </a>
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusColors[application.status as keyof typeof statusColors]
                          }`}
                        >
                          <StatusIcon className="mr-1.5 h-4 w-4" />
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                          {application.company}
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                          {application.location}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                          Applied {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="p-6 text-center text-gray-500">No applications found matching your criteria.</li>
          )}
        </ul>
      </div>
    </div>
  );
} 