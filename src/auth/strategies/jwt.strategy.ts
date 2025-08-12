import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ValidatedUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUser> {
    try {
      // Extract user ID from JWT payload
      const userId = payload.sub;
      
      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Find user in database
      const user = await this.userService.findById(userId);
      
      // Check if user exists
      if (!user) {
        throw new UnauthorizedException('User not found - token may be invalid or user may have been deleted');
      }

      // Return validated user object (this will be available as req.user in controllers)
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      // If any error occurs during validation, throw UnauthorizedException
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token validation failed');
    }
  }
}