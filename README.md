# Task Manager Application

A full-stack Task Manager built with Next.js, Firebase, Redux Toolkit, and Material UI.

## Features

- User authentication (login/register)
- Role-based access (User/Admin)
- Task management (CRUD operations)
- Real-time updates
- Task analytics (Admin only)
- Responsive design

## Technologies

- Next.js
- Firebase (Auth + Firestore)
- Redux Toolkit
- Material UI
- Tailwind CSS
- React Hook Form

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your Firebase config
4. Run the development server: `npm run dev`

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Set up security rules (see `firestore.rules`)

## Deployment

1. Build the project: `npm run build`
2. Deploy to Vercel: `vercel`

## Screenshots

1. Login Page
![Login Page](/public/LoginPage.png)

2. Register Page
![Register Page](/public/RegisterPage.png)

3. Dashboard Page
![Dashboard](/public/Dashboard.png)
