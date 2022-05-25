/*
 * @Author: Elwin
 * @Date: 2022-03-31 13:16:25
 * @LastEditTime: 2022-04-02 08:21:46
 * @LastEditors: Elwin
 * @Description: Project entry
 * @FilePath: \vite-vue3-ts-demo\src\main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './styles/normalize.less'
import 'vite-plugin-svg-icons/register'
import SvgIcon from './components/svg-icon/index.vue'
import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App)
app.component('svg-icon', SvgIcon)
app.use(pinia)
app.use(router).mount('#app')
