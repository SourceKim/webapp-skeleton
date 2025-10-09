import type { Theme } from '@/interface/theme'

export const defaultTheme: Theme = {
    id: 'default',
    label: '默认',
    cssVars: {
        '--el-bg-color-page': { light: '#f5f5f5', dark: '#252525' },
        '--el-bg-color': { light: '#ffffff', dark: '#1e1e1e' },
        '--el-bg-color-overlay': { light: '#ffffff', dark: '#1d1e1f' },
        '--el-color-primary-dark-2': { light: '#7F4CF5', dark: '#a786ff' },
        '--el-color-primary': { light: '#8B5CF6', dark: '#997ee1' },
        '--el-color-primary-light-3': { light: '#AF90F9', dark: '#8b5df8' },
        '--el-color-primary-light-5': { light: '#C8B2FB', dark: '#9165f5' },
        '--el-color-primary-light-7': { light: '#DCCFFC', dark: '#7f51fa' },
        '--el-color-primary-light-8': { light: '#EEE7FE', dark: '#543d8d' },
        '--el-color-primary-light-9': { light: '#F8F5FE', dark: '#212028' }
    }
}