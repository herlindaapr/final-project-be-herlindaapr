import { ApiProperty } from '@nestjs/swagger';

export class BookingResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  bookingDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  handledByAdminId?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
