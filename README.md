# Fuwa Touch API

A comprehensive booking system backend built with NestJS, featuring user authentication, service management, and appointment scheduling.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Service Management**: Admin can create, update, and delete services
- **Booking System**: Users can create, view, and modify their bookings
- **Admin Dashboard**: Admins can manage all bookings and change booking statuses
- **Role-Based Access**: Separate permissions for users and admins
- **Real-time Updates**: Users can edit their pending bookings
- **Comprehensive API**: RESTful API with full CRUD operations

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd final-project-be-herlindaapr
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory EXAMPLE:
```env
# Database
DATABASE_URL="postgresql://(your-username):(your-password)@localhost:5432/fuwa_touch_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# Server Port (optional)
PORT=8080
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database (optional)
npm run db:seed
```

### 5. Start the application
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:8080`

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:
- **Swagger UI**: `http://localhost:8080/api`

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### User Roles
- **User**: Can create bookings, view own bookings, edit pending bookings
- **Admin**: Can manage all bookings, create services, change booking statuses

## 📖 API Endpoints

### Authentication
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
```

### Services
```
GET    /api/services           # Get all services (public)
POST   /api/services           # Create service (admin only)
GET    /api/services/my-services # Get admin's services
GET    /api/services/:id       # Get service by ID
PATCH  /api/services/:id       # Update service (admin only)
DELETE /api/services/:id       # Delete service (admin only)
```

### Bookings
```
POST   /api/bookings                    # Create booking (user only)
GET    /api/bookings                    # Get all bookings (admin only)
GET    /api/bookings/my-bookings        # Get user's bookings
GET    /api/bookings/my-stats           # Get user's booking statistics
GET    /api/bookings/by-date            # Get bookings by date
GET    /api/bookings/:id                # Get booking by ID
PATCH  /api/bookings/:id                # Update booking (admin only)
PATCH  /api/bookings/:id/status         # Update booking status (admin only)
PATCH  /api/bookings/:id/user-update    # Update own booking (user only)
DELETE /api/bookings/:id                # Delete booking
```

## 💡 Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a booking (User)
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingDate": "2025-08-25T15:00:00.000Z",
    "services": ["1", "2"],
    "notes": "Please use organic products"
  }'
```

### Update booking status (Admin)
```bash
curl -X PATCH http://localhost:8080/api/bookings/1/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

### Update own booking (User)
```bash
curl -X PATCH http://localhost:8080/api/bookings/1/user-update \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingDate": "2025-08-26T16:00:00.000Z",
    "services": ["1", "3"],
    "notes": "Changed my preferences"
  }'
```

## 🗃️ Database Schema

### User
- `id`: Unique identifier
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role (user/admin)

### Service
- `id`: Unique identifier
- `adminId`: ID of admin who created the service
- `name`: Service name
- `description`: Service description
- `price`: Price in smallest currency unit
- `durationMinutes`: Service duration

### Booking
- `id`: Unique identifier
- `userId`: ID of user who made the booking
- `bookingDate`: Appointment date and time
- `status`: Booking status (pending/confirmed/completed/cancelled)
- `notes`: Additional notes
- `handledByAdminId`: ID of admin who handled the booking

### BookingService
- Junction table linking bookings to services
- Supports multiple services per booking

## 🔧 Development

### Available Scripts
```bash
npm run start:dev    # Start development server with hot reload
npm run build        # Build for production
npm run start:prod   # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:e2e     # Run end-to-end tests
```

### Database Commands
```bash
npx prisma studio          # Open Prisma Studio (database GUI)
npx prisma migrate dev     # Create and apply new migration
npx prisma db push         # Push schema changes to database
npx prisma generate        # Generate Prisma client
npm run db:seed           # Seed database with sample data
```

## 🚦 Booking Status Flow

1. **Pending**: Initial status when user creates booking
2. **Confirmed**: Admin confirms the booking
3. **Completed**: Service has been completed
4. **Cancelled**: Booking has been cancelled

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS enabled for specified origins

## 🌐 CORS Configuration

The API accepts requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`
- `http://localhost:4173`

## 📝 Business Rules

### For Users:
- Can only view and edit their own bookings
- Can only edit bookings with "pending" status
- Cannot change booking status (only admins can)
- Can book multiple services in one appointment

### For Admins:
- Can view and manage all bookings
- Can change booking status to any valid status
- Can create, edit, and delete any service
- Can view booking statistics and reports

## 🐛 Error Handling

The API returns standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Validation error message",
  "error": "Bad Request"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

## 📦 Project Structure

```
src/
├── auth/           # Authentication module
├── booking/        # Booking management
├── booking-service/ # Booking-service junction
├── service/        # Service management
├── user/           # User management
├── prisma/         # Database service
└── main.ts         # Application entry point

prisma/
├── migrations/     # Database migrations
├── schema.prisma   # Database schema
└── seed.ts         # Database seeding
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 👥 Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using NestJS and Prisma**
