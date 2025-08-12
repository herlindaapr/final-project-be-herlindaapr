import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

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

  async findAll() {
    return this.prisma.service.findMany({
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
    return this.prisma.service.findUnique({
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
  }

  async update(id: number, adminId: number, updateServiceDto: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { 
        id,
        adminId, // Ensure only the admin who created it can update
      },
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
    return this.prisma.service.delete({
      where: { 
        id,
        adminId, // Ensure only the admin who created it can delete
      },
    });
  }
}