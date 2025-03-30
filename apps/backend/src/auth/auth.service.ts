import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from 'db';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        name: true,
        emailId: true
      }
    });
  }

  async validateUser(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { emailId: email } });
    
    if (!user) {
      // Create new user if not exists
      return this.prisma.user.create({
        data: {
          emailId: email,
          name: email.split('@')[0], // Default name
        },
      });
    }
    
    return user;
  }

  async login(user: User) {
    const payload = { email: user.emailId, sub: user.userId, name: user.name};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}