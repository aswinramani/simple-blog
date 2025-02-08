import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configOptions } from './config.options';

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
  ],
  exports: [ConfigModule]
})
export class CustomConfigModule {}
