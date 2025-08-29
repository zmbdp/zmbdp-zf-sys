<template>
  <canvas
    id="canvasDom"
    :width="props.canvasWidth"
    :height="props.canvasHeight"
    @click="drawPic"
  ></canvas>
</template>
<script setup>
  import { onMounted, onBeforeUnmount, computed } from 'vue'
  let props = defineProps({
      canvasWidth: {
        // 容器宽度
        type: Number,
        default: 100
      },
      canvasHeight: {
        // 容器高度
        type: Number,
        default: 40
      },
      refreshTime: {
        //验证码刷新间隔时间
        type: Number,
        default: 120
      }
    }),
    emits = defineEmits(['change']),
    verifyCodeTimeId = null, //定时器id
    randomStr = '0123456789abcdefghijklmnopqrstuvwxyz', // 所有随机字符串
    trueRefreshTime = computed(() => {
      return props.refreshTime * 1000
    }),
    verifyCodeStr = '' //验证码字符串
  onMounted(() => {
    initVerifyCodeImg()
  })
  // 初始化
  const initVerifyCodeImg = () => {
    drawPic()
    verifyCodeTimeId = setInterval(() => {
      drawPic()
    }, trueRefreshTime.value)
  }
  // 绘制验证码图片
  const drawPic = () => {
    randomCode()
    let canvas = document.getElementById('canvasDom')
    let ctx = canvas.getContext('2d')
    ctx.textBaseline = 'bottom'
    // 绘制背景
    ctx.fillStyle = '#e6ecfd'
    ctx.fillRect(0, 0, props.canvasWidth, props.canvasHeight)
    // 绘制文字
    for (let i = 0; i < verifyCodeStr.length; i++) {
      drawText(ctx, verifyCodeStr[i], i)
    }
    drawLine(ctx)
    drawDot(ctx)
  }
  //4个随机字符
  const randomCode = () => {
    verifyCodeStr = ''
    for (let i = 0; i < 4; i++) {
      let txt = randomStr[randomNum(0, randomStr.length)]
      verifyCodeStr += txt
    }
    emits('change', verifyCodeStr)
  }
  // 随机数
  const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  }
  // 随机色
  const randomColor = (min, max) => {
    let r = randomNum(min, max)
    let g = randomNum(min, max)
    let b = randomNum(min, max)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }
  // 绘制文字
  const drawText = (ctx, txt, i) => {
    let fontSizeMin = 30, // 字体最小值
      fontSizeMax = 40 // 字体最大值
    ctx.fillStyle = randomColor(50, 160) // 随机生成字体颜色
    ctx.font = randomNum(fontSizeMin, fontSizeMax) + 'px SimHei' // 随机生成字体大小
    let x = (i + 1) * (props.canvasWidth / (verifyCodeStr.length + 1))
    let y = randomNum(fontSizeMax, props.canvasHeight - 5)
    var deg = randomNum(-30, 30)
    // 修改坐标原点和旋转角度
    ctx.translate(x, y)
    ctx.rotate((deg * Math.PI) / 180)
    ctx.fillText(txt, 0, 0)
    // 恢复坐标原点和旋转角度
    ctx.rotate((-deg * Math.PI) / 180)
    ctx.translate(-x, -y)
  }
  // 绘制干扰线
  const drawLine = (ctx) => {
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = randomColor(100, 200)
      ctx.beginPath()
      ctx.moveTo(
        randomNum(0, props.canvasWidth),
        randomNum(0, props.canvasHeight)
      )
      ctx.lineTo(
        randomNum(0, props.canvasWidth),
        randomNum(0, props.canvasHeight)
      )
      ctx.stroke()
    }
  }
  // 绘制干扰点
  const drawDot = (ctx) => {
    // 绘制干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = randomColor(0, 255)
      ctx.beginPath()
      ctx.arc(
        randomNum(0, props.canvasWidth),
        randomNum(0, props.canvasHeight),
        1,
        0,
        2 * Math.PI
      )
      ctx.fill()
    }
  }
  //暴露绘制图片方法供父组件使用
  defineExpose({
    drawPic
  })
  onBeforeUnmount(() => {
    clearInterval(verifyCodeTimeId) //页面销毁前，需要清除定时器
  })
</script>
<style scoped lang="scss">
  #canvasDom {
    cursor: pointer;
  }
</style>
