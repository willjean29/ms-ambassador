import axios, { Method } from "axios";
import AppError from "../errors/AppError";

export class UserService {
  static async request(method: Method, url: string, data = {}, cookie = "") {
    let headers = {};
    if (cookie != "") {
      headers = {
        'Cookie': `jwt=${cookie}`
      }
    }
    try {
      const response = await axios.request({
        method,
        url,
        baseURL: process.env.USERS_MS + '/api',
        headers,
        data
      })

      return response.data;
    } catch (error) {
      const message = error.response.data.message || error.message;
      const status = error.response.status || error.status
      throw new AppError(message, status);
    }
  }

  static async post(url: string, data = {}, cookie = "") {
    return this.request('POST', url, data, cookie);
  }

  static async put(url: string, data = {}, cookie = "") {
    return this.request('PUT', url, data, cookie);
  }

  static async get(url: string, cookie = "") {
    return this.request('GET', url, {}, cookie);
  }
}