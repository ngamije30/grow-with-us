# Grow WithUs is a website that will encourage young people to search for jobs and gain necessary skills to do any dream job of theirs all over Africa due to the limited access to job opportunities and the skills gap that prevents many from securing meaningful employment and this design will differ from other design regarding that the design will be able to keep track of its users where they go and also use provided mentors on the website to learn and help them achieve their goal.


A full-stack web application built with Next.js, Express, and PostgreSQL.

## Project Structure
grow-with-us/
├── Backend-Development/
│ └── grow-with-us-backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── middlewares/
│ │ └── app.ts
│ ├── prisma/
│ └── .env
└── Frontend-Development/
└── grow-with-us/
├── src/
│ ├── app/
│ ├── components/
│ └── lib/
├── public/
└── .env.local

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd grow-with-us
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend-Development/grow-with-us-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Update the `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/grow_with_us"
JWT_SECRET="your-secret-key"
PORT=5000
```

Initialize the database:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start the backend server
npm run dev
```

The backend server will run on http://localhost:5000

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend-Development/grow-with-us

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
```

Update the `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Available Scripts

### Backend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## API Endpoints

### Authentication
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile

### Messages
- GET `/api/messages` - Get user messages
- POST `/api/messages` - Send message
- GET `/api/messages/:id` - Get specific message
- DELETE `/api/messages/:id` - Delete message

### Media
- POST `/api/media/upload` - Upload media
- GET `/api/media` - Get user media
- DELETE `/api/media/:id` - Delete media

## Common Issues and Solutions

### Backend Issues

1. Database Connection Error
```bash
# Check PostgreSQL service
sudo service postgresql status

# Reset database
npx prisma migrate reset
```

2. Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### Frontend Issues

1. Dependencies Installation
```bash
# Clear npm cache
npm cache clean --force
# Reinstall dependencies
rm -rf node_modules
npm install
```

2. Build Errors
```bash
# Clear next.js cache
rm -rf .next
npm run build
```

## Deployment

### Backend Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables:
```bash
DATABASE_URL=your-production-db-url
JWT_SECRET=your-production-secret
```

3. Start the server:
```bash
npm run start
```

### Frontend Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables:
```bash
NEXT_PUBLIC_API_URL=your-backend-url
```

3. Start the server:
```bash
npm run start
```

## Security Considerations

1. Always use HTTPS in production
2. Keep dependencies updated
3. Use environment variables for sensitive data
4. Implement rate limiting
5. Set up proper CORS configuration

## Development Best Practices

1. Follow Git workflow
2. Write meaningful commit messages
3. Use TypeScript strictly
4. Write tests for new features
5. Document API changes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
