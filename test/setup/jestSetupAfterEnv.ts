import { Test, TestingModuleBuilder, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createPool, DatabasePool, sql } from 'slonik';
import request from 'supertest';
import { VersioningType } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PostgresDatabaseConfig } from '../../src/config/namespaces/postgres-database.config';

const postgresDatabaseConfig = PostgresDatabaseConfig();

export class TestServer {
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly testingModule: TestingModule,
  ) {}

  public static async new(testingModuleBuilder: TestingModuleBuilder): Promise<TestServer> {
    const testingModule: TestingModule = await testingModuleBuilder.compile();
    const app: NestExpressApplication = testingModule.createNestApplication();

    app.enableVersioning({ type: VersioningType.URI });
    app.enableShutdownHooks();

    await app.init();

    return new TestServer(app, testingModule);
  }
}

let testServer: TestServer;
let pool: DatabasePool;

export async function generateTestingApplication(): Promise<{
  testServer: TestServer;
}> {
  const testServer = await TestServer.new(
    Test.createTestingModule({
      imports: [AppModule],
    }),
  );

  return {
    testServer,
  };
}

export function getTestServer(): TestServer {
  return testServer;
}

export function getConnectionPool(): DatabasePool {
  return pool;
}

export function getHttpServer(): request.SuperTest<request.Test> {
  const testServer = getTestServer();
  const httpServer = request(testServer.serverApplication.getHttpServer());

  return httpServer;
}

// setup
beforeAll(async (): Promise<void> => {
  ({ testServer } = await generateTestingApplication());
  pool = await createPool(postgresDatabaseConfig.connectionUri);
  await pool.query(sql`TRUNCATE "star_wars"."characters"`);
  await pool.query(sql`TRUNCATE "star_wars"."episodes"`);
});

// cleanup
afterAll(async (): Promise<void> => {
  await pool.end();
  testServer.serverApplication.close();
});
