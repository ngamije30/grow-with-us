# Grow with Us Platform

A comprehensive platform designed to help professionals grow their careers with job opportunities, mentorship programs, and skills development.

## Project Structure

This project consists of two main components:

1. **Backend API** (Node.js + Express + TypeScript + MongoDB)
2. **Frontend SPA** (Next.js + React + TypeScript)

### Backend API

The backend API is located in the `grow-with-us-backend` directory and provides RESTful endpoints for:

- User authentication and profile management
- Job listings and applications
- Mentorship programs and enrollment
- Skills directory and resources

For detailed documentation on the API endpoints and models, see the [Backend README](./grow-with-us-backend/README.md).

### Frontend Application

The frontend application will be implemented separately and will consume the backend API for:

- User registration and login
- Job search and applications
- Finding and enrolling in mentorship programs
- Discovering and learning new skills

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- MongoDB (local or Atlas)
- Bun package manager

### Running the Backend

```bash
cd grow-with-us-backend
bun install
bun run dev
```

The API will be available at http://localhost:5000.

## Environment Variables

Make sure to create a `.env` file in the backend directory with the required environment variables. See the backend README for details.

## Features

- **User Management**: Registration, login, profile management
- **Job Marketplace**: Browse, search, and apply for jobs
- **Mentorship Programs**: Find mentors, enroll in programs
- **Skills Development**: Discover and learn new skills with curated resources
- **Admin Dashboard**: Manage users, jobs, mentorships, and skills

## Security

The application implements several security measures:

- JWT-based authentication
- Password hashing
- Rate limiting
- CORS configuration
- Security headers

## License

MIT
