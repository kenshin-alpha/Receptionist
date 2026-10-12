import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): { status: string; time: string } {
    return { 
      status: 'ok',
      time: new Date().toISOString(),
    };
  }
}
