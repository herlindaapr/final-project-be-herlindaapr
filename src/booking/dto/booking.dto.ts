import {
    IsDateString,
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    IsPositive,
    IsEnum,
    IsEmail,
  } from 'class-validator';
  import { Type, Transform } from 'class-transformer';
  import { PartialType } from '@nestjs/mapped-types';
  import { ApiProperty } from '@nestjs/swagger';
  import { UserResponseDto } from '../../auth/dto/auth.dto';
  import { ServiceResponseDto } from '../../service/dto/service.dto';
import { BookingServiceResponseDto } from 'src/booking-service/dto/booking-service.dto';

  export class BookingQueryDto {
    @ApiProperty({
      description: 'Search bookings by service name',
      example: 'haircut',
      required: false,
    })
    @IsString()
    @IsOptional()
    serviceName?: string;

    @ApiProperty({
      description: 'Filter by booking status',
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      required: false,
    })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty({
      description: 'Filter by date range (start date)',
      example: '2025-08-01',
      required: false,
    })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({
      description: 'Filter by date range (end date)',
      example: '2025-08-31',
      required: false,
    })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiProperty({
      description: 'Page number for pagination',
      example: 1,
      required: false,
      default: 1,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page?: number = 1;

    @ApiProperty({
      description: 'Number of items per page',
      example: 10,
      required: false,
      default: 10,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    limit?: number = 10;
  }
  
  export class CreateBookingDto {

    @ApiProperty({
      description: 'User email who made the booking',
      example: 'test@test.com',
    })
    @IsEmail()
    @IsOptional()
    userEmail?: string;

    @ApiProperty({
      description: 'Booking date and time (ISO-8601 format)',
      example: '2025-08-15T10:00:00.000Z',
    })
    @IsString()
    bookingDate: string;
  
    @ApiProperty({
      description: 'Additional notes for the booking',
      example: 'Please use organic products',
      required: false,
    })
    @IsString()
    @IsOptional()
    notes?: string;
  
    @ApiProperty({
      description: 'Services to book',
    })
    @IsArray()
    services: string[];
  }
  
  export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @ApiProperty({
      description: 'Booking status',
      example: 'confirmed',
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      required: false,
    })
    @IsString()
    @IsOptional()
    status?: string;
  }

  export class UpdateBookingStatusDto {
    @ApiProperty({
      description: 'New booking status',
      example: 'confirmed',
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    })
    @IsString()
    @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'], {
      message: 'Status must be one of: pending, confirmed, completed, cancelled',
    })
    status: string;

    @ApiProperty({
      description: 'Optional notes for the status change. If not provided, existing notes will remain unchanged.',
      example: 'Booking confirmed after payment verification',
      required: false,
    })
    @IsString()
    @IsOptional()
    notes?: string;
  }

  export class UserUpdateBookingDto {
    @ApiProperty({
      description: 'New booking date and time (ISO-8601 format)',
      example: '2025-08-20T14:00:00.000Z',
      required: false,
    })
    @IsString()
    @IsOptional()
    bookingDate?: string;

    @ApiProperty({
      description: 'Updated services to book',
      example: ['1', '2'],
      required: false,
    })
    @IsArray()
    @IsOptional()
    services?: string[];

    @ApiProperty({
      description: 'Updated notes for the booking',
      example: 'Changed my preferences',
      required: false,
    })
    @IsString()
    @IsOptional()
    notes?: string;
  }
  
  export class BookingResponseDto {
    @ApiProperty({ description: 'Booking ID', example: 1 })
    id: number;
  
    @ApiProperty({ description: 'User ID who made the booking', example: 1 })
    userId: number;
  
    @ApiProperty({
      description: 'Booking date and time',
      example: '2025-08-15T10:00:00.000Z',
    })
    bookingDate: Date;
  
    @ApiProperty({
      description: 'Booking status',
      example: 'pending',
    })
    status: string;
  
    @ApiProperty({
      description: 'Additional notes',
      example: 'Please use organic products',
      required: false,
    })
    notes?: string;
  
    @ApiProperty({
      description: 'Admin ID who handled the booking',
      example: 2,
      required: false,
    })
    handledByAdminId?: number;
  
    @ApiProperty({ description: 'Booking creation date' })
    createdAt: Date;
  
    @ApiProperty({ description: 'Booking last update date' })
    updatedAt: Date;
  
    @ApiProperty({
      description: 'User who made the booking',
      type: UserResponseDto,
    })
    user: UserResponseDto;
  
    @ApiProperty({
      description: 'Admin who handled the booking',
      type: UserResponseDto,
      required: false,
    })
    handledByAdmin?: UserResponseDto;
  
    @ApiProperty({
      description: 'Services in this booking',
      type: [BookingServiceResponseDto],
    })
    bookingServices: BookingServiceResponseDto[];
  }

  export class PaginatedBookingResponseDto {
    @ApiProperty({
      description: 'Array of bookings',
      type: [BookingResponseDto],
    })
    bookings: BookingResponseDto[];

    @ApiProperty({
      description: 'Total number of bookings',
      example: 25,
    })
    total: number;

    @ApiProperty({
      description: 'Current page number',
      example: 1,
    })
    page: number;

    @ApiProperty({
      description: 'Number of items per page',
      example: 10,
    })
    limit: number;

    @ApiProperty({
      description: 'Total number of pages',
      example: 3,
    })
    totalPages: number;
  }