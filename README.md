
# YouTube Clone Backend

Welcome to the backend of your YouTube clone built using Node.js and Express.js! This README will guide you through the setup and usage of this application.


## Authors

- [@nakshatravyas](https://www.github.com/nakshatravyas)


## Features

- User authentication: Register, login, and manage user accounts - securely.
- Video management: Upload, view, edit, and delete videos.
- Interaction handling: Like, dislike, comment on videos.
- RESTful API design: Consistent and intuitive endpoints for easy integration with the frontend.

## Installation

To install and run this application locally, follow these steps:

- Clone this repository to your local machine.
- Navigate to the project directory.
- Run "npm install" to install dependencies.
- Set up environment variables.
- Run npm start to start the server.
    
## Usage/Examples

Once the server is running, you can interact with the API endpoints using tools like Postman or cURL. Here are some of the available endpoints:

- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Login and obtain an access token.
- GET /api/videos: Get a list of all videos.
- GET /api/videos/:id: Get details of a specific video.
- POST /api/videos: Upload a new video.
- PUT /api/videos/:id: Update details of a video.
- DELETE /api/videos/:id: Delete a video.
- POST /api/videos/:id/like: Like a video.
- POST /api/videos/:id/dislike: Dislike a video.
- POST /api/videos/:id/comments: Add a comment to a video.
