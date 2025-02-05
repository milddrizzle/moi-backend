Project Documentation

This document explains the key API routes on the server and provides step-by-step instructions on how to deploy this server and PostgreSQL database using Render.

1. API Routes

/user Route
Purpose:
The /user route is used to save a user's name and email address to the database.
Functionality:
Receives a POST request with a payload containing the user's name and email.
Validates the input.
Saves the user details to the database.
Returns a success or error response depending on the outcome.
Example Request (JSON):
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
Response Example:
{
  "message": "User saved successfully",
  "userId": "generated_user_id"
}

/names Route
Purpose:
The /names route streams baby names along with their meanings from OpenAI.
Functionality:
Receives a GET request with query parameters (e.g., gender, name origin, meaning, due date, names to avoid, version, and name type).
Dynamically builds a prompt based on the query parameters.
Initiates a streaming request to OpenAI's API.
Streams the response back to the client using Server-Sent Events (SSE).
A special message [DONE] is used to communicate the end of the stream.
Example Query Parameters:
http://localhost:3900/names?gender=male&name_origin=English&due_date=2025-02-03
Response Behavior:
The client will first receive a special message with the zodiac sign if available.
Followed by streaming chunks of text containing names and their meanings.
The stream is terminated with a [DONE] message.


2. Deploying the Server on Render

Open your Render dashboard.
Click "New" and select "Web Service".

Set build command to npm run build and start command to node dist/index.js

Under Environment, add the environment variable - postgres db internal key and open ai key
Save the open ai key with the name OPENAI_API_KEY
Click on deploy
Deploy:
Render will automatically build and deploy the server


3. Deploying a PostgreSQL Database on Render
Go back to your Render dashboard.

Create a New PostgreSQL Database:

Click "New" and choose "PostgreSQL".
Provide a name for your database.
Select the desired region, plan, and version.
Click "Create Database".
Configuration:

Once the database is created, Render will display the connection details (host, database name, user, password, and port).
Copy the internal database url for use in the server and the external url for local use. They're both important
Connect Your Server to PostgreSQL:

Open the moi server again, on the navigation menu go to Environment
Add the internal database url with the key saved as DATABASE_URL

Launch the server on your locally on your laptop
Run npm install for all necessary packages
Create a .env in the root of your folder and add the DATABASE_URL=the external database url from render
DON'T USE THE INTERNAL KEY HERE
Then npx prisma migrate dev --name init
Then npx prisma migrate deploy

This will add the necessary table to the db so it can start saving user details