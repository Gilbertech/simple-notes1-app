# Simple Notes App

A full-stack notes application built with React, TypeScript, and Supabase. This app allows users to create, read, update, and delete personal notes with secure authentication.

## Features

- **User Authentication**: Secure email/password authentication using Supabase Auth
- **Create Notes**: Add new notes with title and content
- **View Notes**: Display all notes in a responsive grid layout
- **Edit Notes**: Update existing notes with an intuitive modal form
- **Delete Notes**: Remove notes with confirmation dialog
- **Secure Data**: Row Level Security (RLS) ensures users only access their own notes
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   ├── Auth.tsx           # Authentication UI (sign in/sign up)
│   ├── NoteCard.tsx       # Individual note display component
│   └── NoteForm.tsx       # Create/edit note modal form
├── contexts/
│   └── AuthContext.tsx    # Authentication state management
├── services/
│   └── notesService.ts    # API calls for CRUD operations
├── lib/
│   └── supabase.ts        # Supabase client configuration
└── App.tsx                # Main application component
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env` file with Supabase credentials

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Database Schema

The app uses a `notes` table with the following structure:

```sql
notes
├── id (uuid, primary key)
├── title (text, required)
├── content (text)
├── user_id (uuid, foreign key to auth.users)
├── created_at (timestamp)
└── updated_at (timestamp)
```

Row Level Security policies ensure:
- Users can only view their own notes
- Users can only create notes for themselves
- Users can only update their own notes
- Users can only delete their own notes

## Usage

1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Log in with your credentials
3. **Create Note**: Click "New Note" button to open the form
4. **Edit Note**: Click the edit icon on any note card
5. **Delete Note**: Click the delete icon and confirm deletion
6. **Sign Out**: Click "Sign Out" button in the header

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check TypeScript files

## API Endpoints

The app uses Supabase's auto-generated REST API:

- `GET /notes` - Fetch all notes for authenticated user
- `POST /notes` - Create a new note
- `PUT /notes/:id` - Update an existing note
- `DELETE /notes/:id` - Delete a note

All endpoints are secured with Row Level Security and require authentication.

## Future Improvements

- Add search and filter functionality
- Implement note categories/tags
- Add markdown support for note content
- Enable note sharing between users
- Add dark mode toggle
- Implement real-time collaboration
- Add file attachments to notes
- Enable sorting options (by date, title, etc.)

## Security

- Authentication tokens are managed by Supabase Auth
- All database operations are protected by Row Level Security
- Passwords are hashed and never stored in plain text
- API keys are stored in environment variables

## License

MIT
