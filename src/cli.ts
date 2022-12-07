import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { environment } from './common/environments';
import { TraderModule } from './trader/trader.module';
import { TraderService } from './trader/trader.service';

async function bootstrap(): Promise<any> {
  const module = await NestFactory.createApplicationContext(TraderModule);
  const service: TraderService = module.get<TraderService>(TraderService);

  const res = await service.applyTrade(null);
  console.log(res)
}
bootstrap();
