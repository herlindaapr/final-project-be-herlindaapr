import { Module } from '@nestjs/common';
import { BookingServiceController } from './booking-service.controller';
import { BookingServiceService } from './booking-service.service';

@Module({
  controllers: [BookingServiceController],
  providers: [BookingServiceService],
  exports: [BookingServiceService],
})
export class BookingServiceModule {}