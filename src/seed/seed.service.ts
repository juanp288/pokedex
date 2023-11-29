import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  seed() {
    return `Executed seeder`;
  }
}
