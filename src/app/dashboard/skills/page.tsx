'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Mock data for demonstration
const skillCategories = [
  { id: 'web-dev', name: 'Web Development', count: 24 },
  { id: 'mobile-dev', name: 'Mobile Development', count: 18 },
  { id: 'data-science', name: 'Data Science', count: 15 },
  { id: 'design', name: 'Design', count: 12 },
  { id: 'business', name: 'Business', count: 10 },
  { id: 'marketing', name: 'Marketing', count: 8 },
];

const skills = [
  {
    id: 1,
    title: 'React Fundamentals',
    category: 'web-dev',
    provider: 'Udemy',
    duration: '8 hours',
    level: 'Beginner',
    progress: 0,
    description: 'Learn the basics of React, including components, state, and props.',
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    category: 'web-dev',
    provider: 'Coursera',
    duration: '12 hours',
    level: 'Intermediate',
    progress: 0,
    description: 'Master advanced JavaScript concepts like closures, promises, and async/await.',
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    category: 'design',
    provider: 'LinkedIn Learning',
    duration: '6 hours',
    level: 'Beginner',
    progress: 0,
    description: 'Learn the fundamentals of user interface and user experience design.',
  },
  {
    id: 4,
    title: 'Data Analysis with Python',
    category: 'data-science',
    provider: 'DataCamp',
    duration: '10 hours',
    level: 'Intermediate',
    progress: 0,
    description: 'Analyze data using Python libraries like Pandas, NumPy, and Matplotlib.',
  },
  {
    id: 5,
    title: 'Flutter App Development',
    category: 'mobile-dev',
    provider: 'Udemy',
    duration: '15 hours',
    level: 'Intermediate',
    progress: 0,
    description: 'Build cross-platform mobile applications with Flutter and Dart.',
  },
  {
    id: 6,
    title: 'Digital Marketing Fundamentals',
    category: 'marketing',
    provider: 'Google Digital Garage',
    duration: '5 hours',
    level: 'Beginner',
    progress: 0,
    description: 'Learn the basics of digital marketing, including SEO, social media, and email marketing.',
  },
];

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function SkillsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || skill.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Skills</h1>
        <p className="mt-1 text-sm text-gray-500">
          Develop your skills with our curated learning resources.
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
              placeholder="Search skills or courses"
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
              {skillCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
            <select
              className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
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
          {skillCategories.map((category) => (
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
                  <AcademicCapIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} courses</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill listings */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Available Courses</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{skill.title}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        skill.level === 'Beginner'
                          ? 'bg-green-100 text-green-800'
                          : skill.level === 'Intermediate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{skill.provider}</p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <ClockIcon className="mr-1.5 h-5 w-5 text-gray-400" />
                    {skill.duration}
                  </div>
                  <p className="mt-4 text-sm text-gray-600">{skill.description}</p>
                  <div className="mt-6">
                    <Button className="w-full">Start Learning</Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-lg bg-white p-6 text-center shadow">
              <p className="text-gray-500">No skills found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 