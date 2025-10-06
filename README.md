Here's a comprehensive README file:

```markdown
# Book Club Application

A full-stack Book Club application built with Fastify + TypeScript backend and React + TailwindCSS frontend.

## 🚀 Tech Stack

### Backend
- **Framework**: Fastify + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Fastify validation
- **Container**: Docker

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **HTTP Client**: Fetch API

## 📁 Project Structure

```
book-club-app/
├── backend/                 # Fastify API server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── prisma/         # Database schema and migrations
│   │   └── server.ts       # Server entry point
│   ├── package.json
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml      # Database configuration
└── README.md
```

## 🛠️ Prerequisites

- Docker and Docker Compose
- Node.js (v18 or higher) - for local development

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone [your-repo-url]
cd book-club-app
```

### 2. Start the database
```bash
docker-compose up -d
```

### 3. Setup and run the backend
```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
docker exec -it fastify_backend npx prisma generate

# Run database migrations
docker exec -it fastify_backend npx prisma migrate dev --name init

# Seed the database (optional)
docker exec -it fastify_backend npx prisma db seed

# Start the backend server
npm run dev
```
Backend runs on: `http://localhost:3000`

### 4. Setup and run the frontend
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
Frontend runs on: `http://localhost:5173`

## 📊 API Endpoints

### Authors
- `GET /authors` - List all authors (with pagination)
- `GET /authors/:id` - Get author details
- `POST /authors` - Create new author
- `PUT /authors/:id` - Update author
- `DELETE /authors/:id` - Delete author

### Books
- `GET /books` - List all books (with pagination/filtering)
- `GET /books/:id` - Get book details
- `POST /books` - Create new book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book

### Additional
- `GET /bookclub/carousel` - Get latest books for carousel
- `GET /bookclub/recommended` - Get recommended books
- `GET /search` - Search books and authors
- `GET /dashboard/stats` - Get dashboard statistics

## 🗃️ Database Schema

### Authors Table
```sql
id: Int (Primary Key)
name: String
bio: String?
image: String?
createdAt: DateTime
updatedAt: DateTime
```

### Books Table
```sql
id: Int (Primary Key)
title: String
description: String?
publishedYear: Int?
authorId: Int (Foreign Key)
coverImage: String?
pdf: String?
createdAt: DateTime
updatedAt: DateTime
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://bookclub:password@localhost:5432/bookclub_db"
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 📝 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed the database
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Database Commands
```bash
# Generate Prisma client
docker exec -it fastify_backend npx prisma generate

# Create and run migrations
docker exec -it fastify_backend npx prisma migrate dev --name [migration_name]

# Reset database
docker exec -it fastify_backend npx prisma migrate reset

# View database (Prisma Studio)
docker exec -it fastify_backend npx prisma studio
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

## 🎯 Features

### Backend Features
- ✅ Type-safe database operations with Prisma
- ✅ Request validation and error handling
- ✅ File upload support (images and PDFs)
- ✅ Pagination and filtering
- ✅ Search functionality
- ✅ CORS enabled

### Frontend Features
- ✅ Responsive design with TailwindCSS
- ✅ CRUD operations for books and authors
- ✅ Form validation with error messages
- ✅ Loading states and error handling
- ✅ Search and filter functionality
- ✅ File upload with preview
- ✅ Pagination

## 🔄 Development Workflow

1. **Start database**: `docker-compose up -d`
2. **Run backend**: `cd backend && npm run dev`
3. **Run frontend**: `cd frontend && npm run dev`
4. **Access applications**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Prisma Studio: http://localhost:5555

## 🗂️ Database Management

### Common Prisma Commands
```bash
# Generate Prisma client (after schema changes)
docker exec -it fastify_backend npx prisma generate

# Create migration
docker exec -it fastify_backend npx prisma migrate dev --name add_new_field

# Reset and seed database
docker exec -it fastify_backend npx prisma migrate reset

# Open Prisma Studio (database GUI)
docker exec -it fastify_backend npx prisma studio
```

## 🚨 Troubleshooting

### Common Issues

1. **Database connection issues**
   - Ensure Docker is running
   - Run `docker-compose up -d` to start database
   - Check if PostgreSQL container is running: `docker ps`

2. **Prisma client issues**
   - Run `docker exec -it fastify_backend npx prisma generate`
   - Restart backend server

3. **Port already in use**
   - Change ports in respective configuration files
   - Kill processes using the ports

4. **File upload issues**
   - Check uploads directory permissions
   - Verify file size limits

## 📞 Support

For any issues or questions, please check:
1. Docker and Docker Compose are installed and running
2. All environment variables are set correctly
3. Database container is running (`docker ps`)
4. Ports 3000 (backend), 5173 (frontend), and 5432 (database) are available

---

**Happy Coding!** 🎉
```

This README provides:

1. **Clear setup instructions** with the specific commands you mentioned
2. **Port information** for both frontend (5173) and backend (3000)
3. **Database management commands** including the Prisma commands you specified
4. **Troubleshooting section** for common issues
5. **Comprehensive documentation** of all features and endpoints
6. **Easy-to-follow structure** for quick setup

The README is professional and provides everything needed to get the project running locally.