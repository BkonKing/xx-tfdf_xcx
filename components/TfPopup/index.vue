<template>
  <uni-popup
    ref="popup"
    :type="type"
    :animation="animation"
    :isMaskClick="isMaskClick"
    :backgroundColor="backgroundColor"
    :maskBackgroundColor="maskBackgroundColor"
    @change="handleChange"
  >
    <slot></slot>
  </uni-popup>
</template>

<script>
export default {
  name: 'TfPopup',
  options: { styleIsolation: 'shared' },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'center'
    },
    animation: {
      type: Boolean,
      default: true
    },
    isMaskClick: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    maskBackgroundColor: {
      type: String,
      default: 'rgba(0,0,0,0.4)'
    }
  },
  data() {
    return {
      visible: this.value
    };
  },
  mounted() {
    this.visible && this.operate(this.visible);
  },
  methods: {
    handleChange({ show }) {
      this.visible = show;
      this.$emit('change', show);
    },
    operate(val) {
      if (val) {
        this.open();
      } else {
        this.close();
      }
    },
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    }
  },
  watch: {
    value(val) {
      if (this.visible !== val) {
        this.visible = val;
      }
    },
    visible(val) {
      this.$emit('input', val);
      this.operate(val);
    }
  }
};
</script>

<style lang="scss">
::v-deep .uni-popup .uni-popup__wrapper {
  border-radius: 10rpx;
}
</style>
