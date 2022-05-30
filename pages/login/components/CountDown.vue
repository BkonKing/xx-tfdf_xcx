<template>
  <span>{{ secondString }}s</span>
</template>

<script>
export default {
  props: {
    time: {
      type: [String, Number],
      default: 0
    },
    // 延迟时间（多久执行一次的时间）
    delay: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      second: '',
      countDowmTotal: 0, // 倒计时总时长 ms
      countDowmTimer: '',
      // 公共
      lastTime: 0, // 上一次开始执行时间
      first: true
    }
  },
  mounted () {
    if (this.time > 0) {
      this.countDowmTotal = this.time * 1000
      this.countDowm()
    }
  },
  methods: {
    // 倒计时
    countDowm () {
      this.countDowmTimer && clearTimeout(this.countDowmTimer)
      const deviation = this.getDeviation()
      // 减少倒计时总时长，可以在这里减去偏差值，这偏差值不用判断
      const residue = this.countDowmTotal - this.delay
      this.countDowmTotal = residue > 0 ? residue : 0 // 毫秒
      this.second = Math.floor(this.countDowmTotal / 1000)
      if (this.countDowmTotal) {
        this.countDowmTimer = setTimeout(() => {
          this.countDowm()
        }, this.delay - deviation)
      } else {
        // 倒计时结束，开启计时器
        this.$emit('finish', true)
        clearTimeout(this.countDowmTimer)
      }
    },
    // 获取两次执行间隔跟delay的偏差值
    getDeviation () {
      let deviation = 0 // 偏差值
      const start = new Date().getTime()
      if (!this.first) {
        const pcTime = start - this.lastTime - this.delay
        deviation = pcTime > 0 ? pcTime : 0
      }
      this.lastTime = start
      this.first = false
      return deviation
    },
    // 补0
    formatNum (num) {
      return num < 10 ? '0' + num : '' + num
    }
  },
  computed: {
    secondString () {
      return this.formatNum(this.second)
    }
  },
  beforeDestroy () {
    this.countDowmTimer && clearTimeout(this.countDowmTimer)
  }
}
</script>
