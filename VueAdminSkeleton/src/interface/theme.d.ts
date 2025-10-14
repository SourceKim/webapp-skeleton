export interface Theme {
    id: string
    label: string
    cssVars: CssVars
}

export type ThemeKey = '--el-bg-color-page' | '--el-bg-color' | '--el-bg-color-overlay' | '--el-color-primary-dark-2' | '--el-color-primary' | '--el-color-primary-light-3' | '--el-color-primary-light-5' | '--el-color-primary-light-7' | '--el-color-primary-light-8' | '--el-color-primary-light-9'

export type CssVars = {
    [K in ThemeKey]: {light: string, dark: string}
}
