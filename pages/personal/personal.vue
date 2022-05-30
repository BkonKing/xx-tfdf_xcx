<template>
  <view>
    <image class="bg" src="@/static/bg-1.png" mode="aspectFill"></image>
    <uni-nav-bar
      title="个人信息"
      leftWidth="58rpx"
      leftIcon="left"
      statusBar="true"
      backgroundColor="false"
      :fixed="true"
      :border="false"
      @clickLeft="$router.go(-1)"
    />
    <view class="login-box">
      <image class="avatar" src="@/static/avatar.png" mode="aspectFill"></image>
      <view class="text-1">{{userInfo.realname}}</view>
      <button class="tf-btn" @click="outLogin">退出登录</button>
    </view>
    <view class="tf-row-justify-center">
      <navigator class="link" hover-class="none" url="/pages/agreement/agreement?id=1">《用户协议》</navigator>
      <text style="color: #ccc;"> | </text>
      <navigator class="link" hover-class="none" url="/pages/agreement/agreement?id=2">《隐私政策》</navigator>
    </view>
  </view>
</template>

<script>
  import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() {
    return {};
  },
  methods: {
    outLogin() {
      this.$store.dispatch('outLogin').then(() => {
        this.$router.go(-1)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.bg {
  width: 1200rpx;
  height: 690rpx;
  position: fixed;
  top: -340rpx;
  left: -200rpx;
}
.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 156rpx;
  .avatar {
    width: 120rpx;
    height: 120rpx;
    background: #F7F7F7;
    border-radius: 50%;
  }
  .text-1 {
    margin-top: 60rpx;
    margin-bottom: 60rpx;
    font-size: 48rpx;
    color: #222;
  }
  .tf-btn {
    width: 280rpx;
    height: 88rpx;
    line-height: 88rpx;
    background: #ef41411a;
    color: #EF4141;
    border-radius: 44rpx;
  }
}
.tf-row-justify-center {
  width: 100%;
  position: fixed;
  bottom: 60rpx;
  .link {
    font-size: 26rpx;
    color: #222;
  }
}
</style>
