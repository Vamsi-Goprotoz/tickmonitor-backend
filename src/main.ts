import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const appServices = app.get(AppService);
  await app.listen(3000);
  // await appServices.seedUsers();
  // await appServices.seedDomains();
  // await appServices.seedUserDomain();
  // await appServices.seedVertices();
  // await appServices.seedTasks();
}
bootstrap();
