import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheResetMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async use(req: Request, res: Response, next: () => void) {
    if (
      req.method === 'POST' ||
      req.method === 'PUT' ||
      req.method === 'DELETE'
    ) {
      await this.cacheManager.reset();
    }
    next();
  }
}
