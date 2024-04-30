import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 3030;
  const app = await NestFactory.create(AppModule);
  await app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
}
bootstrap();
