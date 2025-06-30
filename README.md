# Bookshelf App

A modern React + TypeScript application to manage your personal book collection with drag-and-drop between shelves, Firebase authentication, and a beautiful bookshelf UI.

## Features
- User authentication with Firebase Auth
- Real-time book sync with Firestore
- Drag-and-drop books between shelves (Want to Read, Currently Reading, Finished Reading)
- Book search (Google Books API)
- Book details modal
- Responsive, bookshelf-inspired UI with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (get your config from the Firebase console)
- (Optional) Google Books API key for enhanced search

### Setup
1. Clone this repo or copy the files into your project directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure Firebase:
   - Edit `src/firebase.ts` with your Firebase project credentials.
4. (Optional) Add your Google Books API key to a `.env` file:
   ```env
   VITE_GOOGLE_BOOKS_API_KEY=your_key_here
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## VS Code Tasks
- Use the built-in task **Run Vite Dev Server** to start the app from VS Code.

## Project Structure
- `src/components/` — UI components
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript interfaces
- `src/firebase.ts` — Firebase config

## License
MIT
