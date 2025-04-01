# Coeus AI - Project Handover Document

## Project Overview
Coeus AI is an interactive educational assistant that allows users to upload PDF documents and interact with them through an AI-powered chat interface. The application provides various tools to help users understand and learn from their documents, including generating study plans, summaries, detailed explanations, and practice questions.

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

## Routing Structure

Coeus AI uses Next.js App Router for page routing and navigation. Here's a comprehensive overview of the application's routing structure:

### Public Pages
- **Home Page** (`/`): The main application interface with PDF upload, chat, and toolbox functionality
- **About Page** (`/about`): Information about Coeus AI, its purpose, and key features
- **Contact Page** (`/contact`): Developer contact information and social media links
- **Authentication Pages**:
  - Login Page (`/auth/login`): User login with email and password
  - Registration Page (`/auth/register`): New user registration
  - Error Page (`/auth/error`): Authentication error handling

### Protected Pages
- **Profile Page** (`/profile`): User profile management (requires authentication)

### API Routes
- **Authentication API**:
  - NextAuth API (`/api/auth/[...nextauth]`): Handles authentication flows
  - Registration API (`/api/auth/register`): Handles user registration
- **Chat API** (`/api/chat`): Processes chat messages and AI responses
- **PDF Upload API** (`/api/upload-pdf`): Handles PDF file uploads
- **User Profile API** (`/api/user/profile`): Manages user profile updates

### Navigation Implementation
- The Header component (`/src/components/Header.tsx`) provides the main navigation structure:
  - Logo links to the home page
  - Navigation links to Home, About, and Contact pages
  - Authentication status determines available options:
    - Unauthenticated users see Sign In and Sign Up buttons
    - Authenticated users see a user dropdown with Profile and Sign Out options

### Route Protection
- Middleware (`/src/middleware.ts`) handles route protection:
  - Public routes (`/about`, `/contact`, `/auth/*`, etc.) are accessible to all users
  - Protected routes (like `/profile` and the main app `/`) require authentication
  - Unauthenticated users attempting to access protected routes are redirected to the login page
  - After successful authentication, users are redirected to their originally requested page via callback URL

### Authentication Flow
- Login process:
  1. User enters credentials on the login page
  2. Credentials are validated against the database
  3. Upon successful authentication, a session is created
  4. User is redirected to the requested page or home page
- Registration process:
  1. User enters details on the registration page
  2. Form validation ensures data integrity
  3. User data is stored in the database with hashed password
  4. User is redirected to the login page or automatically signed in

## Key Components

### 1. PDF Viewer
The PDF Viewer component (`/src/components/PDFViewer/PDFViewer.tsx`) handles:
- PDF file uploads with drag-and-drop functionality
- File validation (PDF format, size limit of 10MB)
- PDF rendering with pagination controls
- Converting the PDF to base64 format for the Gemini API
- Passing the PDF data to the parent component for processing
- **PDF Removal**: A "Remove PDF" button positioned in the bottom right next to pagination controls that allows users to remove the currently uploaded PDF and upload a new one

Implementation notes:
- Uses react-pdf for rendering PDFs
- Includes error handling for invalid files
- Provides visual feedback during drag-and-drop operations
- The PDF removal feature includes a toast notification to confirm removal and reset of the viewer state

### 2. Chat Interface
The main chat interface (`/src/app/page.tsx`) includes:
- A message list that displays both user and AI messages
- A chat input component for user queries
- Action buttons for each AI message (Copy, Regenerate)
- Integration with the Toolbox component
- Streaming response handling for real-time AI feedback

Implementation notes:
- Uses shadcn-chat components for the UI
- Implements a streaming response pattern for real-time updates
- Stores message history with unique IDs for each message
- Preserves original prompt data for regeneration functionality

### 3. Toolbox
The Toolbox component (`/src/components/Toolbox.tsx`) provides quick-access buttons for common AI operations:
- Study Plan generation
- Quick Summary
- Detailed Explanation
- Practice Questions

Implementation notes:
- Each tool triggers a specific prompt template in the API
- Uses custom icons from the Icons component
- Implements tooltips for better UX

### 4. Authentication System
The authentication system provides user registration, login, and session management:

#### Authentication Components:
- **Login Page** (`/src/app/auth/login/page.tsx`): Handles user login with email and password
- **Register Page** (`/src/app/auth/register/page.tsx`): Handles new user registration
- **NextAuth Configuration** (`/src/app/api/auth/[...nextauth]/route.ts`): Sets up authentication providers and callbacks
- **Registration API** (`/src/app/api/auth/register/route.ts`): Handles user registration with password hashing
- **Middleware** (`/src/middleware.ts`): Protects routes based on authentication status
- **Header Component** (`/src/components/Header.tsx`): Displays login/register buttons or user dropdown based on authentication status

