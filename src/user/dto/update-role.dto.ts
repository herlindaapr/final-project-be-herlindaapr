
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UpdateRoleDto {
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
} 
