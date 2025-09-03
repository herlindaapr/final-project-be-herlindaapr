import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto, UpdateBookingStatusDto, UserUpdateBookingDto, BookingResponseDto, BookingQueryDto, PaginatedBookingResponseDto, CheckAvailabilityDto, CheckAvailabilityResponseDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { ValidatedUser } from 'src/auth/strategies/jwt.strategy';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.user)
  @ApiOperation({ summary: 'Create a new booking (User only)' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - User role required' })
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: any) {
    return this.bookingService.create(user.id, createBookingDto);
  }

  @Get('my-bookings')
  @UseGuards(RolesGuard)
  @Roles(Role.user)
  @ApiOperation({ summary: 'Get current user booking history with filtering and pagination' })
  @ApiQuery({ name: 'serviceName', required: false, description: 'Filter by service name' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by booking status' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  @ApiResponse({
    status: 200,
    description: 'User bookings retrieved successfully',
    type: PaginatedBookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - User role required' })
  getMyBookings(@CurrentUser() user: any, @Query() query: BookingQueryDto) {
    return this.bookingService.findByUserId(user.id, query);
  }

  @Get('my-stats')
  @UseGuards(RolesGuard)
  @Roles(Role.user)
  @ApiOperation({ summary: 'Get current user booking statistics for dashboard' })
  @ApiResponse({
    status: 200,
    description: 'User booking statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalBookings: { type: 'number', example: 15 },
        pendingBookings: { type: 'number', example: 3 },
        confirmedBookings: { type: 'number', example: 5 },
        completedBookings: { type: 'number', example: 6 },
        cancelledBookings: { type: 'number', example: 1 },
        upcomingBookings: { type: 'number', example: 8 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - User role required' })
  getMyBookingStats(@CurrentUser() user: any) {
    return this.bookingService.getUserBookingStats(user.id);
  }

  @Post('check-availability')
  @ApiOperation({ 
    summary: 'Check if a time slot is available for booking',
    description: 'Checks if the requested time slot conflicts with existing confirmed bookings for the same services'
  })
  @ApiResponse({
    status: 200,
    description: 'Availability check completed successfully',
    type: CheckAvailabilityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'One or more services not found' })
  checkAvailability(@Body() checkAvailabilityDto: CheckAvailabilityDto) {
    return this.bookingService.checkAvailability(checkAvailabilityDto);
  }

  @Get('confirmed-for-date/:date')
  @ApiOperation({ 
    summary: 'Get all confirmed bookings for a specific date',
    description: 'Returns all confirmed bookings for the specified date to prevent overlapping appointments'
  })
  @ApiParam({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    example: '2025-08-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirmed bookings for date retrieved successfully',
    type: [BookingResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getConfirmedBookingsForDate(@Param('date') date: string) {
    return this.bookingService.getConfirmedBookingsForDate(date);
  }

  @Get('by-date')
  @ApiOperation({ summary: 'Get all bookings by specific date (for appointment planning)' })
  @ApiQuery({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    example: '2025-08-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings by date retrieved successfully',
    type: [BookingResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getBookingsByDate(@Query('date') date: string) {
    return this.bookingService.findByDate(date);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get all bookings (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Update booking (Admin only)' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Booking updated successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser() user: any,
  ) {
    return this.bookingService.update(id, updateBookingDto, user);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ 
    summary: 'Update booking status (Admin only)',
    description: 'Updates only the booking status. Notes are optional - if not provided, existing notes remain unchanged.'
  })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Booking status updated successfully. Notes field will contain existing notes if not updated.',
    type: BookingResponseDto,
    schema: {
      example: {
        id: 1,
        userId: 5,
        bookingDate: '2025-08-15T10:00:00.000Z',
        status: 'confirmed',
        notes: 'Original booking notes remain unchanged',
        handledByAdminId: 2,
        createdAt: '2025-08-19T10:30:00.000Z',
        updatedAt: '2025-08-19T14:45:00.000Z',
        user: {
          id: 5,
          name: 'John Doe',
          email: 'john@example.com'
        },
        handledByAdmin: {
          id: 2,
          name: 'Admin User',
          email: 'admin@example.com'
        },
        bookingServices: [
          {
            id: 1,
            bookingId: 1,
            serviceId: 3,
            quantity: 1,
            service: {
              id: 3,
              name: 'Hair Cut',
              description: 'Professional hair cutting service',
              price: 50000,
              durationMinutes: 60
            }
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateBookingStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.bookingService.updateBookingStatus(id, updateStatusDto, user);
  }

  @Patch(':id/user-update')
  @UseGuards(RolesGuard)
  @Roles(Role.user)
  @ApiOperation({ 
    summary: 'Update own booking details (User only - pending and confirmed bookings)',
    description: 'Users can update their own pending and confirmed bookings: date, services, and notes. Confirmed bookings can be rescheduled if the new time slot is available. Completed and cancelled bookings cannot be modified.'
  })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Booking updated/rescheduled successfully by user',
    type: BookingResponseDto,
    schema: {
      example: {
        id: 1,
        userId: 5,
        bookingDate: '2025-08-20T14:00:00.000Z',
        status: 'confirmed',
        notes: 'Rescheduled my appointment',
        handledByAdminId: 2,
        createdAt: '2025-08-19T10:30:00.000Z',
        updatedAt: '2025-08-19T16:00:00.000Z',
        user: {
          id: 5,
          name: 'John Doe',
          email: 'john@example.com'
        },
        handledByAdmin: {
          id: 2,
          name: 'Admin User',
          email: 'admin@example.com'
        },
        bookingServices: [
          {
            id: 1,
            bookingId: 1,
            serviceId: 2,
            quantity: 1,
            service: {
              id: 2,
              name: 'Hair Styling',
              description: 'Professional hair styling service',
              price: 75000,
              durationMinutes: 90
            }
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid booking date format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update own pending/confirmed bookings, or time slot not available for rescheduling' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  userUpdateBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UserUpdateBookingDto,
    @CurrentUser() user: any,
  ) {
    return this.bookingService.userUpdateBooking(id, updateBookingDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.user, Role.admin)
  @ApiOperation({ summary: 'Delete booking (User can delete their own, Admin can delete any)' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only delete own bookings or admin required' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ValidatedUser) {
    return this.bookingService.remove(id, user);
  }
}