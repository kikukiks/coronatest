import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const options = new DocumentBuilder()
        .setTitle('Coronatest')
        .setDescription('Coronatest API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    app.disable('x-powered-by');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors({
        origin: true,
        credentials: true
    });

    app.setGlobalPrefix('api');

    await app.listen(3000);
}
bootstrap();