Implementation notes:
- Uses NextAuth.js with JWT strategy for session management
- Implements Credentials provider for email/password authentication
- Uses Prisma to interact with the SQLite database for user storage
- Implements bcryptjs for secure password hashing and verification
- Provides protected routes with middleware redirection
- Custom login and registration pages with form validation using Zod

## API Implementation

### Chat API
The chat API (`/src/app/api/chat/route.ts`) handles:
- Processing user messages and tool requests
- Constructing appropriate prompts based on the request type
- Sending requests to the Google Gemini API with the PDF data
- Streaming the AI responses back to the client

Implementation notes:
- Uses the Google Generative AI SDK
- Implements server-side streaming for real-time responses
- Handles both text-only and PDF-based queries
- Provides predefined prompts for toolbox operations

### PDF Upload API
The PDF upload API (`/src/app/api/upload-pdf/route.ts`) handles:
- Receiving PDF files via FormData
- Validating the file type
- Converting the PDF to base64 format
- Returning the processed data to the client

### Authentication API
The authentication API includes:
- **NextAuth API** (`/src/app/api/auth/[...nextauth]/route.ts`): Handles login, session management, and JWT operations
- **Registration API** (`/src/app/api/auth/register/route.ts`): Handles new user creation with password hashing

## Technical Considerations

### PDF Handling
- **Size Limitations**: The application has a 10MB limit for PDF uploads to prevent performance issues and stay within API limits.
- **Base64 Encoding**: PDFs are converted to base64 for transmission to the Gemini API, which increases the payload size by approximately 33%.
- **PDF Rendering**: The application uses react-pdf with worker configuration to render PDFs client-side.
- **PDF Removal**: The application allows users to remove the current PDF and upload a new one without refreshing the page, improving user experience when working with multiple documents.

### AI Integration
- **Model Selection**: The application uses the Gemini 2.0 Flash model for optimal performance and cost.
- **Multimodal Inputs**: The API can process both text and PDF inputs simultaneously.
- **Streaming Responses**: Implements a streaming pattern for real-time AI responses, improving user experience.

### Authentication & Security
- **Password Security**: Passwords are hashed using bcryptjs before storage
- **JWT Sessions**: Uses JWT for stateless authentication
- **Protected Routes**: Middleware ensures only authenticated users can access protected content
- **Form Validation**: Client-side validation using Zod schema validation
- **Error Handling**: Comprehensive error handling for authentication failures
- **Route Protection**: Middleware-based route protection with callback URL redirection
- **Authentication Flow**: Complete login and registration flow with session management

### State Management
- **Message History**: The application maintains a message history with unique IDs for each message.
- **Regeneration**: The application preserves original prompt data to enable regeneration of AI responses.
- **Loading States**: Implements loading indicators during API calls for better UX.
- **PDF State Management**: The application tracks the current PDF state and provides appropriate UI based on whether a PDF is loaded or not.
- **Authentication State**: Uses NextAuth's useSession hook to manage and access authentication state throughout the application

## UI/UX Considerations
- **Responsive Design**: The interface uses a resizable panel layout that adapts to different screen sizes.
- **Theme Support**: Implements light/dark mode via the ThemeProvider component.
- **Accessibility**: Uses shadcn/ui components which have built-in accessibility features.
- **Error Handling**: Implements toast notifications for user feedback on errors.
- **User Feedback**: Provides clear feedback for actions like PDF removal with toast notifications.
- **Authentication UI**: Clean, user-friendly login and registration forms with validation feedback

## Database Schema
The application uses Prisma with SQLite for data persistence:

### User Model
- `id`: String (Primary Key, CUID)
- `name`: String (Optional)
- `email`: String (Unique)
- `password`: String (Hashed)
- `emailVerified`: DateTime (Optional)
- `image`: String (Optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `sessions`: Relation to Session model

### Session Model
- `id`: String (Primary Key, CUID)
- `sessionToken`: String (Unique)
- `userId`: String (Foreign Key to User)
- `expires`: DateTime

## Development Workflow
- The project uses Next.js with TypeScript for type safety.
- Components follow a modular structure with clear separation of concerns.
- UI components are based on shadcn/ui, which provides a consistent design system.
- API routes use the Next.js App Router pattern for serverless functions.
- Authentication is implemented using NextAuth.js with custom pages and callbacks.

## Environment Variables
- `GOOGLE_GEMINI_API_KEY`: API key for Google Gemini AI
- `DATABASE_URL`: Connection string for the SQLite database
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js JWT encryption
- `NEXTAUTH_URL`: Base URL for NextAuth.js callbacks (in production)

## Deployment Considerations
- Ensure all environment variables are properly set in the production environment
- For production, consider migrating from SQLite to a more robust database like PostgreSQL
- Set up proper CORS configuration if deploying the frontend and backend separately
- Configure proper session expiration times for security
- Implement email verification for enhanced security (currently not implemented)