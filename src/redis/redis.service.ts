import { Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  async setData(data: { name: string; phone: string; keyName: string }) {
    const res = await this.redis.json.set(data.keyName, '$', data);
    return res;
  }

  async getData(keyName: string) {
    const res = await this.redis.json.get(keyName);
    return res;
  }
}
