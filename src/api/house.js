import request from '@/utils/request'

/**
 * 获取房源列表（支持筛选）
 */
export const getHouseListApi = ({
  houseId,
  title,
  rentType,
  status,
  cityId,
  communityName,
  pageNo,
  pageSize
}) => {
  return request({
    method: 'post',
    url: '/admin/house/list',
    data: {
      houseId,
      title,
      rentType,
      status,
      cityId,
      communityName,
      pageNo,
      pageSize
    }
  })
}

/**
 * 获取城市列表
 */
export const getCityListApi = () => {
  return request({
    method: 'get',
    url: '/admin/map/city_list'
  })
}

/**
 * 获取房源详情
 */
export const getHouseDetailApi = (houseId) => {
  return request({
    method: 'get',
    url: '/admin/house/detail',
    params: {
      houseId
    }
  })
}

/**
 *修改房源状态（包含租期）
 */
export const putHouseStatusApi = ({
  houseId,
  status,
  rentTimeCode
}) => {
  return request({
    method: 'post',
    url: '/admin/house/status/edit',
    data: {
      houseId,
      status,
      rentTimeCode
    }
  })
}

/**
 * 获取子行政区划
 */
export const getChildrenRegionApi = (parentId) => {
  return request({
    method: 'get',
    url: '/admin/map/region_children_list',
    params: {
      parentId
    }
  })
}

/**
 * 图片上传
 */
export const postImageUploadApi = (formData) => {
  return request({
    method: 'post',
    url: '/file/upload',
    data: formData
  })
}

/**
 * 新增房源
 */
export const postHouseApi = ({
  title,
  cityId,
  regionId,
  communityName,
  detailAddress,
  rentType,
  rooms,
  floor,
  allFloor,
  area,
  position,
  userId,
  price,
  houseType,
  intro,
  tagCodes,
  devices,
  images,
  headImage,
  cityName,
  regionName,
  longitude,
  latitude
}) => {
  return request({
    method: 'post',
    url: '/admin/house/add_edit',
    data: {
      title,
      cityId,
      regionId,
      communityName,
      detailAddress,
      rentType,
      rooms,
      floor,
      allFloor,
      area,
      position,
      userId,
      price,
      houseType,
      intro,
      tagCodes,
      devices,
      images,
      headImage,
      cityName,
      regionName,
      longitude,
      latitude
    }
  })
}
