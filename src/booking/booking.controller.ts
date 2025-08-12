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
import { CreateBookingDto, UpdateBookingDto, BookingResponseDto } from './dto/booking.dto';
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
  @ApiOperation({ summary: 'Get current user booking history' })
  @ApiResponse({
    status: 200,
    description: 'User bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - User role required' })
  getMyBookings(@CurrentUser() user: any) {
    return this.bookingService.findByUserId(user.id);
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

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Delete booking (Admin only)' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ValidatedUser) {
    return this.bookingService.remove(id, user);
  }
}