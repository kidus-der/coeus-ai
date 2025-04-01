# Coeus AI

<div align="center">
  <img src="./public/coeus-logo-dark-mode.svg" alt="Coeus AI Logo" width="200" />
</div>

## Overview

Coeus AI is an interactive educational assistant that allows users to upload PDF documents and interact with them through an AI-powered chat interface. The application provides various tools to help users understand and learn from their documents, including generating study plans, summaries, detailed explanations, and practice questions. With a user-friendly interface, responsive design, and secure authentication system, Coeus AI aims to revolutionize the way students and professionals learn from their documents.

## Features

- **PDF Document Processing**: Upload and interact with PDF documents up to 25MB in size
- **AI-Powered Chat Interface**: Ask questions about your documents and receive intelligent responses
- **Toolbox with Educational Features**:
  - Generate comprehensive study plans
  - Create quick summaries of document content
  - Get detailed explanations of complex topics
  - Generate practice questions to test understanding
- **User Authentication**: Secure login and registration system with protected routes
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme
- **Real-time Streaming Responses**: See AI responses as they're generated
- **PDF Removal**: Easily remove the current PDF and upload a new one without refreshing
- **User Profile Management**: Update user information through a dedicated profile page
- **About Page**: Learn about the application's purpose and features
- **Contact Page**: Connect with the developer through social media links

## Technical Stack

- **Frontend Framework**: Next.js with React (using the App Router)
- **UI Components**: shadcn/ui (based on Radix UI) with Tailwind CSS for styling
- **PDF Processing**: react-pdf for rendering PDFs in the browser
- **File Handling**: react-dropzone for drag-and-drop file uploads
- **AI Integration**: Google Gemini 2.0 Flash model via the Google Generative AI SDK
- **Streaming Responses**: Server-side streaming for real-time AI responses
- **Authentication**: NextAuth.js for user authentication and session management
- **Database**: Prisma ORM with SQLite for user data storage
- **Password Hashing**: bcryptjs for secure password storage

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Google Gemini API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/coeus-ai.git
cd coeus-ai
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="file:./dev.db"
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000" # In development
```

4. Initialize the database

```bash
npx prisma migrate dev --name init
```

5. Start the development server

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Development

### Routing Structure

Coeus AI uses Next.js App Router for page routing and navigation. Here's an overview of the application's routing structure:

#### Public Pages
- **Home Page** (`/`): The main application interface with PDF upload, chat, and toolbox
- **About Page** (`/about`): Information about Coeus AI and its features
- **Contact Page** (`/contact`): Developer contact information and social media links
- **Authentication Pages**:
  - Login Page (`/auth/login`): User login with email and password
  - Registration Page (`/auth/register`): New user registration
  - Error Page (`/auth/error`): Authentication error handling

#### Protected Pages
- **Profile Page** (`/profile`): User profile management (requires authentication)

#### API Routes
- **Authentication API**:
  - NextAuth API (`/api/auth/[...nextauth]`): Handles authentication flows
  - Registration API (`/api/auth/register`): Handles user registration
- **Chat API** (`/api/chat`): Processes chat messages and AI responses
- **PDF Upload API** (`/api/upload-pdf`): Handles PDF file uploads
- **User Profile API** (`/api/user/profile`): Manages user profile updates

#### Navigation Flow
- The Header component provides navigation links to Home, About, and Contact pages
- Authentication status determines available navigation options:
  - Unauthenticated users see Sign In and Sign Up buttons
  - Authenticated users see a user dropdown with Profile and Sign Out options
- Protected routes redirect unauthenticated users to the login page with a callback URL
- After successful authentication, users are redirected to their originally requested page

### Database Schema

### Database Schema

The application uses Prisma with SQLite for data persistence:

#### User Model
- `id`: String (Primary Key, CUID)
- `name`: String (Optional)
- `email`: String (Unique)
- `password`: String (Hashed)
- `emailVerified`: DateTime (Optional)
- `image`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `sessions`: Relation to Session model

#### Session Model
- `id`: String (Primary Key, CUID)
- `sessionToken`: String (Unique)
- `userId`: String (Foreign Key to User)
- `expires`: DateTime

### Project Structure

```
/
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   └── profile/      # User profile page
│   ├── components/       # React components
│   │   ├── PDFViewer/    # PDF viewing components
│   │   ├── auth/         # Authentication components
│   │   └── ui/           # UI components
│   ├── lib/              # Utility functions and libraries
│   └── types/            # TypeScript type definitions
└── ...config files
```

## Deployment

For production deployment, consider the following:

1. Migrate from SQLite to a more robust database like PostgreSQL
2. Set up proper CORS configuration if deploying the frontend and backend separately
3. Configure proper session expiration times for security
4. Implement email verification for enhanced security (currently not implemented)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

## Environment Variables

- `GOOGLE_GEMINI_API_KEY`: API key for Google Gemini AI
- `DATABASE_URL`: Connection string for the SQLite database
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js JWT encryption
- `NEXTAUTH_URL`: Base URL for NextAuth.js callbacks (in production)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
