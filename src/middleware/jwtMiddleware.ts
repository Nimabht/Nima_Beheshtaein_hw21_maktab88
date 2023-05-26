import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const jwtCookie = req.cookies.jwt;

  if (jwtCookie) {
    try {
      const decodedToken = jwt.verify(jwtCookie, 'your-jwt-secret');
      res.locals.decodedToken = decodedToken; // Add the decoded token to the request object
    } catch (error) {
      // Handle invalid or expired token
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  next();
}
