import { defineStore } from 'pinia'

interface IApp {
  theme: string
}

export const AppStore = defineStore('AppStore', {
  state: (): IApp => {
    return {
      theme: 'day'
    }
  }
})