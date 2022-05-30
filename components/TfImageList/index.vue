<template>
  <view class="tf-image-grid">
    <uni-grid :square="square" :showBorder="false" :column="column">
      <uni-grid-item
        v-for="(img, i) in list"
        :key="i"
        :index="index"
        :highlight="false"
      >
        <view class="tf-grid-image-item">
          <image
            v-if="mode === 'show'"
            class="tf-image-item"
            mode="aspectFill"
            :src="img"
            @click="handlePreview(i)"
          />
          <template v-else>
            <image
              class="tf-image-item"
              mode="aspectFill"
              :src="srcKey ? img[srcKey] : img"
              @click="handleClick(img, i)"
            />
            <view
              v-if="data.length > 3 && i === 2"
              class="tf-image--shade"
              @click="handleClick(img, 2)"
            >
              <text>+{{ data.length - 3 }}</text>
            </view>
          </template>
        </view>
      </uni-grid-item>
    </uni-grid>
  </view>
</template>

<script>
import { previewImage } from '@/utils/util';

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'list'
    },
    column: {
      type: Number,
      default: 3
    },
    square: {
      type: Boolean,
      default: true
    },
    srcKey: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(data, index) {
      if (this.mode === 'shadeShow') {
        this.handlePreview(index);
      }
      this.$emit('click', data);
    },
    handlePreview(current) {
      uni.previewImage({
        urls: this.data,
        current
      });
    }
  },
  computed: {
    list() {
      if (this.mode !== 'show') {
        const len = this.data.length;
        return len > 3 ? this.data.slice(0, 3) : this.data;
      }
      return this.data;
    }
  }
};
</script>

<style lang="scss" scoped>
.tf-image-grid {
  width: calc(100% + 24rpx);
}
.tf-grid-image-item {
  width: 100%;
  height: 100%;
  padding-right: 20rpx;
  padding-bottom: 20rpx;
}
.tf-image-item {
  width: 100%;
  height: 100%;
}
.tf-image--shade {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #000000;
  opacity: 0.6;
  top: 0;
  left: 0;
  text-align: center;
  color: #fff;
  font-size: 54rpx;
}
</style>
