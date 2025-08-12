import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  adminId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  durationMinutes: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
