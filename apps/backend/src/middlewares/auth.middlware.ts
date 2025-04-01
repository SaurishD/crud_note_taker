import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;
    console.log("Request: ",req.originalUrl)
  
    if (!token) {
      return res.status(401).json({ 
        message: 'Unauthorized - No token found', 
        cookies: req.cookies,
        headers: req.headers
      });
    }
    
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET ?? "super_secret_jwt_key_for_development_only_2025"
      });
      req['user'] = payload; // Attach user to request
      next();
    } catch (error) {
      console.log(error.message)
      return res.status(401).json({ message: 'Unauthorized' + error.message });
    }
  }
}