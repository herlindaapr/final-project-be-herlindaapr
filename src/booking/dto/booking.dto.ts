import {
    IsDateString,
    IsString,
    IsOptional,
    IsArray,
    ValidateNested,
    IsNumber,
    IsPositive,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { PartialType } from '@nestjs/mapped-types';
  import { ApiProperty } from '@nestjs/swagger';
  import { UserResponseDto } from '../../auth/dto/auth.dto';
  import { ServiceResponseDto } from '../../service/dto/service.dto';
  
  class BookingServiceDto {
    @ApiProperty({
      description: 'Service ID to book',
      example: 1,
    })
    @IsNumber()
    @IsPositive()
    serviceId: number;
  
    @ApiProperty({
      description: 'Quantity of services to book',
      example: 1,
      required: false,
      default: 1,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    quantity?: number;
  }
  
  export class CreateBookingDto {
    @ApiProperty({
      description: 'Booking date and time',
      example: '2025-08-15T10:00:00.000Z',
    })
    @IsDateString()
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
      type: [BookingServiceDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BookingServiceDto)
    services: BookingServiceDto[];
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
  
  export class BookingServiceResponseDto {
    @ApiProperty({ description: 'Booking Service ID', example: 1 })
    id: number;
  
    @ApiProperty({ description: 'Booking ID', example: 1 })
    bookingId: number;
  
    @ApiProperty({ description: 'Service ID', example: 1 })
    serviceId: number;
  
    @ApiProperty({ description: 'Quantity', example: 1 })
    quantity: number;
  
    @ApiProperty({
      description: 'Service details',
      type: ServiceResponseDto,
    })
    service: ServiceResponseDto;
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