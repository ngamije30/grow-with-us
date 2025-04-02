# Grow with Us - Backend API

A comprehensive backend API for the Grow with Us platform, providing career resources, job opportunities, mentorship programs, and skills development for professionals.

## Stack Used

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Authentication with JWT
- File uploads with Multer and Cloudinary
- Security with Helmet and Express Rate Limit

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- MongoDB instance (local or Atlas)
- Bun package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd grow-with-us-backend
   bun install
   ```
3. Create a `.env` file based on the provided example and add your configuration

### Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grow-with-us
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the Server

- Development mode: `bun run dev`
- Production mode: `bun run start`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Jobs

- `GET /api/jobs` - Get all jobs (with filtering, sorting, pagination)
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job (protected, mentor/admin only)
- `PUT /api/jobs/:id` - Update a job (protected, owner/admin only)
- `DELETE /api/jobs/:id` - Delete a job (protected, owner/admin only)

### Mentorships

- `GET /api/mentorships` - Get all mentorships (with filtering, sorting, pagination)
- `GET /api/mentorships/:id` - Get a specific mentorship
- `POST /api/mentorships` - Create a new mentorship (protected, mentor/admin only)
- `PUT /api/mentorships/:id` - Update a mentorship (protected, owner/admin only)
- `DELETE /api/mentorships/:id` - Delete a mentorship (protected, owner/admin only)
- `POST /api/mentorships/:id/enroll` - Enroll in a mentorship (protected)
- `DELETE /api/mentorships/:id/enroll` - Unenroll from a mentorship (protected)

### Skills

- `GET /api/skills` - Get all skills (with filtering, sorting, pagination)
- `GET /api/skills/:id` - Get a specific skill
- `POST /api/skills` - Create a new skill (protected, admin only)
- `PUT /api/skills/:id` - Update a skill (protected, admin only)
- `DELETE /api/skills/:id` - Delete a skill (protected, admin only)
- `POST /api/skills/:id/resources` - Add a resource to a skill (protected, mentor/admin only)
- `DELETE /api/skills/:id/resources/:resourceId` - Remove a resource from a skill (protected, admin only)

## Models

### User

- `name` - Full name of the user
- `email` - Email address (unique)
- `password` - Hashed password
- `role` - User role (user, mentor, admin)
- `bio` - User biography
- `avatar` - Profile picture URL
- `skills` - Array of skills
- `experience` - Years of experience

### Job

- `title` - Job title
- `company` - Company name
- `description` - Job description
- `location` - Job location
- `type` - Job type (full-time, part-time, contract, internship, remote)
- `salary` - Salary information (min, max, currency)
- `requirements` - Array of job requirements
- `skills` - Array of required skills
- `applicationUrl` - Application URL
- `contactEmail` - Contact email
- `logo` - Company logo URL
- `postedBy` - User who posted the job (reference to User)
- `expiresAt` - Expiration date

### Mentorship

- `mentor` - Mentor user (reference to User)
- `title` - Mentorship title
- `description` - Mentorship description
- `skills` - Array of skills covered
- `duration` - Duration in weeks
- `capacity` - Maximum number of mentees
- `enrolled` - Array of enrolled users (reference to User)
- `status` - Status (open, closed, completed)
- `startDate` - Start date
- `endDate` - End date

### Skill

- `name` - Skill name
- `category` - Category (technical, soft, business, other)
- `description` - Skill description
- `resources` - Array of learning resources (title, URL, type)

## Security and Rate Limiting

The API implements several security measures:

- JWT-based authentication
- Password hashing with bcrypt
- Request rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers

## File Upload

The API supports file uploads using Multer for handling multipart/form-data with options to store files locally or in Cloudinary.
