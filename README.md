# Grow withUs


Description of the concept of their Mission; 
My mission is to design a website that will encourage young people to search for jobs and gain necessary skills to do any dream job of theirs all over Africa due to the limited access to job opportunities and the skills gap that prevents many from securing meaningful employment and this design will differ from other design regarding that the design will be able to keep track of its users where they go and also use provided mentors on the website to learn and help them achieve their goal.

Problem statement: 
My problem statement is that Young Africans, particularly in underserved areas, face barriers to employment due to limited job opportunities and skill-building resources. The growing youth population and digital demands exacerbate this. Employers struggle to find skilled talent, perpetuating underemployment. A website featuring job posts, training, mentorship, and partnerships will bridge this gap and drive impact.
So my problem statement regards: 
Who: Young people across Africa, particularly those in underserved communities, facing barriers to employment and career growth. 
What: Limited access to job opportunities and skill development resources, which hinders their ability to secure meaningful employment and achieve their career aspirations.
When: This problem has been persistent for decades but is becoming increasingly urgent with Africa’s growing youth population and evolving job market demands in the digital age.
Where: Across Africa, especially in rural areas and regions with limited infrastructure and access to educational resources.
Why: Despite having immense potential, many young Africans lack the tools, connections, and training needed to compete in today’s job market. Employers, on the other hand, struggle to find skilled talent to meet their needs. This disconnect perpetuates cycles of poverty and underemployment.
How: The website will address these challenges by acting as a bridge between job seekers and employers, offering a user-friendly platform with features such as job postings, virtual training programs, mentorship opportunities, and career guidance. It will also leverage partnerships with businesses, educational institutions, and NGOs to maximize its impact and reach.  GrowWithUs website = http://localhost:3000


## Features

- User Authentication (Login/Register)
- Job Search and Applications
- Skills Development
- Mentorship Program
- Real-time Notifications
- Profile Management
- Course Management
- Application Tracking

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand, React Query
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **API**: REST API with Next.js API Routes
- **Testing**: Jest, React Testing Library
- **UI Components**: Radix UI, Headless UI

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ngamije30/grow-with-us.git
   cd grow-with-us
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/growwithus?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate

   # Seed the database (optional)
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database

## Project Structure

```
grow-with-us/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utility functions and configurations
│   └── styles/          # Global styles
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── scripts/             # Utility scripts
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/jobs/*` - Job-related endpoints
- `/api/notifications/*` - Notification endpoints
- `/api/users/*` - User profile endpoints
- `/api/courses/*` - Course management endpoints
- `/api/mentorship/*` - Mentorship program endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email@example.com] or open an issue in the GitHub repository.
