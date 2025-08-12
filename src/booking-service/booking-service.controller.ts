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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BookingServiceService } from './booking-service.service';
import { CreateBookingServiceDto, UpdateBookingServiceDto, BookingServiceResponseDto } from './dto/booking-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('booking-services')
@Controller('booking-services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class BookingServiceController {
  constructor(private bookingServiceService: BookingServiceService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Create a booking-service relationship (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Booking-service created successfully',
    type: BookingServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  create(@Body() createBookingServiceDto: CreateBookingServiceDto) {
    return this.bookingServiceService.create(createBookingServiceDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get all booking-service relationships (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All booking-services retrieved successfully',
    type: [BookingServiceResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  findAll() {
    return this.bookingServiceService.findAll();
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get services for a specific booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Booking services retrieved successfully',
    type: [BookingServiceResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByBookingId(@Param('bookingId', ParseIntPipe) bookingId: number) {
    return this.bookingServiceService.findByBookingId(bookingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking-service by ID' })
  @ApiParam({ name: 'id', description: 'Booking-Service ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Booking-service retrieved successfully',
    type: BookingServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking-service not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingServiceService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Update booking-service (Admin only)' })
  @ApiParam({ name: 'id', description: 'Booking-Service ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Booking-service updated successfully',
    type: BookingServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Booking-service not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingServiceDto: UpdateBookingServiceDto,
  ) {
    return this.bookingServiceService.update(id, updateBookingServiceDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Delete booking-service (Admin only)' })
  @ApiParam({ name: 'id', description: 'Booking-Service ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Booking-service deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Booking-service not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingServiceService.remove(id);
  }
}