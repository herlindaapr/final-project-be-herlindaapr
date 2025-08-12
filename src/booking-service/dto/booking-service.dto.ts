import { IsNumber, IsPositive, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceResponseDto } from '../../service/dto/service.dto';
import { BookingResponseDto } from '../../booking/dto/booking.dto';

export class CreateBookingServiceDto {
  @ApiProperty({
    description: 'Booking ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  bookingId: number;

  @ApiProperty({
    description: 'Service ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  serviceId: number;

  @ApiProperty({
    description: 'Quantity of services',
    example: 1,
    required: false,
    default: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;
}

export class UpdateBookingServiceDto extends PartialType(CreateBookingServiceDto) {}

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
    description: 'Booking details',
    type: () => BookingResponseDto,
  })
  booking: BookingResponseDto;

  @ApiProperty({
    description: 'Service details',
    type: ServiceResponseDto,
  })
  service: ServiceResponseDto;
}