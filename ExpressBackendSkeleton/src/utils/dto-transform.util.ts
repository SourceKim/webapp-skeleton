/**
 * DTO 转换工具函数
 * 用于将数据库实体（下划线命名）转换为响应 DTO（驼峰命名）
 */

import type { JsonValue } from '@/types/common';

/**
 * 将下划线命名转换为驼峰命名的类型工具
 */
type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}`
    ? `${P1}${Capitalize<CamelCase<P2>>}`
    : S;

/**
 * 对象值类型（用于转换）
 */
type ObjectValue = JsonValue | ObjectValue[] | { [key: string]: ObjectValue };

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
 * @template T 输入类型
 */
export function transformToCamelCase<T>(obj: T): T extends (infer U)[]
    ? ReturnType<typeof transformToCamelCase<U>>[]
    : T extends string | number | boolean | null | undefined | Date
    ? T
    : T extends Record<string, unknown>
    ? { [K in keyof T as K extends string ? CamelCase<K> : K]: ReturnType<typeof transformToCamelCase<T[K]>> }
    : ObjectValue {
    // 处理 null 和 undefined
    if (obj === null || obj === undefined) {
        return obj as ReturnType<typeof transformToCamelCase<T>>;
    }

    // 处理数组
    if (Array.isArray(obj)) {
        return obj.map(item => transformToCamelCase(item)) as ReturnType<typeof transformToCamelCase<T>>;
    }

    // 处理基本类型（非对象）
    if (typeof obj !== 'object') {
        return obj as ReturnType<typeof transformToCamelCase<T>>;
    }

    // 处理 Date 对象
    if (obj instanceof Date) {
        return obj as ReturnType<typeof transformToCamelCase<T>>;
    }

    // 处理普通对象
    const transformed: Record<string, ObjectValue> = {};
    const objRecord = obj as Record<string, unknown>;
    for (const [key, value] of Object.entries(objRecord)) {
        const camelKey = snakeToCamel(key);
        
        // 递归处理嵌套对象和数组
        if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
            transformed[camelKey] = Array.isArray(value) 
                ? value.map(item => transformToCamelCase(item))
                : transformToCamelCase(value as Record<string, unknown>);
        } else {
            transformed[camelKey] = value as ObjectValue;
        }
    }

    return transformed as ReturnType<typeof transformToCamelCase<T>>;
}
