import { AppDataSource } from '../src/configs/database.config';

async function fix() {
    try {
        await AppDataSource.initialize();
        const queryRunner = AppDataSource.createQueryRunner();
        
        console.log('Cleaning up failed migration tables...');
        // Disable FK checks to avoid ordering issues during drop
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
        
        await queryRunner.query('DROP TABLE IF EXISTS `shop_intro_banners`');
        await queryRunner.query('DROP TABLE IF EXISTS `shop_intros`');
        await queryRunner.query('DROP TABLE IF EXISTS `carousels`');
        
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
        
        console.log('Cleanup complete.');
        await AppDataSource.destroy();
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
}

fix();





