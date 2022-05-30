<template>
  <view :class="[bem()]" @touchstart="touchstart">
    <view
      :class="[
        `${PASSWORDINPUT_NAME}__security`,
        { 'van-hairline--surround': !gutter }
      ]"
    >
      <view
        v-for="index in length"
        :key="index"
        class="li"
        :class="[
          { 'van-hairline--left': index !== 0 && !gutter },
          bem('item', { focus: focused && index === value.length })
        ]"
        :style="{ marginLeft: gutter && index !== 0 ? `${gutter}rpx` : 0 }"
      >
        <template v-if="mask">
          <text :style="{ visibility: value[index] ? 'visible' : 'hidden' }" />
        </template>
        <template v-else>
          {{ value[index] }}
        </template>
        <template v-if="focused && index === value.length">
          <view :class="[`${PASSWORDINPUT_NAME}__cursor`]" />
        </template>
      </view>
    </view>
    <template v-if="info">
      <view
        :class="[
          errorInfo
            ? `${PASSWORDINPUT_NAME}__error-info`
            : `${PASSWORDINPUT_NAME}__info`
        ]"
      >
        {{ info }}
      </view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'VanPasswordInput',
  props: {
    info: String,
    gutter: Number,
    focused: Boolean,
    errorInfo: String,
    mask: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    },
    length: {
      type: [Number, String],
      default: 6
    }
  },
  data() {
    return {
      PASSWORDINPUT_NAME: 'van-password-input'
    };
  },
  methods: {
    bem(el, mods) {
      const name = this.PASSWORDINPUT_NAME;
      if (el && typeof el !== 'string') {
        mods = el;
        el = '';
      }

      el = el ? `${name}__${el}` : name;

      return `${el}${this.gen(el, mods)}`;
    },
    gen(name, mods) {
      if (!mods) {
        return '';
      }

      if (typeof mods === 'string') {
        return ` ${name}--${mods}`;
      }

      if (Array.isArray(mods)) {
        return (
          mods.reduce < string > ((ret, item) => ret + this.gen(name, item), '')
        );
      }

      return Object.keys(mods).reduce(
        (ret, key) => ret + (mods[key] ? this.gen(name, key) : ''),
        ''
      );
    },
    touchstart(event) {
      event.stopPropagation();
      this.$emit('focus', event);
    }
  }
};
</script>

<style lang="scss" scoped>
.van-password-input {
  position: relative;
  margin: 0 20rpx;
  user-select: none;

  &__info,
  &__error-info {
    margin-top: 20rpx;
    font-size: 28rpx;
    text-align: center;
  }

  &__info {
    color: $gray-6;
  }

  &__error-info {
    color: $red;
  }

  &__security {
    display: flex;
    width: 100%;
    height: 90rpx;
    cursor: pointer;

    &::after {
      border-radius: 6rpx;
    }

    .li {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 20rpx;
      line-height: 1.2;
      background-color: #f2f2f4;
    }

    text {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10rpx;
      height: 10rpx;
      background-color: $black;
      border-radius: 100%;
      transform: translate(-50%, -50%);
      visibility: hidden;
    }
  }

  &__cursor {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2rpx;
    height: 40%;
    background-color: $text-color;
    transform: translate(-50%, -50%);
    animation: 1s van-cursor-flicker infinite;
  }
}

@keyframes van-cursor-flicker {
  from {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
