import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
const envFile = '.env.development.local';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

async function cleanDatabase() {
  console.log('Cleaning database...');
  
  const config: DataSourceOptions = {
    type: 'mysql',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'skeleton',
  };

  try {
    const dataSource = new DataSource(config);
    await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();
    
    // 禁用外键检查
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');

    // 获取所有表
    const tables = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${config.database}'
    `);

    if (tables.length === 0) {
      console.log('No tables found to delete.');
    } else {
      for (const table of tables) {
        const tableName = table.TABLE_NAME || table.table_name; // 兼容不同大小写返回
        console.log(`Dropping table: ${tableName}`);
        await queryRunner.query(`DROP TABLE IF EXISTS \`${tableName}\``);
      }
      console.log('All tables dropped successfully.');
    }

    // 恢复外键检查
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
    
    await dataSource.destroy();
    console.log('Database cleanup completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
}

cleanDatabase();

