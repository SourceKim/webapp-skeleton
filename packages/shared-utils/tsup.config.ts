import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    env: 'src/env/index.ts',
    'env/vite': 'src/env/vite.ts',
    'env/taro': 'src/env/taro.ts',
    logger: 'src/logger/index.ts',
    'logger/vite': 'src/logger/vite.ts',
    validation: 'src/validation/index.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['dotenv', 'fs', 'path', 'winston']
})
