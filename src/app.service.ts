import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { id: number; name: string } {
    return {
      id: 1,
      name: 'adaw',
    };
  }
}
