import { Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  async setData(data: { name: string; phone: string }) {
    const res = await this.redis.json.set('firstData', '$', data);
    return res;
  }

  async getData() {
    const res = await this.redis.json.get('firstData');
    return res;
  }
}
