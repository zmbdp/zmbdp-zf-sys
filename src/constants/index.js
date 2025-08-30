// 中英文角色的映射关系
export const ROLE_MAP = {
  super_admin: '超级管理员',
  platform_admin: '平台管理员'
}

/**
 * 房源状态映射关系
 */
export const HOUSE_STATUS_MAP = {
  RENTING: '出租中',
  UP: '上架',
  DOWN: '下架'
}

/**
 * 房源出租类型映射关系
 */
export const HOUSE_RENT_TYPE_MAP = {
  whole_rent: '整租',
  share_rent: '合租',
  worry_free_rental: '省心租',
  apartment: '公寓',
  personal_house: '个人房源'
}

/**
 * 房屋设备列表映射关系
 */
export const DEVICE_LIST_MAP = {
  soft: '沙发',
  washer: '洗衣机',
  heater: '热水器',
  broadband: '宽带',
  icebox: '冰箱',
  hood: '抽烟机',
  gas: '燃气灶',
  cook: '可做饭',
  tv: '电视',
  aircondition: '空调',
  wardrobe: '衣柜',
  bed: '床',
  toilet: '卫生间',
  smartlock: '智能门锁',
  balcony: '阳台',
  heating: '暖气'
}

/**
 * 房屋朝向映射关系
 */
export const POSITION_LIST_MAP = {
  east: '东',
  south: '南',
  west: '西',
  north: '北'
}

/**
 * 房屋数量映射关系
 */
export const ROOM_NUM_MAP = {
  one: '1居',
  two: '2居',
  three: '3居',
  four: '4居',
  more: '4居以上'
}

/**
 * 房屋标签映射关系
 */
export const HOUSE_TAG_MAP = {
  near_subway: '近地铁',
  civil_water_elec: '民水民电',
  lift: '有电梯',
  central_heating: '集中供暖',
  renovation: '精装修'
}

// 图片云服务器的基础地址
export const IMAGE_HOST =
  'https://framework-java-web.oss-cn-shanghai.aliyuncs.com/'

/**
 * 房屋租期映射关系
 */
export const RENT_TIME_MAP = {
  thirty_seconds: '三十秒',
  three_month: '三个月',
  half_year: '半年',
  one_year: '一年'
}
