<script setup>
  import { reactive, ref, watch } from 'vue';

  import { postOrPutSysUserApi } from '@/api/system';
  import { ElMessage } from 'element-plus';
  import { decryptHex } from '@/utils/aes.js';

  const model = defineModel();

  const props = defineProps({
    sysUser: Object
  });

  console.log(props.sysUser);

  // 账号表单对象
  const accountForm = reactive({
    phoneNumber: '',
    password: '',
    identity: '',
    nickName: '',
    status: 'enable',
    remark: ''
  });
  // 校验规则
  const accountRules = {
    phoneNumber: [
      {
        required: true,
        message: '请输入手机号',
        trigger: 'blur'
      },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: '请输入手机号',
        trigger: 'blur'
      }
    ],
    password: [
      {
        required: !props.sysUser, // 新增时必填，编辑时选填
        message: '请输入密码',
        trigger: 'blur'
      },
      {
        min: 6,
        max: 20,
        message: '密码长度在6-20个字符之间',
        trigger: 'blur'
      }
    ],
    identity: [
      {
        required: true,
        message: '请选择身份',
        trigger: 'change'
      }
    ],
    nickName: [
      {
        required: true,
        message: '请输入昵称',
        trigger: 'blur'
      },
      {
        pattern: /^[a-zA-Z\u4e00-\u9fa5]{2,20}$/,
        message: '昵称只能由字母或汉字组成,长度在2-20之间',
        trigger: 'blur'
      }
    ]
  };

  const accountFormRef = ref(null);

  const emit = defineEmits(['success', 'close']);

  // 确定提交
  const onConfirm = () => {
    // 动态设置密码字段的必填规则
    accountRules.password[0].required = !props.sysUser;
    
    accountFormRef.value.validate(async (valid) => {
      if (!valid) return;
      // 调用接口
      await postOrPutSysUserApi(accountForm);
      // 成功的提示
      ElMessage.success(
        props.sysUser ? '编辑成功' : '新增成功'
      );
      // 通知父组件（重新获取列表）
      emit('success');
      // 重置表单项
      onCancel();
    });
  };

  // 取消
  const onCancel = () => {
    // 关闭对话框
    emit('close');
    // 重置表单
    accountFormRef.value.resetFields();
    accountForm.status = 'enable';
    accountForm.remark = '';
  };

  // 对话框打开回调
  const onOpen = () => {
    // 动态设置密码字段的必填规则
    accountRules.password[0].required = !props.sysUser;
    
    if (props.sysUser) {
      // 回显，把接收到的 sysUser 的属性值依次赋值给 accountForm 的属性
      Object.keys(props.sysUser).forEach((key) => {
        // 密码需要解密后显示
        if (key === 'password' && props.sysUser[key]) {
          try {
            accountForm[key] = decryptHex(props.sysUser[key]);
          } catch (e) {
            // 解密失败时保持为空
            accountForm[key] = '';
          }
        } else {
          accountForm[key] = props.sysUser[key];
        }
      });
    } else {
      // 新增模式下，清空表单
      accountFormRef.value.resetFields();
      accountForm.phoneNumber = '';
      accountForm.password = '';
      accountForm.identity = '';
      accountForm.nickName = '';
      accountForm.status = 'enable';
      accountForm.remark = '';
    }
  };
  
  // 监听 sysUser 变化，确保在模式切换时正确重置表单
  watch(
    () => props.sysUser,
    (newVal) => {
      // 更新密码字段的必填规则
      accountRules.password[0].required = !newVal;
      
      if (!newVal) {
        // 切换到新增模式时，清空表单
        accountFormRef.value.resetFields();
        accountForm.phoneNumber = '';
        accountForm.password = '';
        accountForm.identity = '';
        accountForm.nickName = '';
        accountForm.status = 'enable';
        accountForm.remark = '';
      }
    }
  );
</script>
<script>
  export default {
    name: 'AccountOps'
  }
</script>
<template>
  <el-dialog
    :title="props.sysUser ? '编辑平台账号' : '新增平台账号'"
    center
    v-model="model"
    @open="onOpen"
    @close="onCancel"
  >
    <!-- 主体内容是默认插槽 -->
    <el-form
      ref="accountFormRef"
      label-width="120"
      :model="accountForm"
      :rules="accountRules"
    >
      <el-form-item label="用户手机号" prop="phoneNumber">
        <el-input
          type="number"
          :disabled="!!props.sysUser"
          :placeholder="
            props.sysUser ? '账号不可修改' : '请输入用户手机号'
          "
          v-model="accountForm.phoneNumber"
        />
      </el-form-item>
      <el-form-item
        label="用户密码"
        prop="password"
      >
        <el-input
          type="password"
          show-password
          :placeholder="
            props.sysUser ? '请输入新密码' : '请输入用户密码'
          "
          v-model.trim="accountForm.password"
        />
      </el-form-item>
      <el-form-item label="用户角色" prop="identity">
        <el-select
          v-model="accountForm.identity"
          placeholder="请选择角色"
        >
          <el-option value="super_admin" label="超级管理员" />
          <el-option value="platform_admin" label="平台管理员" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          placeholder="请输入用昵称"
          v-model.trim="accountForm.nickName"
        />
      </el-form-item>
      <el-form-item label="用户状态">
        <el-radio-group v-model="accountForm.status">
          <el-radio value="enable">启用</el-radio>
          <el-radio value="disable">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="accountForm.remark"
          placeholder="请输入备注"
          type="textarea"
          :rows="4"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <!-- 底部内容是具名 footer 插槽 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>