<script setup>
  import {
    HOUSE_TAG_MAP,
    DEVICE_LIST_MAP,
    POSITION_LIST_MAP,
    IMAGE_HOST,
    ROOM_NUM_MAP
  } from '@/constants'
  import { getHouseDetailApi } from '@/api/house'
  import { useRoute } from 'vue-router'
  import { ref, computed } from 'vue'
  const route = useRoute()
  const houseDetail = ref({})

  getHouseDetail()

  async function getHouseDetail() {
    const resp = await getHouseDetailApi(route.params.houseId)
    resp.images =
      resp.images && resp.images.length > 0
        ? resp.images.map((url) =>
            // 如果 url 是完整路径，则无需拼接；否则需要拼接
            url.startsWith('http') ? url : IMAGE_HOST + url
          )
        : []
    houseDetail.value = resp
  }

  const tagList = computed(() => {
    return houseDetail.value.tags
      ? houseDetail.value.tags.map(({ tagCode }) => tagCode)
      : []
  })
  const deviceList = computed(() => {
    return houseDetail.value.devices
      ? houseDetail.value.devices.map(({ deviceCode }) => deviceCode)
      : []
  })
</script>
<script>
  export default {
    name: 'HouseDetailPage'
  }
</script>

<template>
  <section class="bit-app-container houseDetail-page">
    <el-card>
      <template #header>
        <h2 class="title">房源信息</h2>
      </template>
      <el-row>
        <el-col :span="6">
          <span class="key">房源ID</span>
          <span class="value">{{ route.params.houseId }}</span>
        </el-col>
        <el-col :span="6">
          <span class="key">房源名称</span>
          <span class="value">{{ houseDetail.title }}</span>
        </el-col>
        <el-col :span="6">
          <span class="key">房源地址</span>
          <span class="value">
            {{
              houseDetail.cityName +
              '市' +
              houseDetail.regionName +
              houseDetail.communityName +
              houseDetail.detailAddress
            }}
          </span>
        </el-col>
        <el-col :span="6">
          <span class="key">所属小区</span>
          <span class="value">{{ houseDetail.communityName }}</span>
        </el-col>
        <el-col :span="6">
          <span class="key">房源类型</span>
          <span class="value">{{ houseDetail.houseType }}</span>
        </el-col>
        <el-col :span="6">
          <span class="key">居室</span>
          <span class="value">
            {{
              /^\d$/.test(houseDetail.rooms)
                ? houseDetail.rooms + '居'
                : ROOM_NUM_MAP[houseDetail.rooms]
                ? ROOM_NUM_MAP[houseDetail.rooms]
                : '未知'
            }}
          </span>
        </el-col>
        <el-col :span="6">
          <span class="key">面积</span>
          <span class="value">{{ houseDetail.area }}㎡</span>
        </el-col>
        <el-col :span="6">
          <span class="key">朝向</span>
          <span class="value">
            {{ POSITION_LIST_MAP[houseDetail.position] }}
          </span>
        </el-col>
        <el-col :span="6">
          <span class="key">所在楼层</span>
          <span class="value">{{ houseDetail.floor }}</span>
        </el-col>
        <el-col :span="6">
          <span class="key">总楼层</span>
          <span class="value">{{ houseDetail.allFloor }}</span>
        </el-col>
        <el-col :span="6">
          <span class="key">价格</span>
          <span class="value">{{ houseDetail.price }}</span>
        </el-col>
        <el-col :span="6">
          <span class="key">房东昵称</span>
          <span class="value">{{ houseDetail.nickName }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <template #header>
        <h2 class="title">房源介绍</h2>
      </template>
      <p>
        {{ houseDetail.intro }}
      </p>
    </el-card>
    <el-card>
      <template #header>
        <h2 class="title">房源标签</h2>
      </template>
      <el-checkbox-group disabled v-model="tagList">
        <el-checkbox
          v-for="(value, key) in HOUSE_TAG_MAP"
          :key="key"
          :label="value"
          :value="key"
        />
      </el-checkbox-group>
    </el-card>
    <el-card>
      <template #header>
        <h2 class="title">房源设备信息</h2>
      </template>
      <el-checkbox-group disabled v-model="deviceList">
        <el-checkbox
          v-for="(value, key) in DEVICE_LIST_MAP"
          :key="key"
          :label="value"
          :value="key"
        />
      </el-checkbox-group>
    </el-card>
    <el-card>
      <template #header>
        <h2 class="title">房屋图片</h2>
      </template>
      <image-upload
        :disabled="true"
        v-model="houseDetail.images"
        :showTip="false"
      />
    </el-card>
  </section>
</template>

<style lang="scss" scoped>
  .houseDetail-page {
    .el-card {
      padding: 10px;
      margin-bottom: 15px;
    }
    .title {
      font-size: 17px;
      font-weight: 600;
      color: #222;
    }

    .el-row {
      .el-col:nth-child(n + 5) {
        margin-top: 25px;
      }
      .el-col {
        display: flex;
        font-size: 15px;
        .key {
          width: 60px;
          margin-right: 10px;
          text-align: right;
          color: #999;
        }
        .value {
          color: #222;
        }
      }
    }

    .image-uploader {
      width: 134px;
      height: 134px;
      display: block;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
      .el-icon.image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 134px;
        height: 134px;
        text-align: center;
      }
    }

    ::v-deep(.el-checkbox) {
      .el-checkbox__label {
        color: #222;
      }
      .is-checked {
        .el-checkbox__inner {
          background-color: #1890ff;
          border-color: #1890ff;
          &::after {
            border-color: #fff;
          }
        }
      }
    }
  }
</style>
