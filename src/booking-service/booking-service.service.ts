import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingServiceDto, UpdateBookingServiceDto } from './dto/booking-service.dto';

@Injectable()
export class BookingServiceService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingServiceDto: CreateBookingServiceDto) {
    return this.prisma.bookingService.create({
      data: createBookingServiceDto,
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        service: true,
      },
    });
  }

  async findAll() {
    return this.prisma.bookingService.findMany({
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        service: true,
      },
    });
  }

  async findByBookingId(bookingId: number) {
    return this.prisma.bookingService.findMany({
      where: { bookingId },
      include: {
        service: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.bookingService.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        service: true,
      },
    });
  }

  async update(id: number, updateBookingServiceDto: UpdateBookingServiceDto) {
    return this.prisma.bookingService.update({
      where: { id },
      data: updateBookingServiceDto,
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        service: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.bookingService.delete({
      where: { id },
    });
  }
}