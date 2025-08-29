<script setup>
  import { reactive, ref } from 'vue'
  import { postDictTypeApi, putDictTypeApi } from '@/api/system'
  import { ElMessage } from 'element-plus'
  const model = defineModel()
  const props = defineProps({
    dict: Object
  })

  // 字典类型表单
  const dictForm = reactive({
    remark: '',
    value: '',
    typeKey: ''
  })
  const emit = defineEmits(['success', 'close'])
  // 字典类型校验规则
  const dictRules = {
    remark: [
      {
        required: true,
        message: '备注不能为空',
        trigger: 'blur'
      },
      {
        pattern: /^[\u4e00-\u9fa5]{2,50}$/,
        message: '备注只能由2-50个中文组成',
        trigger: 'blur'
      }
    ],
    value: [
      {
        required: true,
        message: '字典名称不能为空',
        trigger: 'blur'
      },
      {
        pattern: /^[\u4e00-\u9fa5]{2,20}$/,
        message: '字典名称只能由2-20个中文组成',
        trigger: 'blur'
      }
    ],
    typeKey: [
      {
        required: true,
        message: '字典类型不能为空',
        trigger: 'blur'
      },
      {
        pattern: /^[a-z_]{2,30}$/,
        message: '字典类型只能由2-30个字母或下划线组成',
        trigger: 'blur'
      }
    ]
  }

  const dictFormRef = ref(null)
  // 确定
  const onConfirm = () => {
    dictFormRef.value.validate(async (valid) => {
      if (!valid) return
      if (props.dict) {
        // 调用编辑接口
        await putDictTypeApi(dictForm)
        // 成功的提示
        ElMessage.success('编辑成功')
      } else {
        // 调用新增接口
        await postDictTypeApi(dictForm)
        // 成功的提示
        ElMessage.success('新增成功')
      }
      // 通知父组件：拉取最新的列表
      emit('success')
      // 关闭对话框+重置表单
      onCancel()
    })
  }

  // 取消
  const onCancel = () => {
    // 关闭对话框
    emit('close')
    // 重置表单(清空表单+移除校验结果)
    dictFormRef.value.resetFields()
  }

  const onOpen = () => {
    // 回显：编辑 props.dict 对象，将其属性值挨个赋值给 dictForm 对应的属性即可
    if (props.dict) {
      Object.keys(props.dict).forEach((key) => {
        dictForm[key] = props.dict[key]
      })
    }
  }
</script>
<script>
  export default {
    name: 'DictTypeOps'
  }
</script>
<template>
  <el-dialog
    :title="`${props.dict ? '编辑' : '新增'}字段类型`"
    center
    v-model="model"
    @open="onOpen"
    @close="onCancel"
  >
    <el-form
      label-width="120"
      :model="dictForm"
      :rules="dictRules"
      ref="dictFormRef"
    >
      <el-form-item label="字典名称" prop="value">
        <el-input
          placeholder="请输入字典名称"
          v-model.trim="dictForm.value"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="typeKey">
        <el-input
          placeholder="请输入字典类型"
          v-model.trim="dictForm.typeKey"
          :disabled="!!props.dict"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          maxlength="50"
          show-word-limit
          :rows="4"
          v-model.trim="dictForm.remark"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
