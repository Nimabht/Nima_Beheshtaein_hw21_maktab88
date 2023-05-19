import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: User): Promise<any> {
    const payload = { id: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  verifyToken(token: string): any {
    try {
      const decodedToken = jwt.verify(token, jwtConstants.secret);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
