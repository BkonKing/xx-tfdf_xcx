<template>
  <view class="tf-row-justify-between tf-flex-1">
    <view :class="[
        size ? `user-info__left-box-${size}` : 'user-info__left-box',
        { 'user-info__ellipsis': ellipsis }
      ]">
      <image v-if="avatar" class="tf-avatar" :src="avatar" mode="heightFix" />
      <image v-else class="tf-avatar" src="@/static/main/touxiang.png" mode="heightFix" />
      <slot name="left">
        <view class="tf-column-justify-around">
          <view class="user-info--name">{{ name || '暂无昵称' }}</view>
          <view v-if="time" class="user-info-time">{{ time }}</view>
        </view>
      </slot>
    </view>
    <view class="user-info__right-box">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script>
  const stringProp = {
    type: String,
    default: ''
  }
  export default {
    name: 'TfUserInfo',
    props: {
      avatar: stringProp,
      name: stringProp,
      time: stringProp,
      size: {
        type: String,
        default: ''
      },
      ellipsis: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .user-info__ellipsis.user-info__left-box {
    .tf-space-around {
      flex: 1;
      width: 1rpx;

      .user-info--name {
        width: 100%;
        @include text-ellipsis;
      }
    }
  }

  .user-info--name {
    font-size: 30rpx;
    font-weight: 500;
    color: #222;
  }

  .user-info-time {
    font-size: 24rpx;
    color: #8F8F94;
  }

  .user-info__left-box {
    display: flex;
    flex: 1;
    height: 88rpx;

    .tf-avatar {
      width: 88rpx;
      height: 88rpx;
      flex-shrink: 0;
      border-radius: 50%;
      margin-right: 20rpx;
    }
  }

  .user-info__left-box-m {
    display: flex;
    flex: 1;
    height: 66rpx;

    .tf-avatar {
      width: 66rpx;
      height: 66rpx;
      border-radius: 50%;
    }
  }

  .user-info__right-box {
    flex-direction: row;
    align-items: center;
  }
</style>
