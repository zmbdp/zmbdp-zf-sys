import { defineStore } from 'pinia';
import {
  loginApi,
  getUserInfoApi,
  logoutApi
} from '@/api/login';

const state = () => ({
  token: '',
  userInfo: {}
});

const actions = {
  // 设置 token
  setToken(token) {
    this.token = token;
  },
  removeToken() {
    this.token = '';
  },
  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  },
  removeUserInfo() {
    this.userInfo = {};
  },
  // 登录 action
  loginAction({ phone, password }) {
    return new Promise((resolve, reject) => {
      // 调用登录接口
      loginApi({ phone, password })
        .then((res) => {
          this.setToken(res.accessToken);
          resolve();
          // 注意：因为使用了pinia状态持久化插件，因此当数据存储在pinia中的时候，也会在本地存储一份该数据
          // pinia中的数据是保存在内存中（临时存储），页面刷新数据就丢失后了；只有把数据存储在本地，这样的话，数据刷新才不丢失。
          // 今后操作数据的原则：
          // 1. 无论是获取数据还是修改数据，一律操作的都是 pinia 中的数据；因为当 pinia 中的数据发生变化了，本地存储中的数据会同步发生变化（pinia持久化插件帮我们实现了）
          // 2. 当页面刷新的时候，插件会自动将本地存储中的数据给 pinia 中的数据赋值，从而保证了 pinia 中的数据刷新不丢失
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 获取用户信息 action
  getUserInfoAction() {
    return new Promise((resolve, reject) => {
      // 发请求
      getUserInfoApi()
        .then((userInfo) => {
          this.setUserInfo(userInfo);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 退出 action
  logoutAction() {
    return new Promise((resolve) => {
      logoutApi()
        .then(() => {
          this.removeToken();
          this.removeUserInfo();
          resolve();
        })
        .catch(() => {
          // 即使后端调用失败，也要清除本地token和用户信息
          this.removeToken();
          this.removeUserInfo();
          resolve();
        });
    });
  }
};

export const useUserStore = defineStore('user', {
  state,
  actions,
  // 数据持久化
  persist: true
});
