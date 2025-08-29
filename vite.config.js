// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// 引入 path 模块
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, 'src/icons')],
      symbolId: 'icon-[name]'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 统一导入 scss 样式变量，今后在任意的 vue 文件中就无需导入了，直接使用变量值即可
        additionalData: `@use '/src/styles/variables.scss' as *;`
      }
    }
  },
  // 开发服务器配置
  server: {
    port: 80, // 端口
    open: true, // 自动打开浏览器
    // 配置跨域请求代理
    proxy: {
      '/dev-api': {
        // 目前服务器地址
        target: 'http://127.0.0.1:10030',
        changeOrigin: true, // 改变请求头的origin源，到达目标服务器的值target的值，而不是前端的请求路径

        // 路径重写，如果不加rewrite，今后目标服务器收到的完整地址就是 http://47.108.58.48/dev-api/xxx,
        // 由于目标目标服务器真实路径 没有 /dev-api，因此需要把这块给它去掉，这里用一个字符串 replace 方法，替换成空字符串即可
        rewrite: (path) => path.replace(/^\/dev-api/, '')
      }
    }
  }
});
