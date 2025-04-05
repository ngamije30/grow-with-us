'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  BriefcaseIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Mock data for demonstration
const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    type: 'Full-time',
    posted: '2 days ago',
    description: 'We are looking for a Frontend Developer to join our team...',
    skills: ['React', 'TypeScript', 'CSS', 'HTML'],
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'Design Studio',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    posted: '1 week ago',
    description: 'Join our design team to create beautiful and functional user interfaces...',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research'],
  },
  {
    id: 3,
    title: 'Backend Developer',
    company: 'StartupX',
    location: 'Remote',
    type: 'Contract',
    posted: '3 days ago',
    description: 'We need a Backend Developer to build scalable APIs...',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
  },
  {
    id: 4,
    title: 'Product Manager',
    company: 'Innovate Inc',
    location: 'Accra, Ghana',
    type: 'Full-time',
    posted: '5 days ago',
    description: 'Lead product development initiatives from conception to launch...',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
  },
  {
    id: 5,
    title: 'Data Analyst',
    company: 'Data Insights',
    location: 'Remote',
    type: 'Part-time',
    posted: '1 day ago',
    description: 'Analyze data to provide actionable insights for business decisions...',
    skills: ['SQL', 'Python', 'Data Visualization', 'Statistics'],
  },
];

const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const locations = ['All', 'Remote', 'Lagos, Nigeria', 'Accra, Ghana', 'Nairobi, Kenya'];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJobType = selectedJobType === 'All' || job.type === selectedJobType;
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    
    return matchesSearch && matchesJobType && matchesLocation;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find your next opportunity from our curated job listings.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              placeholder="Search jobs, companies, or keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <FunnelIcon className="mr-2 h-5 w-5" />
            Filters
          </Button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="mt-4 rounded-md border border-gray-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="job-type" className="block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <select
                  id="job-type"
                  name="job-type"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job listings */}
      <div className="space-y-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Button>Apply Now</Button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <BriefcaseIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {job.type}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {job.posted}
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">{job.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
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
          ))
        ) : (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 