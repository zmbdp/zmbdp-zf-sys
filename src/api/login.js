// 导入公共请求函数
import request from '@/utils/request'

/**
 * 登录
 */
export const loginApi = ({ phone, password }) => {
  return request({
    method: 'post',
    url: '/admin/sys_user/login/password',
    data: {
      phone,
      password
    }
  })
}

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  return request({
    method: 'get',
    url: '/admin/sys_user/login_info/get'
  })
}

/**
 * 登出
 */
export const logoutApi = () => {
  return request({
    method: 'DELETE',
    url: '/admin/sys_user/logout'
  })
}
