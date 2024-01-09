import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(private redisService: RedisService) {}

  getHello(data: string): string {
    return data;
  }

  async setJSON(data: { name: string; phone: string }) {
    const res = await this.redisService.setData(data);
    console.log(res, 'set');
    return res;
  }

  async getJSON() {
    const res = await this.redisService.getData();
    console.log(res, 'get');
    return res;
  }
}
