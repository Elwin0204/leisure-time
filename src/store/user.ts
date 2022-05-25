/*
 * @Author: Elwin
 * @Date: 2022-04-06 16:42:53
 * @LastEditTime: 2022-05-06 10:26:02
 * @LastEditors: Elwin
 * @Description: user store
 * @FilePath: \vite-vue3-ts-demo\src\store\user.ts
 */
import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'

interface IUser {
  name: string,
  tags: string[],
  routeList: Array<RouteRecordRaw>
}

export const UserStore = defineStore('UserStore', {
  state: (): IUser => {
    return {
      name: '',
      tags: ['vue', 'react', 'angular'],
      routeList: []
    }
  },
  getters: {
    userRoutes: (state) => state.routeList
  },
  actions: {
    setName(name: string) {
      this.name = name
    },
    setRouteList(routeList: Array<RouteRecordRaw>) {
      this.routeList = routeList
    }
  }
})