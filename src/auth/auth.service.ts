import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(
    username: string,
    pass: string,
  ): Promise<{
    id: string;
    username: string;
  }> {
    // Note: this is mocked logic, should be replaced with a real one
    if (username && pass) {
      return {
        id: username,
        username,
      };
    }

    return null;
  }
}
