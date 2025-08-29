<script setup>
  import { reactive, ref } from 'vue'
  import { postArgApi, putArgApi } from '@/api/system'
  import { ElMessage } from 'element-plus'
  const model = defineModel()

  const props = defineProps({
    arg: Object
  })

  const argForm = reactive({
    name: '',
    configKey: '',
    value: '',
    remark: ''
  })

  const argRules = {
    name: [
      {
        required: true,
        message: '请输入参数名称',
        trigger: 'blur'
      },
      {
        pattern: /^[\u4e00-\u9fa5]{2,20}$/,
        message: '参数名称只能由2-20个汉字组成',
        trigger: 'blur'
      }
    ],
    configKey: [
      {
        required: true,
        message: '请输入参数键名',
        trigger: 'blur'
      },
      {
        pattern: /^[a-z_]{2,30}$/,
        message: '参数键名只能由2-30个小写字母或下划线组成',
        trigger: 'blur'
      }
    ],
    value: [
      {
        required: true,
        message: '请输入参数键值',
        trigger: 'blur'
      }
    ]
  }

  const emit = defineEmits(['success', 'close'])
  const argFormRef = ref(null)
  // 确定
  const onConfirm = () => {
    argFormRef.value.validate(async (valid) => {
      if (!valid) return
      if (props.arg) {
        // 调用编辑接口
        await putArgApi(argForm)
        // 成功的提示
        ElMessage.success('编辑成功')
      } else {
        // 调用新增接口
        await postArgApi(argForm)
        // 成功的提示
        ElMessage.success('新增成功')
      }
      // 通知父组件：拉取最新的参数列表
      emit('success')
      // 关闭对话框+重置表单
      onCancel()
    })
  }

  // 取消
  const onCancel = () => {
    emit('close')
    argFormRef.value.resetFields()
    argForm.remark = ''
  }

  // 对话框的打开事件
  const onOpen = () => {
    // 做表单回显
    if (props.arg) {
      Object.keys(props.arg).forEach((key) => {
        argForm[key] = props.arg[key]
      })
    }
  }
</script>
<script>
  export default {
    name: 'ArgOps'
  }
</script>
<template>
  <el-dialog
    :title="`${props.arg ? '编辑' : '新增'}参数`"
    center
    v-model="model"
    @open="onOpen"
    @close="onCancel"
  >
    <!-- 表单：默认插槽 -->
    <el-form
      label-width="120"
      :model="argForm"
      :rules="argRules"
      ref="argFormRef"
    >
      <el-form-item label="参数名称" prop="name">
        <el-input
          placeholder="请输入参数名称"
          v-model.trim="argForm.name"
        />
      </el-form-item>
      <el-form-item label="参数键名" prop="configKey">
        <el-input
          placeholder="请输入参数键名"
          v-model.trim="argForm.configKey"
          :disabled="!!props.arg"
        />
      </el-form-item>
      <el-form-item label="参数键值" prop="value">
        <el-input
          placeholder="请输入参数键值"
          v-model.trim="argForm.value"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          placeholder="请输入备注"
          type="textarea"
          :rows="4"
          maxlength="50"
          show-word-limit
          v-model.trim="argForm.remark"
        />
      </el-form-item>
    </el-form>
    <!-- 操作按钮：footer具名插槽 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped></style>
