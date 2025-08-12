import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsEnum } from 'class-validator';
import { UserRole } from './update-role.dto';

export class BulkUpdateRoleItemDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class BulkUpdateRolesDto {
  @ApiProperty({
    description: 'Array of user role updates',
    type: [BulkUpdateRoleItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateRoleItemDto)
  updates: BulkUpdateRoleItemDto[];
} 