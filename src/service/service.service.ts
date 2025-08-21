import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto, GetServicesQueryDto } from './dto/service.dto';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async create(adminId: number, createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        adminId,
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(query?: GetServicesQueryDto) {
    const where: any = {};
    if (query?.name) {
      where.name = { contains: query.name, mode: 'insensitive' };
    }
    if (query?.minPrice != null || query?.maxPrice != null) {
      where.price = {} as any;
      if (query.minPrice != null) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice != null) {
        where.price.lte = query.maxPrice;
      }
    }

    return this.prisma.service.findMany({
      where,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByAdminId(adminId: number) {
    return this.prisma.service.findMany({
      where: { adminId },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(id: number, adminId: number, updateServiceDto: UpdateServiceDto) {
    // First, find the service to check if it exists
    const service = await this.findById(id);
    
    // Admin is super user - can update any service
    // No ownership check needed as all admins can edit all services

    // Update the service
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number, adminId: number) {
    // First, find the service to check if it exists
    const service = await this.findById(id);
    
    // Admin is super user - can delete any service
    // No ownership check needed as all admins can delete all services

    // Delete the service
    return this.prisma.service.delete({
      where: { id },
    });
  }
}