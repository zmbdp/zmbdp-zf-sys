<script setup>
  import { HOUSE_STATUS_MAP, RENT_TIME_MAP } from '@/constants'
  import { reactive, ref } from 'vue'
  import { putHouseStatusApi } from '@/api/house'
  import { ElMessage } from 'element-plus'
  const model = defineModel()

  const props = defineProps({
    house: Object
  })
  const emit = defineEmits(['success', 'close'])

  const statusForm = reactive({
    status: '',
    rentTimeCode: ''
  })

  const statusRules = {
    status: [
      {
        required: true,
        message: '请选择房屋状态',
        trigger: 'change'
      }
    ],
    rentTimeCode: [
      {
        required: true,
        message: '请选择房屋租期',
        trigger: 'change'
      }
    ]
  }

  const statusFormRef = ref(null)

  const onComfirm = () => {
    statusFormRef.value.validate(async (valid) => {
      if (!valid) return
      await putHouseStatusApi({
        ...statusForm,
        houseId: props.house.houseId
      })
      ElMessage.success('修改成功')
      // 通知父组件：重新拉取新的房源列表
      emit('success')
      // 关闭对话框+重置表单
      onCancel()
    })
  }

  const onCancel = () => {
    emit('close')
    statusFormRef.value.resetFields()
  }

  const onOpen = () => {
    statusForm.status = props.house.status
    statusForm.rentTimeCode = props.house.rentTimeCode
  }
</script>
<script>
  export default {
    name: 'StatusOps'
  }
</script>

<template>
  <el-dialog
    title="房源状态管理"
    center
    v-model="model"
    @open="onOpen"
    @close="onCancel"
  >
    <el-form
      label-width="120"
      :model="statusForm"
      :rules="statusRules"
      ref="statusFormRef"
    >
      <el-form-item label="房源状态" prop="status">
        <el-select v-model="statusForm.status">
          <el-option
            v-for="(value, key) in HOUSE_STATUS_MAP"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="房源租期" prop="rentTimeCode">
        <el-select v-model="statusForm.rentTimeCode">
          <el-option
            v-for="(value, key) in RENT_TIME_MAP"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onComfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
