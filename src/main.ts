import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import type { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { existsSync, readFileSync } from 'fs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const httpsOptions = resolveHttpsOptions(logger);

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    ...(httpsOptions ? { httpsOptions } : {}),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  const protocol = httpsOptions ? 'https' : 'http';
  logger.log(`Application is running on ${protocol}://localhost:${port}`);
}

bootstrap();

function resolveHttpsOptions(logger: Logger): HttpsOptions | undefined {
  const httpsEnabled = (process.env.HTTPS_ENABLED ?? 'true').toLowerCase() !== 'false';

  if (!httpsEnabled) {
    logger.log('HTTPS explicitly disabled via HTTPS_ENABLED=false');
    return undefined;
  }

  const keyPath = process.env.HTTPS_KEY_PATH;
  const certPath = process.env.HTTPS_CERT_PATH;
  const caPath = process.env.HTTPS_CA_PATH;

  if (!keyPath || !certPath) {
    logger.warn(
      'HTTPS is enabled by default but HTTPS_KEY_PATH or HTTPS_CERT_PATH is not set. Falling back to HTTP.',
    );
    return undefined;
  }

  if (!existsSync(keyPath) || !existsSync(certPath)) {
    logger.warn('HTTPS certificate or key file not found. Falling back to HTTP.');
    return undefined;
  }

  try {
    const options: HttpsOptions = {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    };

    if (caPath) {
      if (existsSync(caPath)) {
        options.ca = readFileSync(caPath);
      } else {
        logger.warn('HTTPS_CA_PATH provided but file not found. Continuing without CA.');
      }
    }

    logger.log('HTTPS enabled using provided certificate.');
    return options;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to load HTTPS certificates: ${message}`);
    return undefined;
  }
}
