/**
 * DTO 转换工具函数
 * 用于将数据库实体（下划线命名）转换为响应 DTO（驼峰命名）
 */

/**
 * 将下划线命名转换为驼峰命名
 */
function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 递归转换对象的键名从下划线到驼峰
 * @param obj 需要转换的对象（可以是对象、数组或基本类型）
 * @returns 转换后的对象（驼峰命名）
 */
export function transformToCamelCase<T = any>(obj: T): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => transformToCamelCase(item));
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    // 处理 Date 对象
    if (obj instanceof Date) {
        return obj;
    }

    const transformed: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
        const camelKey = snakeToCamel(key);
        
        // 递归处理嵌套对象和数组
        if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
            transformed[camelKey] = Array.isArray(value) 
                ? value.map(item => transformToCamelCase(item))
                : transformToCamelCase(value);
        } else {
            transformed[camelKey] = value;
        }
    }

    return transformed;
}
