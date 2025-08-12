import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {

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
  services: { serviceId: number; quantity: number }[];
}
