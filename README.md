# CV Portfolio Application

An interactive CV/portfolio application built with React frontend and .NET backend with SQL Server database.

## Features

- **Interactive CV Page**: Showcase personal information, bio, and social links
- **Project Gallery**: Display all projects with images, descriptions, and links
- **Project Details**: Detailed view of each project with code snippets and explanations
- **Live Demos**: Links to live project demonstrations
- **Code Showcase**: Display code snippets with explanations

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Vite
- CSS3

### Backend
- .NET 9.0
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v20.18.2 or higher) and npm
- **.NET SDK** (9.0 or higher)
- **SQL Server** (LocalDB or Express) or SQL Server
- **Git**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd diegosantoscv
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend/CvApi
```

#### Update Connection String

Edit `appsettings.json` to update the SQL Server connection string if needed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CvDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

#### Create Database

Run Entity Framework migrations to create the database:

```bash
dotnet ef database update
```

#### Run the Backend

```bash
dotnet run
```

The API will be available at `https://localhost:7000` (or the port shown in the console).

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

#### Update API URL (if needed)

Edit `src/services/api.js` and update the `API_BASE_URL` if your backend runs on a different port:

```javascript
const API_BASE_URL = 'https://localhost:7000/api';
```

#### Run the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in the console).

## Project Structure

```
diegosantoscv/
├── backend/
│   └── CvApi/
│       ├── Controllers/      # API controllers
│       ├── Data/             # DbContext
│       ├── Models/           # Data models
│       └── Migrations/       # EF migrations
├── frontend/
│   └── src/
│       ├── components/       # React components
│       ├── services/         # API service
│       └── App.jsx           # Main app component
└── README.md
```

## API Endpoints

### CV Info
- `GET /api/CvInfo` - Get CV information
- `POST /api/CvInfo` - Create CV information
- `PUT /api/CvInfo/{id}` - Update CV information

### Projects
- `GET /api/Projects` - Get all projects
- `GET /api/Projects/{id}` - Get project by ID
- `POST /api/Projects` - Create a new project
- `PUT /api/Projects/{id}` - Update a project
- `DELETE /api/Projects/{id}` - Delete a project

## Swagger Documentation

When running in development mode, Swagger UI is available at:
`https://localhost:7000/swagger`

## Adding Data

You can add CV information and projects through:
1. The Swagger UI (development mode)
2. Direct SQL queries to the database
3. Creating a seed data script

## Database Schema

### CvInfo
- Id (Primary Key)
- Name
- Title
- Bio
- Email
- LinkedInUrl
- GitHubUrl
- ProfileImageUrl
- CreatedAt
- UpdatedAt

### Project
- Id (Primary Key)
- Title
- Description
- LiveUrl
- RepositoryUrl
- ImageUrl
- CodeSnippet
- CodeExplanation
- Technologies (comma-separated)
- DisplayOrder
- CreatedAt
- UpdatedAt

## Development

### Running Both Frontend and Backend

1. Open two terminal windows
2. In the first terminal, run the backend:
   ```bash
   cd backend/CvApi
   dotnet run
   ```
3. In the second terminal, run the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## License

This project is for personal/portfolio use.

