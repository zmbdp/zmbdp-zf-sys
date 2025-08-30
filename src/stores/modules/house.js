import { defineStore } from 'pinia'
import { getCityListApi } from '@/api/house'

const state = () => ({
  // 城市列表
  cityList: []
})

const actions = {
  getCityListAction() {
    return new Promise((resolve, reject) => {
      getCityListApi()
        .then((cityList) => {
          // 完成赋值
          this.cityList = cityList
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export const useHouseStore = defineStore('house', {
  state,
  actions
})
