import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    try {
      const user = await this.authService.registerUser(
        body.name,
        body.email,
        body.password,
      );
      return {
        message: 'Registrazione effettuata',
        user: { id: user.id, email: user.email, name: user.name },
        token: 'fake-jwt-token-per-ora',
      };
    } catch (error) {
      throw new BadRequestException(
        "Errore durante la registrazione. L'email potrebbe essere già in uso.",
      );
    }
  }

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenziali non valide');
    }
    return {
      message: 'Login effettuato',
      user: { id: user.id, email: user.email, name: user.name },
      token: 'fake-jwt-token-per-ora',
    };
  }

  @Post('client-login')
  async clientLogin(@Body() body: any) {
    const client = await this.authService.validateClient(
      body.email,
      body.password,
    );
    if (!client) {
      throw new UnauthorizedException('Credenziali errate');
    }
    return {
      message: 'Login effettuato',
      user: { id: client.id, email: client.email, name: client.name },
    };
  }
}
