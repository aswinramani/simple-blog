// memory-profiling.controller.ts
import { Controller, Get } from '@nestjs/common';
import { MemoryProfilingService } from './memory-profiling.service';
import { Public } from '../auth/public.decorator';

@Controller('memory-profiling')
export class MemoryProfilingController {
  constructor(private readonly memoryProfilingService: MemoryProfilingService) {}

  @Public()
  @Get('heap-dump')
  generateHeapDump(): string {
    this.memoryProfilingService.generateHeapDump();
    return 'Heap dump generated';
  }
}
