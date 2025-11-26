Task Overview
Build a full-stack application for managing users and their posts. The boilerplate repository contains a partial backend (Node + TypeScript) and a SQLite database (data.db) with existing users, addresses, and posts.
Your task is to complete the backend endpoints, then build a frontend (React + TypeScript + Tailwind + React Query) that consumes the backend.
Candidate Instructions
1. Clone the Repository
 Clone the repository below and review its contents. You will find a “backend” folder (Node + TypeScript) and supporting files.
 Repository link: https://github.com/lema-ai/web-developer-assignment-Public
2. Set Up the Database
 The repository includes a file named “data.db” (inside the backend folder) which contains all the necessary data — users, addresses, and posts.
 Make sure the backend connects correctly to this database.
3. Backend Work – Implement Missing Features
 According to the repository README, complete the following:
Extend the user-related endpoints so that each user’s address information (street, city, state, zipcode) is included in the response.


Create a DELETE endpoint for posts by ID. It should remove that post from the database and return appropriate HTTP status codes and messages.


Create a POST endpoint to allow adding a new post for a user. It should accept Title, Body, and User ID, validate the input, and save the new post in the database.


Ensure the following endpoints are working correctly:
GET /users (with pagination)
GET /users/count
GET /posts?userId={userId}


Add proper error handling (invalid userId, invalid input, or database errors) and ensure that addresses are properly formatted.
