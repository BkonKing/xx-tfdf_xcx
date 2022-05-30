<template>
  <view class="tf-password-input">
    <password-input
      :value="inputValue"
      :info="info"
      :gutter="gutter"
      :errorInfo="errorInfo"
      :focused="showKeyboard"
      @focus="focusPasswordInput"
    />
    <input
      v-model="inputValue"
      type="number"
      :maxlength="length"
      :focus="showKeyboard"
      :style="{ width: 0 }"
      :hold-keyboard="false"
      @blur="handleInputBlur"
    />
  </view>
</template>

<script>
import PasswordInput from '../PasswordInput'
export default {
  components: {
    PasswordInput,
  },
  props: {
    info: String,
    gutter: {
      type: Number,
      default: 10
    },
    errorInfo: String,
    value: {
      type: String,
      default: '',
    },
    length: {
      type: [Number, String],
      default: 6,
    },
  },
  data() {
    return {
      inputValue: this.value,
      showKeyboard: false
    }
  },
  watch: {
    inputValue(newValue) {
      this.$emit('input', newValue)
    },
    value(newValue) {
      if (newValue !== this.inputValue) {
        this.value = newValue
      }
    }
  },
  methods: {
    focusPasswordInput() {
      setTimeout(() => {
        !this.showKeyboard && (this.showKeyboard = true)
      }, 100)
    },
    focus() {
      this.focusPasswordInput()
    },
    handleInputBlur() {
      this.showKeyboard = false
    }
  },
}
</script>

<style></style>
