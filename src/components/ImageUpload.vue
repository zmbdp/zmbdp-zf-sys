<script setup>
  import { ElMessage } from 'element-plus'
  import { computed, ref } from 'vue'
  import { postImageUploadApi } from '@/api/user'
  const model = defineModel({
    type: [Array, String]
  })

  const props = defineProps({
    // 图片大小
    fileSize: {
      type: Number,
      default: 5
    },
    // 图片类型(格式)
    fileType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg']
    },
    // 允许上传的最大图片张数
    limit: {
      type: Number,
      default: 5
    },
    // 控制提示语显示
    showTip: {
      type: Boolean,
      default: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  })
  // 展示的图片列表
  const fileList = computed(() => {
    if (!model.value || model.value.length === 0) return []
    return Array.isArray(model.value)
      ? model.value.map((url, i) => ({
          name: 'image-' + (i + 1),
          url
        }))
      : [{ name: 'image-1', url: model.value }]
  })

  // 上传前的校验钩子(函数)
  const onBeforeUpload = (file) => {
    // file单个文件对象
    const { name, size } = file
    // 获取当前文件的扩展名
    const suffix = name.slice(name.lastIndexOf('.') + 1)
    // 判断是否是图片
    const isImg = props.fileType.includes(suffix)
    if (!isImg) {
      ElMessage.error(`请上传 ${props.fileType.join('/')} 类型的图片`)
      // 不通过
      return false
    }
    // 判断图片大小
    const isGt5M = size > props.fileSize * 1024 * 1024
    if (isGt5M) {
      ElMessage.error(`请上传不超过 ${props.fileSize}MB 大小的图片`)
      // 不通过
      return false
    }
    // 通过
    return true
  }

  // 超过图片张数限制的钩子
  const onExceed = () => {
    ElMessage.warning(
      `当前允许最大上传${props.limit}张,已经上传了${
        fileList.value.length
      }张,还能上传${props.limit - fileList.value.length}张`
    )
  }

  const onHttpUpload = async ({ file }) => {
    // file: 用户选择的图片文件对象

    // 创建 FormData 实例
    const formData = new FormData()
    // 添加后端需要的参数
    formData.append('file', file)
    // 调用上传接口
    const resp = await postImageUploadApi(formData)
    // 拿到后端响应的 url 图片路径，需要将这个路径同步到 fileList 数组中
    // 而 fileList 数组又是基于 model 计算得到的，因此只要把 url 同步给
    // model 即可。当 model 变了，fileList 计算属性会重新计算
    if (Array.isArray(model.value)) {
      model.value.push(resp.url)
    } else {
      model.value = resp.url
    }
  }

  // 删除图片
  const onRemove = (file) => {
    // console.log(file, fileList)
    // file: 当前点击的图片文件对象

    // 获取当前点击图片文件对象的在数组中的下标
    const index = fileList.value.findIndex(
      (item) => item.uid === file.uid
    )
    // 从 model 中删除即可
    if (Array.isArray(model.value)) {
      model.value.splice(index, 1)
    } else {
      model.value = ''
    }
  }

  const visible = ref(false)
  const previewImageUrl = ref('')
  // 箭头函数
  const onPreview = (file) => {
    // 打开对话框
    visible.value = true
    // 将当前点击的图片路径赋值给预览图片路径
    previewImageUrl.value = file.url
  }
</script>
<script>
  export default {
    name: 'ImageUpload'
  }
</script>
<template>
  <section class="bit-image-upload">
    <el-upload
      :disabled="props.disabled"
      class="image-uploader"
      :class="{ hidePictureCard: fileList.length >= props.limit }"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="onBeforeUpload"
      :limit="props.limit"
      :multiple="props.limit >= 2"
      :on-exceed="onExceed"
      :http-request="onHttpUpload"
      :on-remove="onRemove"
      :on-preview="onPreview"
    >
      <el-icon class="image-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <p class="upload-tip" v-if="props.showTip">
      请上传大小不超过
      <b>{{ props.fileSize }}MB</b>
      格式为
      <b>{{ props.fileType.join('/') }}</b>
      的文件
    </p>

    <el-dialog title="图片预览" v-model="visible" center>
      <img
        v-if="previewImageUrl"
        :src="previewImageUrl"
        alt="Preview Image"
        width="80%"
      />
    </el-dialog>
  </section>
</template>

<style lang="scss" scoped>
  .bit-image-upload {
    .image-uploader {
      width: 134px;
      height: 134px;
      display: block;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
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
    .upload-tip {
      margin-top: 15px;
      font-size: 12px;
      color: #222;
      b {
        color: rgb(245, 108, 108);
      }
    }

    ::v-deep(.image-uploader) {
      .el-upload-list {
        display: flex;
        width: 100vw;
      }
    }
    ::v-deep(.hidePictureCard) {
      .el-upload--picture-card {
        display: none;
      }
    }
    ::v-deep(.el-dialog) {
      .el-dialog__body {
        text-align: center;
      }
    }
  }
</style>
