<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Bookshelf App - Copilot Instructions

This is a React TypeScript application for managing personal book collections with drag-and-drop functionality.

## Project Context
- **Framework**: React 19 with TypeScript and Vite
- **Styling**: Tailwind CSS with custom book/shelf theme
- **Backend**: Firebase (Authentication + Firestore)
- **Drag & Drop**: @dnd-kit/core and @dnd-kit/sortable
- **Icons**: react-icons

## Key Features
- User authentication with Firebase Auth
- Real-time book synchronization with Firestore
- Drag-and-drop books between shelves ("Want to Read", "Currently Reading", "Finished Reading")
- Beautiful bookshelf UI with book spine visuals
- Book search and details modal
- Reading statistics

## Code Patterns
- Use TypeScript interfaces for all data structures
- Implement custom hooks for data management (useShelf)
- Use compound component patterns for modals and complex UI
- Follow React 19 patterns with modern hooks
- Implement proper error boundaries and loading states

## Styling Guidelines
- Use Tailwind classes with semantic naming
- Implement book spine designs with gradients and shadows
- Create wooden shelf aesthetics with custom colors
- Use smooth animations for drag-and-drop interactions
- Ensure responsive design for mobile and desktop

## Firebase Integration
- Structure Firestore as: `bookshelves/{userId}/shelves/{status}`
- Implement real-time listeners for live updates
- Handle offline scenarios gracefully
- Use proper security rules for user data isolation
