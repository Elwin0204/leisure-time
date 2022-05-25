// type SvgModules<T, K extends keyof T> = {
//   [P in K]: T[P];
// }

// export interface IModules<T, K extends keyof T> {
//   [P in K]: T[P];
// }

export interface IModules {
  [key: string]: any;
}