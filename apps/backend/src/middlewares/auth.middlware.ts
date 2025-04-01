import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { logger } from '../utils/logger';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;
  
    if (!token) {
      logger.warn('No access token found in request', {
        cookies: req.cookies,
        headers: req.headers
      });
      return res.status(401).json({ 
        message: 'Unauthorized - No token found in request', 
        request_body: req,
        cookies: req.cookies,
        headers: req.headers
      });
    }
    
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET ?? "super_secret_jwt_key_for_development_only_2025"
      });
      req['user'] = payload;
      logger.debug('Token verified successfully', { userId: payload.sub });
      next();
    } catch (error) {
      logger.error('Token verification failed', error);
      return res.status(401).json({ 
        message: 'Token verification failed',
        error: error.message
      });
    }
  }
}