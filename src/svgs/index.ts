/*
 * @Author: Elwin
 * @Date: 2022-04-02 17:00:18
 * @LastEditTime: 2022-04-06 10:43:42
 * @LastEditors: Please set LastEditors
 * @Description: svg files
 * @FilePath: \vite-vue3-ts-demo\src\svgs\index.ts
 */
import { IModules } from '@/typings/svgs'

const files = import.meta.globEager('./src/*.svg')

const modules: IModules = {}

for (const key in files) {
  modules[key.replace(/(\.\/src\/|\.svg)/g, '')] = files[key].default
}

Object.keys(modules).forEach(item => {
  modules[item]['namespaced'] = true
})
