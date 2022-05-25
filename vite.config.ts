/*
 * @Author: Elwin
 * @Date: 2022-03-31 13:16:25
 * @LastEditTime: 2022-04-02 09:43:01
 * @LastEditors: Elwin
 * @Description: config file
 * @FilePath: \vite-vue3-ts-demo\vite.config.ts
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import viteSvgIcons from 'vite-plugin-svg-icons';
import vueJsx from '@vitejs/plugin-vue-jsx';

const pathResolve = (dir: string): string => resolve(__dirname, '.', dir);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteSvgIcons({
      // config the svg files dir
      iconDirs: [resolve(process.cwd(), 'src/svgs/src')],
      symbolId: 'icon-[name]',
    }),
    vueJsx(),
  ],
  resolve: {
    alias: [{ find: '@', replacement: pathResolve('src') }],
  },
  define: {
    APP_VERSION: JSON.stringify('1.0.0'),
    BUILD_DATE: JSON.stringify('2022-06-06'),
    GIT_HASH: JSON.stringify('xxx'),
  },
  server: {
    host: '0.0.0.0',
  },
  // css: {
  //   preprocessorOptions: {
  //     less: {
  //       javascriptEnabled: true,
  //       additionalData: `@import "${path.re}";`
  //     }
  //   }
  // }
});
