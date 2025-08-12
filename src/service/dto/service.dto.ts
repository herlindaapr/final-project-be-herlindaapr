import { IsString, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../auth/dto/auth.dto';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Service name',
    example: 'Professional Hair Cut',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Service description',
    example: 'Professional hair cutting service with modern styling techniques',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Service price in smallest currency unit (e.g., cents)',
    example: 50000,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Service duration in minutes',
    example: 60,
  })
  @IsNumber()
  @IsPositive()
  durationMinutes: number;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class ServiceResponseDto {
  @ApiProperty({ description: 'Service ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Admin ID who created this service', example: 1 })
  adminId: number;

  @ApiProperty({
    description: 'Service name',
    example: 'Professional Hair Cut',
  })
  name: string;

  @ApiProperty({
    description: 'Service description',
    example: 'Professional hair cutting service with modern styling techniques',
  })
  description: string;

  @ApiProperty({
    description: 'Service price in smallest currency unit',
    example: 50000,
  })
  price: number;

  @ApiProperty({
    description: 'Service duration in minutes',
    example: 60,
  })
  durationMinutes: number;

  @ApiProperty({ description: 'Service creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Service last update date' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Admin who created this service',
    type: UserResponseDto,
  })
  admin: UserResponseDto;
}