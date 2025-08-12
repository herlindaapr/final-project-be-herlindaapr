import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { BookingModule } from './booking/booking.module';
import { BookingServiceModule } from './booking-service/booking-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ServiceModule,
    BookingModule,
    BookingServiceModule,
  ],
})
export class AppModule {}