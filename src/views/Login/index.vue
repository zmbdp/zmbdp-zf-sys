<script setup>
  import VerifyCodeImg from './components/VerifyCodeImg.vue';
  import { reactive, ref } from 'vue';

  import { encryptHex, decryptHex } from '@/utils/aes.js';

  import { useUserStore } from '@/stores';
  import { ElMessage } from 'element-plus';
  import { useRouter, useRoute } from 'vue-router';
  import Cookies from 'js-cookie';
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  const ZMBDP_PHONE = 'zmbdp-phone';
  const ZMBDP_PASSWORD = 'zmbdp-password';
  const ZMBDP_REMEMBER = 'zmbdp-remember';

  // 登录表单
  const loginForm = reactive({
    phone: Cookies.get(ZMBDP_PHONE) || '', //手机号
    password:
      Cookies.get(ZMBDP_PASSWORD) === undefined
        ? ''
        : decryptHex(Cookies.get(ZMBDP_PASSWORD)), // 密码
    code: '' // 验证码
  });

  // 保存验证码的实际值
  let verifyCode = null;

  const getVerifyCode = (code) => {
    verifyCode = code;
  };

  const validateCode = (rule, value, callback) => {
    /**
     * rule: 校验规则对象
     * value：当前校验字段的值
     * callback：回调函数，校验通过了，不用传参数；否则传入 new Error('错误原因')
     */
    if (value === verifyCode) {
      callback();
    } else {
      callback(new Error('验证码不正确'));
    }
  };
  // 校验规则
  const loginRules = {
    phone: [
      {
        required: true,
        message: '手机号不能为空',
        trigger: 'blur'
      },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: '手机号格式错误',
        trigger: 'blur'
      }
    ],
    password: [
      {
        required: true,
        message: '密码不能为空',
        trigger: 'blur'
      },
      {
        min: 6,
        max: 20,
        message: '密码长度在6-20个字符之间',
        trigger: 'blur'
      }
    ],
    code: [
      {
        required: true,
        message: '验证码不能为空',
        trigger: 'blur'
      },
      {
        min: 4,
        max: 4,
        message: '验证码的长度必须是4位',
        trigger: 'blur'
      },
      {
        validator: validateCode,
        trigger: 'blur'
      }
    ]
  };
  const loginFormRef = ref(null);

  const verifyCodeImgRef = ref(null);

  // 是否记住密码
  const isRemember = ref(!!Cookies.get(ZMBDP_REMEMBER));

  // 控制登录按钮的加载状态
  const loading = ref(false);
  // 登录
  const onLogin = () => {
    loginFormRef.value.validate(async (valid) => {
      if (!valid) return;

      // 记住密码
      if (isRemember.value) {
        // 存储
        Cookies.set(ZMBDP_PHONE, loginForm.phone, {
          expires: 30
        });
        Cookies.set(
          ZMBDP_PASSWORD,
          encryptHex(loginForm.password),
          {
            expires: 30
          }
        );
        Cookies.set(ZMBDP_REMEMBER, true, {
          expires: 30
        });
      } else {
        // 清除
        Cookies.remove(ZMBDP_PHONE);
        Cookies.remove(ZMBDP_PASSWORD);
        Cookies.remove(ZMBDP_REMEMBER);
      }

      try {
        // 请求前：开启按钮的加载状态
        loading.value = true;
        // 管理token
        await userStore.loginAction({
          phone: loginForm.phone,
          password: encryptHex(loginForm.password)
        });
        userStore.getUserInfoAction();

        // 成功的提示
        ElMessage.success('登录成功');
        // 优先跳转至参数的携带的回跳地址；否则去到主页默认的用户管理
        router.push(route.query.redirectUrl || '/user');
      } catch (e) {
        // 刷新验证码: 调用子组件的方法
        verifyCodeImgRef.value.drawPic();
      } finally {
        // 请求结束（成功或失败）：关闭按钮的加载状态
        loading.value = false;
      }
    });
  };
</script>
<script>
  export default {
    name: 'LoginPage'
  };
</script>

<template>
  <section class="login-page">
    <div class="container">
      <img
        src="@/assets/images/logo.png"
        alt="logo"
        width="80"
        height="80"
      />
      <h1 class="title">Hello，欢迎登录稚名不带撇通用脚手架</h1>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
      >
        <el-form-item prop="phone">
          <el-input
            placeholder="请输入手机号"
            v-model="loginForm.phone"
            maxlength="11"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="loginForm.password"
            clearable
            show-password
            maxlength="20"
          />
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
            style="width: 224px; margin-right: 7px"
            clearable
            maxlength="4"
            @change="onLogin"
          />
          <VerifyCodeImg
            @change="getVerifyCode"
            ref="verifyCodeImgRef"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="isRemember">
            记住密码
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            class="btn-login"
            @click="onLogin"
            :loading="loading"
          >
            {{ loading ? '登录中...' : '点击登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: url(@/assets/images/login-background.jpg);
    background-size: cover;
    .container {
      box-sizing: border-box;
      width: 397px;
      height: 520px;
      padding: 40px 33px 53px;
      border-radius: 30px;
      background-color: #fff;
      .title {
        margin: 27px 0;
        font-size: 22px;
        font-weight: 600;
        color: #222;
      }
      ::v-deep(.el-input) {
        .el-input__wrapper {
          background-color: #f4f5f9;
          border-radius: 20px;
          .el-input__inner::placeholder {
            color: #999;
            font-size: 12px;
          }
        }
      }
      ::v-deep(.el-checkbox) {
        .el-checkbox__inner {
          border-radius: 50%;
        }
        .el-checkbox__label {
          font-size: 12px;
          color: #999;
        }
      }
      .btn-login {
        width: 331px;
        height: 40px;
        font-size: 12px;
        background-image: linear-gradient(
          to right,
          #22cfff,
          #0fa1fe
        );
        color: #fff;
        border-radius: 20px;
      }
      #canvasDom {
        cursor: pointer;
        border-radius: 12px;
        background-color: #f4f5f9;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>
