import { PrismaClient, Role, SkillLevel, JobType, CourseLevel, ConnectionStatus, RequestStatus, SessionStatus, ApplicationStatus, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.mentorSession.deleteMany();
  await prisma.mentorConnection.deleteMany();
  await prisma.mentorRequest.deleteMany();
  await prisma.courseProgress.deleteMany();
  await prisma.courseLesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.courseSkill.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobSkill.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Frontend Developer',
      company: 'Tech Solutions Inc',
      location: 'Lagos, Nigeria',
      bio: 'Passionate frontend developer with 3 years of experience in React and TypeScript.',
      role: Role.USER,
      isEmailVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'mentor@example.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Solutions Inc',
      location: 'Lagos, Nigeria',
      bio: 'Senior software engineer with 15 years of experience in web development and cloud architecture.',
      role: Role.MENTOR,
      isEmailVerified: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      jobTitle: 'System Administrator',
      company: 'Grow with Us',
      location: 'Remote',
      bio: 'System administrator for Grow with Us platform.',
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  console.log('Created users');

  // Create user skills
  await prisma.userSkill.createMany({
    data: [
      { userId: user1.id, skill: 'React', level: SkillLevel.INTERMEDIATE },
      { userId: user1.id, skill: 'TypeScript', level: SkillLevel.INTERMEDIATE },
      { userId: user1.id, skill: 'JavaScript', level: SkillLevel.ADVANCED },
      { userId: user1.id, skill: 'HTML', level: SkillLevel.ADVANCED },
      { userId: user1.id, skill: 'CSS', level: SkillLevel.ADVANCED },
      { userId: user2.id, skill: 'React', level: SkillLevel.EXPERT },
      { userId: user2.id, skill: 'Node.js', level: SkillLevel.EXPERT },
      { userId: user2.id, skill: 'AWS', level: SkillLevel.EXPERT },
      { userId: user2.id, skill: 'TypeScript', level: SkillLevel.EXPERT },
      { userId: user2.id, skill: 'Cloud Architecture', level: SkillLevel.EXPERT },
    ],
  });

  console.log('Created user skills');

  // Create education
  await prisma.education.createMany({
    data: [
      {
        userId: user1.id,
        school: 'University of Lagos',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2019-06-30'),
        description: 'Studied computer science with focus on web development.',
      },
      {
        userId: user2.id,
        school: 'University of Lagos',
        degree: 'Ph.D.',
        fieldOfStudy: 'Computer Science',
        startDate: new Date('2010-09-01'),
        endDate: new Date('2015-06-30'),
        description: 'Research in distributed systems and cloud computing.',
      },
    ],
  });

  console.log('Created education records');

  // Create experience
  await prisma.experience.createMany({
    data: [
      {
        userId: user1.id,
        title: 'Junior Frontend Developer',
        company: 'Web Solutions Ltd',
        location: 'Lagos, Nigeria',
        startDate: new Date('2019-07-01'),
        endDate: new Date('2021-06-30'),
        description: 'Developed and maintained responsive web applications using React and TypeScript.',
      },
      {
        userId: user1.id,
        title: 'Frontend Developer',
        company: 'Tech Solutions Inc',
        location: 'Lagos, Nigeria',
        startDate: new Date('2021-07-01'),
        current: true,
        description: 'Building modern web applications with React, TypeScript, and Next.js.',
      },
      {
        userId: user2.id,
        title: 'Software Engineer',
        company: 'Digital Innovations',
        location: 'Lagos, Nigeria',
        startDate: new Date('2015-07-01'),
        endDate: new Date('2018-06-30'),
        description: 'Developed backend services using Node.js and MongoDB.',
      },
      {
        userId: user2.id,
        title: 'Senior Software Engineer',
        company: 'Tech Solutions Inc',
        location: 'Lagos, Nigeria',
        startDate: new Date('2018-07-01'),
        current: true,
        description: 'Leading the development of cloud-native applications and mentoring junior developers.',
      },
    ],
  });

  console.log('Created experience records');

  // Create social links
  await prisma.socialLink.createMany({
    data: [
      { userId: user1.id, platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
      { userId: user1.id, platform: 'GitHub', url: 'https://github.com/johndoe' },
      { userId: user2.id, platform: 'LinkedIn', url: 'https://linkedin.com/in/sarahjohnson' },
      { userId: user2.id, platform: 'GitHub', url: 'https://github.com/sarahjohnson' },
    ],
  });

  console.log('Created social links');

  // Create companies
  const company1 = await prisma.company.create({
    data: {
      name: 'Tech Solutions Inc',
      description: 'Tech Solutions Inc is a leading software company specializing in enterprise solutions.',
      website: 'https://techsolutions.example.com',
      size: '50-200 employees',
      industry: 'Software Development',
      location: 'Lagos, Nigeria',
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'Digital Innovations',
      description: 'Digital Innovations is a technology company focused on digital transformation.',
      website: 'https://digitalinnovations.example.com',
      size: '10-50 employees',
      industry: 'Technology',
      location: 'Lagos, Nigeria',
    },
  });

  console.log('Created companies');

  // Create jobs
  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc',
      location: 'Lagos, Nigeria',
      type: JobType.FULL_TIME,
      description: 'We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have strong experience with React, TypeScript, and modern web development practices.',
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
      salary: '$3,000 - $5,000',
      companyId: company1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Full Stack Developer',
      company: 'Digital Innovations',
      location: 'Remote',
      type: JobType.FULL_TIME,
      description: 'We are seeking a Full Stack Developer to join our team. The ideal candidate will have experience with both frontend and backend development.',
      requirements: [
        '3+ years of experience in full stack development',
        'Strong proficiency in JavaScript/TypeScript',
        'Experience with React and Node.js',
        'Knowledge of databases (SQL and NoSQL)',
        'Understanding of RESTful APIs',
        'Experience with cloud platforms (AWS, Azure, or GCP)',
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Remote work options',
        'Professional development budget',
        'Flexible working hours',
      ],
      salary: '$2,500 - $4,000',
      companyId: company2.id,
    },
  });

  console.log('Created jobs');

  // Create job skills
  await prisma.jobSkill.createMany({
    data: [
      { jobId: job1.id, skill: 'React' },
      { jobId: job1.id, skill: 'TypeScript' },
      { jobId: job1.id, skill: 'Redux' },
      { jobId: job1.id, skill: 'Jest' },
      { jobId: job1.id, skill: 'Webpack' },
      { jobId: job1.id, skill: 'CSS' },
      { jobId: job2.id, skill: 'React' },
      { jobId: job2.id, skill: 'Node.js' },
      { jobId: job2.id, skill: 'TypeScript' },
      { jobId: job2.id, skill: 'MongoDB' },
      { jobId: job2.id, skill: 'AWS' },
    ],
  });

  console.log('Created job skills');

  // Create job applications
  await prisma.jobApplication.create({
    data: {
      userId: user1.id,
      jobId: job1.id,
      status: ApplicationStatus.APPLIED,
      coverLetter: 'I am excited to apply for the Senior Frontend Developer position at Tech Solutions Inc. With my experience in React and TypeScript, I believe I would be a great fit for this role.',
      appliedDate: new Date(),
    },
  });

  console.log('Created job applications');

  // Create saved jobs
  await prisma.savedJob.create({
    data: {
      userId: user1.id,
      jobId: job2.id,
    },
  });

  console.log('Created saved jobs');

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Advanced Web Development with React',
      provider: 'Tech Academy',
      instructor: 'Sarah Johnson',
      description: 'Learn advanced React concepts and best practices in this comprehensive course.',
      duration: '8 weeks',
      level: CourseLevel.ADVANCED,
      price: 99.99,
      isFree: false,
      rating: 4.8,
      reviewCount: 124,
      studentCount: 1234,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Introduction to TypeScript',
      provider: 'Tech Academy',
      instructor: 'John Smith',
      description: 'Master TypeScript fundamentals and learn how to build type-safe applications.',
      duration: '4 weeks',
      level: CourseLevel.BEGINNER,
      price: 49.99,
      isFree: false,
      rating: 4.6,
      reviewCount: 89,
      studentCount: 567,
    },
  });

  console.log('Created courses');

  // Create course skills
  await prisma.courseSkill.createMany({
    data: [
      { courseId: course1.id, skill: 'React' },
      { courseId: course1.id, skill: 'JavaScript' },
      { courseId: course1.id, skill: 'State Management' },
      { courseId: course1.id, skill: 'Performance Optimization' },
      { courseId: course1.id, skill: 'Web Development' },
      { courseId: course2.id, skill: 'TypeScript' },
      { courseId: course2.id, skill: 'JavaScript' },
      { courseId: course2.id, skill: 'Web Development' },
    ],
  });

  console.log('Created course skills');

  // Create course modules
  const module1 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to Advanced React',
      description: 'Overview of advanced React concepts and setting up your development environment.',
      order: 1,
    },
  });

  const module2 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'State Management Patterns',
      description: 'Learn about different state management patterns in React applications.',
      order: 2,
    },
  });

  const module3 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Performance Optimization',
      description: 'Techniques for optimizing React application performance.',
      order: 3,
    },
  });

  console.log('Created course modules');

  // Create course lessons
  await prisma.courseLesson.createMany({
    data: [
      {
        moduleId: module1.id,
        title: 'Course Overview',
        description: 'Introduction to the course and what you will learn.',
        duration: '15 min',
        order: 1,
      },
      {
        moduleId: module1.id,
        title: 'Setting Up Your Development Environment',
        description: 'How to set up your development environment for React development.',
        duration: '30 min',
        order: 2,
      },
      {
        moduleId: module1.id,
        title: 'Advanced React Hooks',
        description: 'Deep dive into advanced React hooks and their use cases.',
        duration: '45 min',
        order: 3,
      },
      {
        moduleId: module2.id,
        title: 'Context API Deep Dive',
        description: 'Understanding the Context API and when to use it.',
        duration: '45 min',
        order: 1,
      },
      {
        moduleId: module2.id,
        title: 'Redux Toolkit',
        description: 'Introduction to Redux Toolkit and how to use it in React applications.',
        duration: '60 min',
        order: 2,
      },
      {
        moduleId: module2.id,
        title: 'State Machines with XState',
        description: 'Using state machines to manage complex state in React applications.',
        duration: '45 min',
        order: 3,
      },
      {
        moduleId: module3.id,
        title: 'React.memo and useMemo',
        description: 'How to use React.memo and useMemo to optimize rendering performance.',
        duration: '45 min',
        order: 1,
      },
      {
        moduleId: module3.id,
        title: 'Code Splitting',
        description: 'Techniques for code splitting in React applications.',
        duration: '30 min',
        order: 2,
      },
      {
        moduleId: module3.id,
        title: 'Virtualization Techniques',
        description: 'How to use virtualization to render large lists efficiently.',
        duration: '45 min',
        order: 3,
      },
    ],
  });

  console.log('Created course lessons');

  // Create course enrollments
  await prisma.courseEnrollment.create({
    data: {
      userId: user1.id,
      courseId: course1.id,
      enrolledAt: new Date(),
    },
  });

  console.log('Created course enrollments');

  // Create course progress
  const lesson1 = await prisma.courseLesson.findFirst({
    where: { moduleId: module1.id, order: 1 },
  });

  const lesson2 = await prisma.courseLesson.findFirst({
    where: { moduleId: module1.id, order: 2 },
  });

  if (lesson1 && lesson2) {
    await prisma.courseProgress.createMany({
      data: [
        {
          userId: user1.id,
          courseId: course1.id,
          moduleId: module1.id,
          lessonId: lesson1.id,
          completed: true,
          completedAt: new Date(),
        },
        {
          userId: user1.id,
          courseId: course1.id,
          moduleId: module1.id,
          lessonId: lesson2.id,
          completed: true,
          completedAt: new Date(),
        },
      ],
    });
  }

  console.log('Created course progress');

  // Create mentor connections
  const connection = await prisma.mentorConnection.create({
    data: {
      mentorId: user2.id,
      menteeId: user1.id,
      status: ConnectionStatus.ACTIVE,
      startDate: new Date(),
    },
  });

  console.log('Created mentor connections');

  // Create mentor sessions
  await prisma.mentorSession.create({
    data: {
      connectionId: connection.id,
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour after start
      status: SessionStatus.SCHEDULED,
      notes: 'Discussion about career goals and React development.',
    },
  });

  console.log('Created mentor sessions');

  // Create messages
  await prisma.message.createMany({
    data: [
      {
        senderId: user2.id,
        receiverId: user1.id,
        content: 'Hi! Thanks for connecting. I\'d love to hear more about your career goals.',
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        senderId: user1.id,
        receiverId: user2.id,
        content: 'Hello! I\'m really interested in becoming a full-stack developer. I have some experience with React and Node.js.',
        read: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        senderId: user2.id,
        receiverId: user1.id,
        content: 'That\'s great! Have you worked on any full-stack projects so far?',
        read: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
    ],
  });

  console.log('Created messages');

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user1.id,
        type: NotificationType.JOB,
        title: 'New job matching your skills',
        message: 'Senior Frontend Developer position at Tech Solutions Inc',
        read: false,
        link: `/dashboard/jobs/${job1.id}`,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        userId: user1.id,
        type: NotificationType.APPLICATION,
        title: 'Application status updated',
        message: 'Your application for Product Manager at Startup Hub has been reviewed',
        read: false,
        link: '/dashboard/applications',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        userId: user1.id,
        type: NotificationType.SKILL,
        title: 'Course completion',
        message: 'Congratulations! You\'ve completed the React Advanced course',
        read: true,
        link: `/dashboard/skills/${course1.id}`,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: user1.id,
        type: NotificationType.MENTOR,
        title: 'New message from mentor',
        message: 'Dr. Sarah Johnson sent you a message about your career goals',
        read: true,
        link: '/dashboard/mentorship',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ],
  });

  console.log('Created notifications');

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 