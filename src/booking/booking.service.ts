import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto, UpdateBookingStatusDto, UserUpdateBookingDto, BookingQueryDto } from './dto/booking.dto';
import { Role } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createBookingDto: CreateBookingDto) {
    const { services, ...bookingData } = createBookingDto;

    // Validate and convert booking date
    const bookingDate = new Date(bookingData.bookingDate);
    if (isNaN(bookingDate.getTime())) {
      throw new Error('Invalid booking date format. Please use ISO-8601 format (e.g., 2025-08-15T10:00:00.000Z)');
    }

    return this.prisma.booking.create({
      data: {
        ...bookingData,
        bookingDate,
        userId,
        status: 'pending',
        bookingServices: {
          create: services.map(service => ({
            serviceId: Number(service),
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

  async findByUserId(userId: number, query?: BookingQueryDto) {
    const {
      serviceName,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query || {};

    // Build where conditions
    const whereConditions: any = { userId };

    if (status) {
      whereConditions.status = status;
    }

    if (startDate || endDate) {
      whereConditions.bookingDate = {};
      if (startDate) {
        whereConditions.bookingDate.gte = new Date(startDate);
      }
      if (endDate) {
        whereConditions.bookingDate.lte = new Date(endDate);
      }
    }

    // If service name is provided, we need to filter by booking services
    if (serviceName) {
      whereConditions.bookingServices = {
        some: {
          service: {
            name: {
              contains: serviceName,
              mode: 'insensitive', // Case-insensitive search
            },
          },
        },
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await this.prisma.booking.count({
      where: whereConditions,
    });

    // Get bookings with pagination
    const bookings = await this.prisma.booking.findMany({
      where: whereConditions,
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
      skip,
      take: limit,
    });

    return {
      bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserBookingStats(userId: number) {
    const totalBookings = await this.prisma.booking.count({
      where: { userId },
    });

    const pendingBookings = await this.prisma.booking.count({
      where: { userId, status: 'pending' },
    });

    const confirmedBookings = await this.prisma.booking.count({
      where: { userId, status: 'confirmed' },
    });

    const completedBookings = await this.prisma.booking.count({
      where: { userId, status: 'completed' },
    });

    const cancelledBookings = await this.prisma.booking.count({
      where: { userId, status: 'cancelled' },
    });

    // Get upcoming bookings (confirmed and pending, booking date in the future)
    const upcomingBookings = await this.prisma.booking.count({
      where: {
        userId,
        status: { in: ['pending', 'confirmed'] },
        bookingDate: { gt: new Date() },
      },
    });

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      upcomingBookings,
    };
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

  async updateBookingStatus(id: number, updateStatusDto: UpdateBookingStatusDto, currentUser: any) {
    // Check if booking exists
    const booking = await this.findById(id);

    // Only admin can update booking status
    if (currentUser.role !== Role.admin) {
      throw new ForbiddenException('Only admin can update booking status');
    }

    // Update the booking status and notes if provided
    const updateData: any = {
      status: updateStatusDto.status,
      handledByAdminId: currentUser.id,
    };

    // If notes are provided, update them, otherwise keep existing notes
    if (updateStatusDto.notes !== undefined) {
      updateData.notes = updateStatusDto.notes;
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateData,
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

  async userUpdateBooking(id: number, updateBookingDto: UserUpdateBookingDto, currentUser: any) {
    // Check if booking exists
    const booking = await this.findById(id);

    // Check if the current user owns this booking
    if (booking.userId !== currentUser.id) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    // Users can only update pending bookings
    if (booking.status !== 'pending') {
      throw new ForbiddenException('You can only update pending bookings');
    }

    // Prepare update data
    const updateData: any = {};

    // Update booking date if provided
    if (updateBookingDto.bookingDate) {
      const bookingDate = new Date(updateBookingDto.bookingDate);
      if (isNaN(bookingDate.getTime())) {
        throw new Error('Invalid booking date format. Please use ISO-8601 format (e.g., 2025-08-15T10:00:00.000Z)');
      }
      updateData.bookingDate = bookingDate;
    }

    // Update notes if provided
    if (updateBookingDto.notes !== undefined) {
      updateData.notes = updateBookingDto.notes;
    }

    // Use transaction to handle booking and services update
    return this.prisma.$transaction(async (prisma) => {
      // Update booking details
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: updateData,
      });

      // Update services if provided
      if (updateBookingDto.services && updateBookingDto.services.length > 0) {
        // Delete existing booking services
        await prisma.bookingService.deleteMany({
          where: { bookingId: id },
        });

        // Create new booking services
        await prisma.bookingService.createMany({
          data: updateBookingDto.services.map(serviceId => ({
            bookingId: id,
            serviceId: Number(serviceId),
          })),
        });
      }

      // Return updated booking with all relations
      return prisma.booking.findUnique({
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
    });
  }

  async remove(id: number, currentUser: any) {
    const booking = await this.findById(id);

    // Check if user can delete this booking
    // Users can only delete their own bookings, admins can delete any booking
    if (currentUser.role !== Role.admin && booking.userId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own bookings');
    }

    // Use a transaction to delete booking services first, then the booking
    return this.prisma.$transaction(async (prisma) => {
      // Delete related booking services first
      await prisma.bookingService.deleteMany({
        where: { bookingId: id },
      });

      // Then delete the booking
      return prisma.booking.delete({
        where: { id },
      });
    });
  }
}