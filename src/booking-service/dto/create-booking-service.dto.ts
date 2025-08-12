import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingServiceDto {
  @ApiProperty()
  bookingId: number;

  @ApiProperty()
  serviceId: number;

  @ApiProperty({ default: 1 })
  quantity?: number;
}
