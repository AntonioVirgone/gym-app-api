import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenziali non valide');
    }
    return {
      message: 'Login effettuato',
      user: { id: user.id, email: user.email, name: user.name },
      token: 'fake-jwt-token-per-ora', // In futuro qui userai @nestjs/jwt
    };
  }
}
