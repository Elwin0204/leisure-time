/*
 * @Author: Elwin
 * @Date: 2021-11-08 16:59:47
 * @LastEditTime: 2021-11-08 17:00:10
 * @LastEditors: Elwin
 * @Description: axios module declaration
 * @FilePath: \ionicDemo\src\axios.d.ts
 */
import * as axios from 'axios'

declare module 'axios' {
  interface AxiosInstance { 
    <T = any>(config: AxiosRequestConfig): Promise<T>;
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  }
}