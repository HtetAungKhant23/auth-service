import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(private redisService: RedisService) {}

  getHello(data: string): string {
    return data;
  }

  async setJSON(data: { name: string; phone: string; keyName: string }) {
    const res = await this.redisService.setData(data);
    console.log(res, 'set');
    return res;
  }

  async getJSON(data: string) {
    const res = await this.redisService.getData(data);
    console.log(res, 'get');
    return res;
  }
}
