# iTunes Search App

A React-based web application that allows users to search for content in the iTunes Store, including music, movies, podcasts, and more.

## Features

- Search for various types of media (music, movies, podcasts, etc.)
- View detailed information about search results
- Add items to favorites list
- Responsive design using Bootstrap
- Secure API communication using JWT

## Tech Stack

- Frontend: React, Bootstrap
- Backend: Node.js, Express
- API: iTunes Search API
- Authentication: JWT

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/itunes-project.git
cd itunes-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
JWT_SECRET=your_jwt_secret
PORT=5000
```

## API Endpoints

- `GET /api/search`: Search for content in the iTunes Store
  - Query parameters:
    - `term`: Search term
    - `media`: Media type (music, movie, podcast, etc.)
   
## Render link
https://itunesapp.onrender.com

## License

MIT
