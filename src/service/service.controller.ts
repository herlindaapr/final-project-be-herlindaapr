import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto, ServiceResponseDto } from './dto/service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Create a new service (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  create(@Body() createServiceDto: CreateServiceDto, @CurrentUser() user: any) {
    return this.serviceService.create(user.id, createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({
    status: 200,
    description: 'List of all services retrieved successfully',
    type: [ServiceResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.serviceService.findAll();
  }

  @Get('my-services')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Get services created by current admin' })
  @ApiResponse({
    status: 200,
    description: 'List of admin services retrieved successfully',
    type: [ServiceResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  findMyServices(@CurrentUser() user: any) {
    return this.serviceService.findByAdminId(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiParam({ name: 'id', description: 'Service ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Service retrieved successfully',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Update service (Admin only - own services)' })
  @ApiParam({ name: 'id', description: 'Service ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required or not your service' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentUser() user: any,
  ) {
    return this.serviceService.update(id, user.id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Delete service (Admin only - own services)' })
  @ApiParam({ name: 'id', description: 'Service ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required or not your service' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.serviceService.remove(id, user.id);
  }
}