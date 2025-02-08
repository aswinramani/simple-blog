import { ConfigService } from '@nestjs/config';
import { constants } from '../shared/constants';
import { DataSource, QueryRunner } from 'typeorm';

const initDatabase = async function(dataSource: DataSource, dbName: string): Promise<void> {
  const queryRunner: QueryRunner = dataSource.createQueryRunner();
  const dbExists = await queryRunner.query(`SELECT datname FROM pg_database WHERE datname = '${dbName}';`);
  if (!dbExists.length) {
    await queryRunner.query(`CREATE DATABASE ${dbName};`);
  }
  await queryRunner.release();
}

export const databaseProviders = [
  {
    provide: constants.DATA_SOURCE,
    useFactory: async (configService: ConfigService) => {
      const dbName = configService.get(constants.dbName);
      const dbType = configService.get(constants.dbType);
      const dbHost = configService.get(constants.dbHost);
      const dbPort = configService.get(constants.dbPort);
      const dbUserName = configService.get(constants.dbUserName);
      const dbPassword = configService.get(constants.dbPassword);
      const dbDefault = configService.get(constants.dbDefault);
      const dbSync = configService.get(constants.dbSync);
      const dbMigrationsRun = configService.get(constants.dbMigrationsRun);
      const dataSource = new DataSource({
        type: dbType,
        host: dbHost,
        port: dbPort,
        username: dbUserName,
        password: dbPassword,
        database: dbDefault,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../../migrations/*.{ts,js}'],
        synchronize: dbSync,
        extra: {
          max: configService.get(constants.dbMaxPool),
          min: configService.get(constants.dbMinPool),
          idleTimeoutMillis: configService.get(constants.dbIdleTimeout),
        },
      });
      await dataSource.initialize();
      await initDatabase(dataSource, dbName);
      Object.assign(dataSource.options, { database: dbName, synchronize: dbSync, migrationsRun: dbMigrationsRun });
      await dataSource.destroy();
      await dataSource.initialize();
      return dataSource;
    },
    inject: [ConfigService]
  },
];
