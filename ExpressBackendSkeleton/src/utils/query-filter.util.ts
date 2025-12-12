import { SelectQueryBuilder, Brackets, ObjectLiteral } from 'typeorm';
import { FilterOperator, FilterCondition } from '@skeleton/shared-types';

/**
 * 查询筛选构建器
 * 用于将筛选参数转换为 TypeORM 查询条件
 */
export class QueryFilterBuilder {
    /**
     * 解析筛选参数为筛选条件数组
     * @param filters 筛选参数对象
     * @param entityAlias 实体别名（用于 TypeORM 查询）
     * @returns 筛选条件数组
     */
    static parseFilters(filters: Record<string, any>, entityAlias: string = ''): FilterCondition[] {
        const conditions: FilterCondition[] = [];
        
        if (!filters || typeof filters !== 'object') {
            return conditions;
        }

        for (const [field, value] of Object.entries(filters)) {
            if (value === null || value === undefined) {
                continue;
            }

            const fieldPath = entityAlias ? `${entityAlias}.${field}` : field;

            // 如果值是对象，说明包含操作符
            if (typeof value === 'object' && !Array.isArray(value)) {
                for (const [operator, operatorValue] of Object.entries(value)) {
                    if (this.isValidOperator(operator)) {
                        conditions.push({
                            field: fieldPath,
                            operator: operator as FilterOperator,
                            value: operatorValue
                        });
                    }
                }
            } else {
                // 简单的等值匹配
                conditions.push({
                    field: fieldPath,
                    operator: FilterOperator.EQUALS,
                    value: value
                });
            }
        }

        return conditions;
    }

    /**
     * 将筛选条件应用到 TypeORM 查询构建器
     * @param queryBuilder TypeORM 查询构建器
     * @param conditions 筛选条件数组
     * @returns 应用筛选条件后的查询构建器
     */
    static applyFilters<T extends ObjectLiteral>(
        queryBuilder: SelectQueryBuilder<T>, 
        conditions: FilterCondition[]
    ): SelectQueryBuilder<T> {
        if (!conditions || conditions.length === 0) {
            return queryBuilder;
        }

        conditions.forEach((condition, index) => {
            const paramKey = `filter_${index}`;
            const whereMethod = index === 0 ? 'where' : 'andWhere';

            switch (condition.operator) {
                case FilterOperator.EQUALS:
                    queryBuilder[whereMethod](`${condition.field} = :${paramKey}`, {
                        [paramKey]: condition.value
                    });
                    break;

                case FilterOperator.NOT_EQUALS:
                    queryBuilder[whereMethod](`${condition.field} != :${paramKey}`, {
                        [paramKey]: condition.value
                    });
                    break;

                case FilterOperator.LIKE:
                    queryBuilder[whereMethod](`${condition.field} LIKE :${paramKey}`, {
                        [paramKey]: `%${condition.value}%`
                    });
                    break;

                case FilterOperator.ILIKE:
                    queryBuilder[whereMethod](`LOWER(${condition.field}) LIKE LOWER(:${paramKey})`, {
                        [paramKey]: `%${condition.value}%`
                    });
                    break;

                case FilterOperator.IN:
                    const inValues = Array.isArray(condition.value) 
                        ? condition.value 
                        : condition.value.toString().split(',').map((v: string) => v.trim());
                    queryBuilder[whereMethod](`${condition.field} IN (:...${paramKey})`, {
                        [paramKey]: inValues
                    });
                    break;

                case FilterOperator.NOT_IN:
                    const notInValues = Array.isArray(condition.value) 
                        ? condition.value 
                        : condition.value.toString().split(',').map((v: string) => v.trim());
                    queryBuilder[whereMethod](`${condition.field} NOT IN (:...${paramKey})`, {
                        [paramKey]: notInValues
                    });
                    break;

                case FilterOperator.GREATER_THAN:
                    queryBuilder[whereMethod](`${condition.field} > :${paramKey}`, {
                        [paramKey]: condition.value
                    });
                    break;

                case FilterOperator.GREATER_THAN_EQUAL:
                    queryBuilder[whereMethod](`${condition.field} >= :${paramKey}`, {
                        [paramKey]: condition.value
                    });
                    break;

                case FilterOperator.LESS_THAN:
                    queryBuilder[whereMethod](`${condition.field} < :${paramKey}`, {
                        [paramKey]: condition.value
                    });
                    break;

                case FilterOperator.LESS_THAN_EQUAL:
                    queryBuilder[whereMethod](`${condition.field} <= :${paramKey}`, {
                        [paramKey]: condition.value
                    });
                    break;

                case FilterOperator.IS_NULL:
                    queryBuilder[whereMethod](`${condition.field} IS NULL`);
                    break;

                case FilterOperator.IS_NOT_NULL:
                    queryBuilder[whereMethod](`${condition.field} IS NOT NULL`);
                    break;

                case FilterOperator.BETWEEN:
                    if (Array.isArray(condition.value) && condition.value.length === 2) {
                        queryBuilder[whereMethod](`${condition.field} BETWEEN :${paramKey}_start AND :${paramKey}_end`, {
                            [`${paramKey}_start`]: condition.value[0],
                            [`${paramKey}_end`]: condition.value[1]
                        });
                    }
                    break;

                default:
                    // 忽略不支持的操作符
                    break;
            }
        });

        return queryBuilder;
    }

    /**
     * 检查操作符是否有效
     * @param operator 操作符字符串
     * @returns 是否为有效操作符
     */
    private static isValidOperator(operator: string): boolean {
        return Object.values(FilterOperator).includes(operator as FilterOperator);
    }

    /**
     * 清理筛选参数，移除空值和无效参数
     * @param filters 原始筛选参数
     * @returns 清理后的筛选参数
     */
    static cleanFilters(filters: Record<string, any>): Record<string, any> {
        const cleaned: Record<string, any> = {};

        for (const [key, value] of Object.entries(filters)) {
            if (value === null || value === undefined || value === '') {
                continue;
            }

            if (typeof value === 'object' && !Array.isArray(value)) {
                const cleanedNestedObject: Record<string, any> = {};
                for (const [nestedKey, nestedValue] of Object.entries(value)) {
                    if (nestedValue !== null && nestedValue !== undefined && nestedValue !== '') {
                        cleanedNestedObject[nestedKey] = nestedValue;
                    }
                }
                if (Object.keys(cleanedNestedObject).length > 0) {
                    cleaned[key] = cleanedNestedObject;
                }
            } else {
                cleaned[key] = value;
            }
        }

        return cleaned;
    }
} 