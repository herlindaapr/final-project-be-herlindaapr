import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsPositive } from 'class-validator';

export class UserIdDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumberString()
  @IsPositive()
  id: string;
} 