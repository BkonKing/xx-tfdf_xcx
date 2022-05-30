<template>
  <view class="radio-btn-group">
    <view
      class="radio-btn__item"
      v-for="(item, i) in data"
      :key="i"
      :class="{'radio-btn--active': multiple ? valueChild.indexOf(item[valueKey]) !== -1 : valueChild == item[valueKey]}"
      @click="change(item[valueKey], item[labelKey])"
    >
      <view class="radio-btn__text">{{item[labelKey]}}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      valueChild: this.value
    }
  },
  methods: {
    change (value, label) {
      if (this.multiple) {
        const index = this.valueChild.indexOf(value)
        if (index === -1) {
          this.valueChild.push(value)
        } else {
          this.valueChild.splice(index, 1)
        }
      } else {
        this.valueChild = value
      }
      this.$emit('change', this.valueChild, label)
    }
  },
  watch: {
    valueChild (value) {
      this.$emit('input', value)
    },
    value (value) {
      this.valueChild = value
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-btn-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.radio-btn__item {
  height: 88rpx;
  padding: 0 20rpx;
  background-color: #F7F7F7;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 6rpx;
}
.radio-btn__text {
  font-size: 28rpx;
  color: #666;
  line-height: 88rpx;
}
.radio-btn--active {
  background-color: #EF41411a;
  .radio-btn__text {
    color: #EF4141;
  }
}
</style>
