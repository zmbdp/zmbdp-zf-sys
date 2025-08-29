<script setup>
  import { reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { postDictDataApi, putDictDataApi } from '@/api/system'
  import { ElMessage } from 'element-plus'
  const route = useRoute()

  const model = defineModel()

  const props = defineProps({
    dictData: Object
  })

  const emit = defineEmits(['success', 'close'])
  // 字典数据表单
  const dictDataForm = reactive({
    typeKey: route.query.typeKey,
    dataKey: '',
    value: '',
    status: 'enable',
    remark: '',
    sort: ''
  })

  const dictDataRules = {
    value: [
      {
        required: true,
        message: '请输入字典名称',
        trigger: 'blur'
      },
      {
        pattern: /^[\u4e00-\u9fa5]{2,20}$/,
        message: '字典名称由2-20个汉字组成',
        trigger: 'blur'
      }
    ],
    dataKey: [
      {
        required: true,
        message: '请输入字典键值',
        trigger: 'blur'
      },
      {
        pattern: /^[a-z_]{2,30}$/,
        message: '字典键值由2-30个字母或下划线组成',
        trigger: 'blur'
      }
    ]
  }

  const dictDataFormRef = ref(null)

  // 确定
  const onConfirm = () => {
    dictDataFormRef.value.validate(async (valid) => {
      if (!valid) return
      if (props.dictData) {
        // 调用编辑接口
        await putDictDataApi(dictDataForm)
        // 成功的提示
        ElMessage.success('编辑成功')
      } else {
        // 调用新增接口
        await postDictDataApi(dictDataForm)
        // 成功的提示
        ElMessage.success('新增成功')
      }
      // 通知父组件：拉取最新的列表数据
      emit('success')
      // 关闭弹出层+重置表单
      onCancel()
    })
  }

  // 取消
  const onCancel = () => {
    emit('close')
    dictDataFormRef.value.resetFields()
    dictDataForm.sort = dictDataForm.remark = ''
  }

  // 监听 Dialog 的打开事件
  const onOpen = () => {
    // 编辑状态下，做回显
    // 回显的原理就是：当 props.dictData 中的每个字段值挨个赋值给 dictDataForm 的字段值
    if (props.dictData) {
      Object.keys(props.dictData).forEach((key) => {
        dictDataForm[key] = props.dictData[key]
      })
    }
  }
</script>
<script>
  export default {
    name: 'DictDataOps'
  }
</script>
<template>
  <el-dialog
    :title="`${props.dictData ? '编辑' : '新增'}字典键值`"
    center
    v-model="model"
    @open="onOpen"
    @close="onCancel"
  >
    <el-form
      label-width="120"
      :model="dictDataForm"
      :rules="dictDataRules"
      ref="dictDataFormRef"
    >
      <el-form-item label="字典名称">
        <el-input :value="route.query.typeKey" disabled />
      </el-form-item>
      <el-form-item label="字典标签" prop="value">
        <el-input
          placeholder="请输入字典标签"
          v-model.trim="dictDataForm.value"
        />
      </el-form-item>
      <el-form-item
        label="字典键值"
        :prop="props.dictData ? '' : 'dataKey'"
      >
        <el-input
          placeholder="请输入字典键值"
          v-model.trim="dictDataForm.dataKey"
          :disabled="!!props.dictData"
        />
      </el-form-item>
      <el-form-item label="显示排序">
        <el-input-number
          controls-position="right"
          :min="1"
          v-model="dictDataForm.sort"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          :rows="4"
          maxlength="50"
          show-word-limit
          placeholder="请输入备注"
          v-model.trim="dictDataForm.remark"
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
