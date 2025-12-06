import { DataSource, DataSourceOptions } from 'typeorm';
import { getEnv } from '../src/configs/env.config';

// 注意：env.config.ts 已经加载了环境变量，这里不需要再次加载

async function cleanDatabase() {
  console.log('Cleaning database...');
  
  const config: DataSourceOptions = {
    type: 'mysql',
    host: getEnv('MYSQL_HOST', 'MySQL 数据库主机地址'),
    port: Number(getEnv('MYSQL_PORT', 'MySQL 数据库端口号')),
    username: getEnv('MYSQL_USER', 'MySQL 数据库用户名'),
    password: getEnv('MYSQL_PASSWORD', 'MySQL 数据库密码', true), // 允许空密码
    database: getEnv('MYSQL_DATABASE', 'MySQL 数据库名称'),
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

