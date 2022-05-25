/*
 * @Author: Elwin
 * @Date: 2022-04-13 09:33:35
 * @LastEditTime: 2022-04-26 09:46:54
 * @LastEditors: Elwin
 * @Description: type definition for 2048
 * @FilePath: \vite-vue3-ts-demo\src\typings\game2048.d.ts
 */
export enum IMode {
  Easy=3,
  Nomal,
  Hard
}

export interface IModes {
  title: string,
  value: Mode
}

export interface ICoordinate {
  r: number,
  c: number
}
