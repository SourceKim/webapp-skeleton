import { MaterialType } from "./material.model";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { logError } from '@/utils/logger';
import type { JsonValue } from '@/types/common';

/**
 * 根据MIME类型确定素材类型
 * @param mimetype MIME类型
 * @returns 素材类型
 */
export const getMaterialTypeFromMimetype = (mimetype: string): MaterialType => {
    const mimeType = mimetype.toLowerCase();
    
    if (mimeType.startsWith('image/')) {
        return MaterialType.IMAGE;
    } else if (mimeType.startsWith('audio/')) {
        return MaterialType.AUDIO;
    } else if (mimeType.startsWith('video/')) {
        return MaterialType.VIDEO;
    } else if ([
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv'
    ].includes(mimeType)) {
        return MaterialType.DOCUMENT;
    } else if (mimeType === 'text/plain' || mimeType === 'text/html' || mimeType === 'text/markdown') {
        return MaterialType.TEXT;
    }
    
    return MaterialType.OTHER;
}

/**
 * 根据素材类型确定子目录
 * @param type 素材类型
 * @returns 子目录名称
 */
export const getSubDirByType = (type: MaterialType): string => {
    switch (type) {
        case MaterialType.IMAGE: return 'images';
        case MaterialType.AUDIO: return 'audios';
        case MaterialType.VIDEO: return 'videos';
        case MaterialType.DOCUMENT: return 'documents';
        case MaterialType.TEXT: return 'texts';
        default: return 'others';
    }
}

/**
 * 根据MIME类型获取文件存储子目录
 * @param mimetype MIME类型
 * @returns 子目录名称
 */
export const getFileTypeFromMime = (mimetype: string): string => {
    if (mimetype.startsWith('image/')) return 'images';
    if (mimetype.startsWith('audio/')) return 'audios';
    if (mimetype.startsWith('video/')) return 'videos';
    if (mimetype.includes('pdf') || mimetype.includes('document') || mimetype.includes('text')) return 'documents';
    return 'others';
}

/**
 * 确保上传目录存在
 */
export const createDirIfNotExists = (dir: string): void => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * 将文件从临时位置移动到最终位置
 * @param destPath 目标路径
 * @param originalPath 原始路径
 */
export const writeFile = async (destPath: string, originalPath: string): Promise<void> => {
        // 创建可写流
        const writeStream = fs.createWriteStream(destPath);
        
        // 将文件内容写入流
        await new Promise<void>((resolve, reject) => {
            const readStream = fs.createReadStream(originalPath);
            readStream.pipe(writeStream);
            
            writeStream.on('finish', () => {
                // 删除临时文件
                fs.unlink(originalPath, (err) => {
                    if (err) logError('删除临时文件失败', undefined, { error: err, filePath: originalPath });
                });
                
                resolve();
            });
            
            writeStream.on('error', (err) => {
                reject(err);
            });
        });
}

/**
 * 生成唯一的文件名
 * @param originalName 原始文件名
 * @returns 唯一的文件名
 */
export const generateUniqueFilename = (originalName: string): string => {
    // 统一将文件名规范化，去除/替换可能导致路径或编码问题的字符
    const ext = path.extname(originalName || '').normalize();
    const rawName = path.basename(originalName || '', ext).normalize();
    // 替换空白与路径危险字符；允许中文，避免丢失
    const safeName = rawName
        .replace(/[\\/:*?"<>|]/g, '-')
        .replace(/\s+/g, '_')
        .slice(0, 80); // 控制长度，避免过长
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9);
    return `${safeName || 'file'}_${timestamp}_${randomString}${ext}`;
}

/**
 * 将可能为 latin1 的原始文件名转换为 utf8
 */
export const decodeLatin1ToUtf8 = (name: string | undefined | null): string => {
    if (!name) return '';
    try {
        return Buffer.from(name, 'latin1').toString('utf8');
    } catch {
        return name;
    }
}

/**
 * 解析标签数据
 * 支持字符串、JSON字符串、数组等多种格式
 * @param tags 标签数据
 * @returns 标签数组或undefined
 */
export const parseTags = (tags: string | string[] | JsonValue | null | undefined): string[] | undefined => {
    if (!tags) return undefined;
    
    if (typeof tags === 'string') {
        try {
            // 尝试解析JSON字符串
            const parsed: JsonValue = JSON.parse(tags);
            if (Array.isArray(parsed)) {
                const stringArray = parsed.filter((item: JsonValue): item is string => typeof item === 'string');
                return stringArray.length > 0 ? stringArray : undefined;
            }
            return [tags];
        } catch {
            // 如果不是JSON，按逗号分割
            const splitTags = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
            return splitTags.length > 0 ? splitTags : undefined;
        }
    }
    
    if (Array.isArray(tags)) {
        const filtered: string[] = [];
        for (const tag of tags) {
            if (typeof tag === 'string' && tag.trim().length > 0) {
                filtered.push(tag.trim());
            }
        }
        return filtered.length > 0 ? filtered : undefined;
    }
    
    return undefined;
}

/**
 * 解析元数据
 * 支持字符串、JSON字符串、对象等多种格式
 * @param metadata 元数据
 * @returns 元数据对象或undefined
 */
export const parseMetadata = (metadata: string | Record<string, JsonValue> | JsonValue | null | undefined): Record<string, string | number | boolean | null | undefined> | undefined => {
    if (!metadata) return undefined;
    
    if (typeof metadata === 'string') {
        try {
            return JSON.parse(metadata);
        } catch {
            return { raw: metadata };
        }
    }
    
    if (typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata)) {
        return metadata as Record<string, string | number | boolean | null | undefined>;
    }
    
    return undefined;
}

/**
 * 计算文件的SHA256哈希值
 * @param filePath 文件路径
 * @returns Promise<string> 文件哈希值
 */
export const calculateFileHash = async (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', (data) => {
            hash.update(data);
        });
        
        stream.on('end', () => {
            resolve(hash.digest('hex'));
        });
        
        stream.on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * 检查文件是否存在
 * @param filePath 文件路径
 * @returns boolean
 */
export const fileExists = (filePath: string): boolean => {
    try {
        return fs.existsSync(filePath);
    } catch {
        return false;
    }
}

/**
 * 删除文件（如果存在）
 * @param filePath 文件路径
 * @returns Promise<boolean> 是否成功删除
 */
export const deleteFileIfExists = async (filePath: string): Promise<boolean> => {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            return true;
        }
        return false;
    } catch (error) {
        logError('删除文件失败', undefined, { error, filePath });
        return false;
    }
}

/**
 * 获取文件信息
 * @param filePath 文件路径
 * @returns 文件统计信息
 */
export const getFileStats = async (filePath: string): Promise<fs.Stats | null> => {
    try {
        return await fs.promises.stat(filePath);
    } catch (error) {
        logError('获取文件信息失败', undefined, { error, filePath });
        return null;
    }
}

/**
 * 验证文件类型是否被允许
 * @param mimetype MIME类型
 * @returns boolean
 */
export const isAllowedFileType = (mimetype: string): boolean => {
    const allowedMimes = [
        // 图片类型
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp',
        // 音频类型
        'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/aac', 'audio/flac',
        // 视频类型
        'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/mkv',
        // 文档类型
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain', 'text/csv', 'text/html', 'text/markdown'
    ];
    
    return allowedMimes.includes(mimetype.toLowerCase());
}

