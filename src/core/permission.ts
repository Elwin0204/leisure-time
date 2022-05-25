import { RouteRecordRaw } from 'vue-router'

export function filterRoute (routes: Array<RouteRecordRaw>): Array<RouteRecordRaw> {
  const permissionRoutes: Array<RouteRecordRaw> = []
  routes.forEach(route => {
    if (route.children) {
      for (const child of route.children) {
        if (child.name !== 'home') {
          permissionRoutes.push(child)
        }
      }
    }
  })
  return permissionRoutes
}