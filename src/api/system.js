import request from '@/utils/request'

/**
 * 获取系统账号列表
 */
export const getSysUserListApi = ({ phoneNumber, status }) => {
  return request({
    method: 'post',
    url: '/admin/sys_user/list',
    data: {
      phoneNumber,
      status
    }
  })
}

/**
 * 新增或编辑平台账号
 */
export const postOrPutSysUserApi = ({
  userId,
  identity,
  phoneNumber,
  nickName,
  status,
  password,
  remark
}) => {
  return request({
    method: 'post',
    url: '/admin/sys_user/add_edit',
    data: {
      userId,
      identity,
      phoneNumber,
      nickName,
      status,
      password,
      remark
    }
  })
}

/**
 * 获取字典类型列表
 */
export const getDictTypeListApi = ({
  value,
  typeKey,
  pageNo,
  pageSize
}) => {
  return request({
    method: 'get',
    url: '/admin/dictionary/listType',
    params: {
      value,
      typeKey,
      pageNo,
      pageSize
    }
  })
}

/**
 * 新增字典类型
 */
export const postDictTypeApi = ({ remark, value, typeKey }) => {
  return request({
    method: 'post',
    url: '/admin/dictionary/addType',
    data: {
      remark,
      value,
      typeKey
    }
  })
}

/**
 * 编辑字典类型
 */
export const putDictTypeApi = ({ typeKey, value, remark }) => {
  return request({
    method: 'post',
    url: '/admin/dictionary/editType',
    data: {
      typeKey,
      value,
      remark
    }
  })
}

/**
 * 获取字典数据列表（字典详情）
 */
export const getDictDataListApi = ({
  pageNo,
  pageSize,
  typeKey,
  value
}) => {
  return request({
    method: 'get',
    url: '/admin/dictionary/listData',
    params: {
      pageNo,
      pageSize,
      typeKey,
      value
    }
  })
}

/**
 * 新增字典数据
 */
export const postDictDataApi = ({
  typeKey,
  value,
  dataKey,
  sort,
  status,
  remark
}) => {
  return request({
    method: 'post',
    url: '/admin/dictionary/addData',
    data: {
      typeKey,
      value,
      dataKey,
      sort,
      status,
      remark
    }
  })
}

/**
 * 编辑字典数据
 */
export const putDictDataApi = ({ dataKey, value, remark, sort }) => {
  return request({
    method: 'post',
    url: '/admin/dictionary/editData',
    data: {
      dataKey,
      value,
      remark,
      sort
    }
  })
}

/**
 * 获取参数列表
 */
export const getArgListApi = ({
  name,
  configKey,
  pageNo,
  pageSize
}) => {
  return request({
    method: 'get',
    url: '/admin/argument/list',
    params: {
      name,
      configKey,
      pageNo,
      pageSize
    }
  })
}

/**
 * 新增参数
 */
export const postArgApi = ({ name, configKey, value, remark }) => {
  return request({
    method: 'post',
    url: '/admin/argument/add',
    data: {
      name,
      configKey,
      value,
      remark
    }
  })
}

/**
 * 编辑参数
 */
export const putArgApi = ({ name, configKey, value, remark }) => {
  return request({
    method: 'post',
    url: '/admin/argument/edit',
    data: {
      name,
      configKey,
      value,
      remark
    }
  })
}
