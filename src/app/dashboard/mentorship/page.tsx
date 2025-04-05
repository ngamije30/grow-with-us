'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  MagnifyingGlassIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

// Mock data for demonstration
const mentorCategories = [
  { id: 'tech', name: 'Technology', count: 42 },
  { id: 'business', name: 'Business', count: 38 },
  { id: 'design', name: 'Design', count: 25 },
  { id: 'marketing', name: 'Marketing', count: 20 },
  { id: 'finance', name: 'Finance', count: 18 },
  { id: 'healthcare', name: 'Healthcare', count: 15 },
];

const mentors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    location: 'Lagos, Nigeria',
    category: 'tech',
    expertise: ['React', 'Node.js', 'AWS', 'System Design'],
    rating: 4.8,
    reviews: 24,
    availability: 'Available',
    bio: 'Experienced software engineer with 8+ years in web development. Passionate about mentoring the next generation of developers.',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'David Okafor',
    title: 'Product Manager',
    company: 'Innovate Inc',
    location: 'Accra, Ghana',
    category: 'business',
    expertise: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
    rating: 4.9,
    reviews: 18,
    availability: 'Available',
    bio: 'Product leader with experience at startups and established companies. Focused on helping mentees develop strategic thinking and product skills.',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 3,
    name: 'Amina Hassan',
    title: 'UX/UI Designer',
    company: 'Design Studio',
    location: 'Nairobi, Kenya',
    category: 'design',
    expertise: ['Figma', 'UI Design', 'UX Research', 'Design Systems'],
    rating: 4.7,
    reviews: 15,
    availability: 'Limited',
    bio: 'Award-winning designer with a passion for creating user-centered digital experiences. Mentoring designers at all levels.',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: 4,
    name: 'Kwame Mensah',
    title: 'Digital Marketing Director',
    company: 'Growth Agency',
    location: 'Remote',
    category: 'marketing',
    expertise: ['SEO', 'Content Strategy', 'Social Media', 'Analytics'],
    rating: 4.6,
    reviews: 12,
    availability: 'Available',
    bio: 'Marketing strategist with a track record of driving growth for startups and established brands. Helping mentees develop data-driven marketing skills.',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: 5,
    name: 'Chioma Okonkwo',
    title: 'Financial Analyst',
    company: 'Global Finance',
    location: 'Lagos, Nigeria',
    category: 'finance',
    expertise: ['Financial Modeling', 'Investment Analysis', 'Risk Management', 'Excel'],
    rating: 4.9,
    reviews: 20,
    availability: 'Available',
    bio: 'Financial professional with expertise in investment analysis and financial modeling. Mentoring aspiring finance professionals.',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
  {
    id: 6,
    name: 'Dr. James Kariuki',
    title: 'Healthcare Consultant',
    company: 'HealthTech Solutions',
    location: 'Nairobi, Kenya',
    category: 'healthcare',
    expertise: ['Healthcare Management', 'Health Informatics', 'Policy Analysis', 'Public Health'],
    rating: 4.8,
    reviews: 16,
    availability: 'Limited',
    bio: 'Healthcare professional with experience in both clinical and administrative roles. Mentoring healthcare professionals and students.',
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
];

const availabilityOptions = ['All', 'Available', 'Limited'];

export default function MentorshipPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || mentor.category === selectedCategory;
    const matchesAvailability = selectedAvailability === 'All' || mentor.availability === selectedAvailability;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Mentorship</h1>
        <p className="mt-1 text-sm text-gray-500">
          Connect with experienced professionals who can guide your career journey.
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
              placeholder="Search mentors by name, skills, or expertise"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {mentorCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
            <select
              className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
            >
              {availabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900">Categories</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mentorCategories.map((category) => (
            <div
              key={category.id}
              className={`relative rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} mentors</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor listings */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Available Mentors</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={mentor.image}
                      alt={mentor.name}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-500">{mentor.title}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <BriefcaseIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {mentor.company}
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPinIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {mentor.location}
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(mentor.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {mentor.rating} ({mentor.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        mentor.availability === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {mentor.availability}
                    </span>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600 line-clamp-3">{mentor.bio}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <Button className="flex-1">Connect</Button>
                    <Button variant="outline" className="flex-shrink-0">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-lg bg-white p-6 text-center shadow">
              <p className="text-gray-500">No mentors found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 