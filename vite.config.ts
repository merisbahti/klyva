// vite.config.js
const path = require('path')
const { defineConfig } = require('vite')
const typescript = require('@rollup/plugin-typescript')

const resolvePath = (str: string) => path.resolve(__dirname, str)

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolvePath('src/index.ts'),
      format: 'umd',
      name: 'index',
      fileName: (format) => {
        switch (format) {
          case 'umd':
            return 'index.js'
          default:
            return `index.${format}.js`
        }
      },
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
      plugins: [
        typescript({
          target: 'es2020',
          rootDir: resolvePath('src'),
          declaration: true,
          declarationDir: resolvePath('dist'),
          exclude: resolvePath('node_modules/**'),
          allowSyntheticDefaultImports: true,
        }),
      ],
    },
  },
})
