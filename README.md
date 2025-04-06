# Grow withUs

Grow withUs is a comprehensive platform designed to help young people search for jobs and gain necessary skills across Africa. The platform addresses the limited access to job opportunities and skills gap that prevents many from securing meaningful employment.

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
