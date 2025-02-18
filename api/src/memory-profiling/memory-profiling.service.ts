// memory-profiling.service.ts
import { Injectable } from '@nestjs/common';
import * as heapdump from 'heapdump';

@Injectable()
export class MemoryProfilingService {
  generateHeapDump(): void {
    heapdump.writeSnapshot((err, filename) => {
      if (err) {
        console.error('Heapdump error:', err);
      } else {
        console.log('Heap dump written to', filename);
      }
    });
  }
}
