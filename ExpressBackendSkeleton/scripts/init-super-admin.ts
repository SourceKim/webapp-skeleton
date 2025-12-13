import { AppDataSource } from '../src/configs/database.config';
import { User, UserStatus, UserGender } from '../src/modules/user/user.model';
import { Role } from '../src/modules/role/role.model';
import { Permission } from '../src/modules/permission/permission.model';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcryptjs';
import * as mysql from 'mysql2/promise';
import { DataSource } from 'typeorm';
import { ROLE_NAMES } from '../src/constants/role.constants';
import { getEnv, getEnvOptional, ENV } from '../src/configs/env.config';

// 注意：env.config.ts 已经加载了环境变量，这里不需要再次加载

const resources = [
    'user',
    'role',
    'permission',
];

const actions = [
    'create',
    'read',
    'update',
    'delete',
];

// 检查数据库是否存在，不存在则创建
async function checkAndCreateDatabase() {
    const host = getEnv('MYSQL_HOST', 'MySQL 数据库主机地址');
    const port = parseInt(getEnv('MYSQL_PORT', 'MySQL 数据库端口号'));
    const user = getEnv('MYSQL_USER', 'MySQL 数据库用户名');
    const password = getEnv('MYSQL_PASSWORD', 'MySQL 数据库密码', true); // 允许空密码
    const database = getEnv('MYSQL_DATABASE', 'MySQL 数据库名称');

    console.log(`正在检查数据库 ${database} 是否存在...`);
    console.log(`连接信息: host=${host}, port=${port}, user=${user}, password=${password ? '已设置' : '未设置'}`);
    
    try {
        // 创建不指定数据库的连接
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
            connectTimeout: 10000,
        });

        try {
            // 检查数据库是否存在
            const [rows] = await connection.query(
                `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
                [database]
            );

            if (Array.isArray(rows) && rows.length === 0) {
                console.log(`数据库 ${database} 不存在，正在创建...`);
                await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
                console.log(`数据库 ${database} 创建成功`);
            } else {
                console.log(`数据库 ${database} 已存在`);
            }
        } finally {
            await connection.end();
        }
    } catch (error: Error | { message?: string; name?: string }) {
        const err: Error = error instanceof Error 
            ? error 
            : { name: error.name || 'Error', message: error.message || '未知错误' } as Error;
        console.error('数据库连接或创建失败:', error);
        throw new Error(`无法连接到数据库服务器或创建数据库: ${err.message}`);
    }
}

async function initSuperAdmin() {
    let customDataSource: DataSource | null = null;
    
    try {
        // 先检查并创建数据库
        await checkAndCreateDatabase();
        
        // 使用 127.0.0.1 替代 localhost 来避免 socket 连接问题
        let dataSourceToUse = AppDataSource;
        
        if (ENV.MYSQL_HOST === 'localhost') {
            
            // 创建一个新的 DataSource，使用与 AppDataSource 相同的配置，但将 host 改为 127.0.0.1
            customDataSource = new DataSource({
                ...AppDataSource.options,
                host: '127.0.0.1'
            } as typeof AppDataSource.options);
            
            dataSourceToUse = customDataSource;
        }
        
        // 初始化数据源连接
        if (!dataSourceToUse.isInitialized) {
            await dataSourceToUse.initialize();
            console.log('数据库连接成功');
        }

        // 运行迁移
        await dataSourceToUse.runMigrations();
        console.log('数据库迁移完成');

        // 1. 创建所有基础权限
        const permissions: Permission[] = [];
        const permissionRepository = dataSourceToUse.getRepository(Permission);
        
        for (const resource of resources) {
            for (const action of actions) {
                const permissionName = `${resource}:${action}`;
                // 检查权限是否已存在
                let permission = await permissionRepository.findOne({
                    where: { name: permissionName }
                });
                
                if (!permission) {
                    permission = permissionRepository.create({
                        id: nanoid(16),
                        name: permissionName,
                        resource: resource,
                        action: action,
                        description: `允许${action}操作${resource}资源`
                    });
                    permission = await permissionRepository.save(permission);
                    console.log(`创建权限: ${permissionName}`);
                } else {
                    console.log(`权限已存在，跳过: ${permissionName}`);
                }
                permissions.push(permission);
            }
        }
        console.log(`共处理 ${permissions.length} 个权限`);

        // 2. 创建超级管理员角色
        const roleRepository = dataSourceToUse.getRepository(Role);
        let role = await roleRepository.findOne({
            where: { name: ROLE_NAMES.SUPER_ADMIN }
        });

        if (!role) {
            role = roleRepository.create({
                id: nanoid(16),
                name: ROLE_NAMES.SUPER_ADMIN,
                description: '超级管理员，拥有所有权限',
                permissions: permissions
            });
            role = await roleRepository.save(role);
            console.log('创建了超级管理员角色');
        } else {
            role.permissions = permissions;
            role = await roleRepository.save(role);
            console.log('更新了超级管理员角色权限');
        }

        // 3. 创建超级管理员用户
        const userRepository = dataSourceToUse.getRepository(User);
        
        // 从环境变量获取超级管理员用户名和密码
        const adminUsername = getEnv('ADMIN_USERNAME', '超级管理员用户名');
        const adminEmail = getEnv('ADMIN_EMAIL', '超级管理员邮箱');
        const adminPassword = getEnv('ADMIN_PASSWORD', '超级管理员密码');
        const adminNickname = getEnvOptional('ADMIN_NICKNAME') || '超级管理员';
        const adminPhone = getEnvOptional('ADMIN_PHONE') || '13800000000';
        const adminGender: UserGender = (getEnvOptional('ADMIN_GENDER') as UserGender) || UserGender.MALE;
        const adminBirthdate = getEnvOptional('ADMIN_BIRTHDATE') || null; // 可选 YYYY-MM-DD
        
        let user = await userRepository.findOne({
            where: { username: adminUsername }
        });

        if (!user) {
            console.log(`准备创建超级管理员用户: ${adminUsername}, 密码: ${adminPassword}`);
            
            // 直接使用 SQL 插入用户记录，绕过 TypeORM 的实体钩子
            // 手动加密密码
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            console.log(`密码已手动加密: ${hashedPassword.substring(0, 10)}...`);
            
            // 生成用户 ID
            const userId = nanoid(16);
            
            // 使用原始 SQL 插入用户记录
            await dataSourceToUse.query(
                `INSERT INTO users (id, username, email, password, status, isActive, nickname, phone, gender, birthdate) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    adminUsername,
                    adminEmail,
                    hashedPassword,
                    UserStatus.ACTIVE,
                    true,
                    adminNickname,
                    adminPhone,
                    adminGender,
                    adminBirthdate
                ]
            );
            
            // 插入用户角色关系
            await dataSourceToUse.query(
                `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
                [userId, role.id]
            );
            
            console.log(`创建了超级管理员用户: ${adminUsername}`);
            
            // 从数据库中重新获取用户，以便进行密码验证测试
            user = await userRepository.findOne({
                where: { username: adminUsername },
                select: ['username', 'password'] as (keyof User)[]
            });
            
            if (user) {
                // 验证密码是否可以正确比较
                const testPassword = adminPassword;
                const isValid = await bcrypt.compare(testPassword, user.password);
                console.log(`密码验证测试: ${isValid ? '成功' : '失败'}`);
            }
        } else {
            user.roles = [role];
            await userRepository.save(user);
            console.log(`更新了超级管理员用户角色: ${adminUsername}`);
        }

        console.log('初始化完成！');
        console.log(`超级管理员账号：${adminUsername}`);
        console.log(`超级管理员密码：${adminPassword}`);

    } catch (error: Error | { message?: string; stack?: string; name?: string }) {
        const err: Error = error instanceof Error 
            ? error 
            : { name: error.name || 'Error', message: error.message || '未知错误', stack: error.stack } as Error;
        console.error('初始化失败：', err);
    } finally {
        // 关闭数据源连接
        if (customDataSource && customDataSource.isInitialized) {
            await customDataSource.destroy();
        } else if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

// 运行初始化
initSuperAdmin(); 