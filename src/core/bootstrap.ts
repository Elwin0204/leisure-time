import { UserStore } from '@/store/user'
import { routes } from '@/router'
import { filterRoute } from './permission'
import { printANSI } from '@/utils/screenLog'


export default function Initializer (): void {
  printANSI()
  const permissionRoutes = filterRoute(routes)
  const userStore = UserStore()
  userStore.setRouteList(permissionRoutes)
}