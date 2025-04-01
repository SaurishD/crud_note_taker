import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { logger } from '../utils/logger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    logger.info('Initiating Google OAuth login flow');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    logger.info('Received Google OAuth callback', { user: req.user });
    const token = await this.authService.login(req.user);
    
    res.cookie('access_token', token.access_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    
    logger.info('Login successful, redirecting to notes page');
    res.redirect(process.env.FRONTEND_URL+'notes' || 'http://localhost:3002/notes');
  }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getCurrentUser(@Req() req) {
        logger.info('Getting current user info', { userId: req.user.userId });
        const user = await this.authService.getUser(req.user.userId);
        return user;
    }

  @Get('logout')
  logout(@Res() res: Response) {
    logger.info('User logging out');
    res.clearCookie('access_token');
    res.send({ message: 'Logged out successfully' });
  }
}