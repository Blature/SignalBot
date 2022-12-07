import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService, private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body()
    dto: LoginDto,
  ): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(dto.username, dto.password);

    if (!user) {
      throw new UnauthorizedException(`invalid user`);
    }

    const payload: any = {
      userId: user.id,
    };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }
}
