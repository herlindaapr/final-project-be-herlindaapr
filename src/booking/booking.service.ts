import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { Role } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createBookingDto: CreateBookingDto) {
    const { services, ...bookingData } = createBookingDto;

    return this.prisma.booking.create({
      data: {
        ...bookingData,
        userId,
        status: 'pending',
        bookingServices: {
          create: services.map(service => ({
            serviceId: service.serviceId,
            quantity: service.quantity || 1,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        handledByAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookingServices: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        handledByAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookingServices: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDate(date: string) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return this.prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        handledByAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookingServices: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { bookingDate: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        handledByAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookingServices: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        handledByAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookingServices: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto, currentUser: any) {
    const booking = await this.findById(id);

    // Only admin can update bookings
    if (currentUser.role !== Role.admin) {
      throw new ForbiddenException('Only admin can update bookings');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        ...updateBookingDto,
        handledByAdminId: currentUser.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        handledByAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookingServices: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async remove(id: number, currentUser: any) {
    const booking = await this.findById(id);

    // Only admin can delete bookings
    if (currentUser.role !== Role.admin) {
      throw new ForbiddenException('Only admin can delete bookings');
    }

    return this.prisma.booking.delete({
      where: { id },
    });
  }
}