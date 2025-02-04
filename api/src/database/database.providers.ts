import { DataSource, QueryRunner } from 'typeorm';

const initDatabase = async function  (dataSource: DataSource) {
  // Use a QueryRunner to check and create the database if necessary
  const queryRunner: QueryRunner = dataSource.createQueryRunner();
  const dbExists = await queryRunner.query(`SELECT datname FROM pg_database WHERE datname = 'blog';`);
  if (dbExists.length === 0) {
    // Create the 'blog' database if it doesn't exist
    await queryRunner.query(`CREATE DATABASE blog;`);
  }
  await queryRunner.release();
}

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'password',
        database: 'postgres', // Connect to the default database first
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../../migrations/*.{ts,js}'],
        synchronize: false, // No need to synchronize with the default database
        extra: {
          max: 10, // Maximum number of connections in the pool
          min: 2,  // Minimum number of connections in the pool
          idleTimeoutMillis: 30000, // Time before a connection is considered idle
        },
      });

      await dataSource.initialize();

      await initDatabase(dataSource);

      // Update the connection options to use the 'blog' database
      Object.assign(dataSource.options, { database: 'blog', synchronize: true, migrationsRun: true });
      await dataSource.destroy(); // Close the initial connection
      await dataSource.initialize(); // Initialize the connection to the 'blog' database

      return dataSource;
    },
  },
];
