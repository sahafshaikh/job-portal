# Job Portal - Full Stack Application

A comprehensive job portal web application built with React.js, Node.js, Express.js, and PostgreSQL. This platform connects employers with job seekers, providing a complete solution for job posting, searching, and application management.

## 🚀 Features

### User Roles
- **Admin**: Complete system management and oversight
- **Employer**: Job posting and application management
- **Job Seeker**: Job browsing and application submission

### Core Functionality
- **Authentication**: JWT-based secure login and registration
- **Job Management**: Create, edit, delete, and browse job listings
- **Application System**: Apply for jobs and track application status
- **Search & Filter**: Advanced job search with multiple filters
- **Admin Panel**: Comprehensive dashboard with statistics and management tools
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## 🛠️ Technology Stack

### Frontend
- **React.js** with Next.js App Router
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **TypeScript** for type safety

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **bcrypt** for password hashing

### Additional Tools
- **Lucide React** for icons
- **React Hook Form** for form handling
- **Context API** for state management

## 📁 Project Structure

\`\`\`
job-portal/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   └── hooks/             # Custom hooks
├── server/                # Express.js backend
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── database/              # Database schema and seeds
│   ├── schema.sql         # Database structure
│   └── seed.sql           # Sample data
└── README.md
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. **Install PostgreSQL** and create a database:
\`\`\`sql
CREATE DATABASE job_portal;
\`\`\`

2. **Run the schema script**:
\`\`\`bash
psql -U postgres -d job_portal -f database/schema.sql
\`\`\`

3. **Seed the database** (optional):
\`\`\`bash
psql -U postgres -d job_portal -f database/seed.sql
\`\`\`

### Backend Setup

1. **Navigate to server directory**:
\`\`\`bash
cd server
\`\`\`

2. **Install dependencies**:
\`\`\`bash
npm install
\`\`\`

3. **Create environment file**:
\`\`\`bash
cp .env.example .env
\`\`\`

4. **Configure environment variables** in \`.env\`:
\`\`\`env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_portal
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
PORT=5000
\`\`\`

5. **Start the server**:
\`\`\`bash
npm run dev
\`\`\`

### Frontend Setup

1. **Navigate to client directory**:
\`\`\`bash
cd client
\`\`\`

2. **Install dependencies**:
\`\`\`bash
npm install
\`\`\`

3. **Start the development server**:
\`\`\`bash
npm run dev
\`\`\`

4. **Open your browser** and visit \`http://localhost:3000\`

## 🔐 Default Login Credentials

### Admin Account
- **Email**: admin@jobportal.com
- **Password**: admin123

### Sample Employer
- **Email**: employer1@company.com
- **Password**: password123

### Sample Job Seeker
- **Email**: jobseeker1@email.com
- **Password**: password123

## 📊 API Endpoints

### Authentication
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login

### Jobs
- \`GET /api/jobs\` - Get all jobs (with pagination and filters)
- \`GET /api/jobs/:id\` - Get single job
- \`POST /api/jobs\` - Create job (employers only)
- \`PUT /api/jobs/:id\` - Update job (employers only)
- \`DELETE /api/jobs/:id\` - Delete job (employers only)

### Applications
- \`POST /api/applications\` - Apply for job (job seekers only)
- \`GET /api/applications/my-applications\` - Get user's applications
- \`GET /api/applications/employer/applications\` - Get employer's received applications

### Admin
- \`GET /api/admin/dashboard\` - Get dashboard statistics
- \`GET /api/admin/users\` - Get all users
- \`GET /api/admin/jobs\` - Get all jobs
- \`DELETE /api/admin/users/:id\` - Delete user
- \`DELETE /api/admin/jobs/:id\` - Delete job

## 🎨 UI Components

The application uses shadcn/ui components for a consistent and modern interface:
- Forms with validation
- Data tables with pagination
- Modal dialogs
- Toast notifications
- Responsive navigation
- Dashboard cards and statistics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access Control**: Different permissions for each user type
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Backend Deployment
1. Set up a PostgreSQL database on your hosting provider
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the application: \`npm run build\`
2. Deploy to Vercel, Netlify, or similar platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Future Enhancements

- File upload for resumes and company logos
- Email notifications for applications
- Advanced search with salary ranges
- Job recommendations based on user profile
- Real-time chat between employers and job seekers
- Integration with third-party job boards
- Mobile application development

---

**Happy Job Hunting! 🎯**
\`\`\`
