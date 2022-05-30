<template>
  <view class="login-page">
    <image class="bg" src="@/static/bg-3.png" mode="aspectFill"></image>
    <uni-icons
      type="left"
      size="20"
      color="#000"
      class="uni-icon-left"
      @click="goBack"
    ></uni-icons>
    <view class="form-box">
      <view class="text-1">手机快捷登录</view>
      <input
        v-model="mobile"
        class="form-input"
        placeholder-class="login-input-placeholder"
        maxlength="11"
        type="digit"
        placeholder="手机号"
      />
      <view class="code-cell tf-mb-30">
        <input
          v-model="yzm"
          key="code"
          class="form-input tf-flex-1"
          placeholder-class="login-input-placeholder"
          maxlength="4"
          type="digit"
          placeholder="验证码"
        />
        <button
          class="query-code-btn"
          :class="{ 'code-count-down': codeStatus }"
          :disabled="codeStatus"
          @click="verifCode"
        >
          <count-down
            v-if="codeStatus"
            :time="countDownTime"
            @finish="countFinish"
          >
            {{ countString }}s
          </count-down>
          <text v-else>获取</text>
        </button>
      </view>
      <view class="tf-row-items-center">
        <checkbox-group @change="handleChange">
          <label class="tf-checkbox">
            <checkbox value="1" color="#fff" @change="handleChange" />
            我已阅读并同意
          </label>
        </checkbox-group>
        <navigator class="tf-text-sm" hover-class="none" url="/pages/agreement/agreement?id=1">
          《用户协议》
        </navigator>
        <navigator class="tf-text-sm" hover-class="none" url="/pages/agreement/agreement?id=2">
          《隐私政策》
        </navigator>
      </view>
    </view>
    <button class="tf-btn-primary" :disabled="disabled" @click="handleLogin">
      登录
    </button>
  </view>
</template>

<script>
import CountDown from './components/CountDown';
import { getYzmCode, yzmLogin } from '@/api/user.js';
export default {
  components: {
    CountDown
  },
  data() {
    return {
      codeStatus: false,
      mobile: '',
      yzm: '',
      agreement: false,
      countDownTime: 60
    };
  },
  computed: {
    secondString() {
      return this.formatNum(this.second);
    },
    disabled() {
      return this.mobile.length !== 11 || !this.yzm || !this.agreement;
    }
  },
  methods: {
    async verifCode() {
      if (this.mobile.length === 11) {
        const { code } = await getYzmCode({
          mobile: this.mobile
        });
        if (code === 200) {
          this.codeStatus = true;
        }
      } else {
        uni.showToast({
          title: '请输入正确手机号',
          icon: 'none',
          duration: 2000
        });
      }
    },
    // 倒计时结束
    countFinish() {
      this.countDownTime = 60;
      this.codeStatus = false;
    },
    formatNum(num) {
      return num < 10 ? '0' + num : '' + num;
    },
    handleChange({ detail }) {
      this.agreement = detail.value.length;
    },
    async handleLogin() {
      if (this.mobile.length !== 11) {
        uni.showToast({
          title: '请输入正确手机号',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (!this.yzm.length) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (!this.agreement) {
        uni.showToast({
          title: '请勾选',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      const {code, oauthToken} = await yzmLogin({
        mobile: this.mobile,
        yzmCode: this.yzm
      })
      if (code === 200) {
        uni.setStorageSync('access_token', oauthToken);
        this.$store.dispatch('getMyAccount');
        uni.switchTab({
          url: '/pages/tabBar/home/home'
        });
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
}
.uni-icon-left {
  position: fixed;
  left: 20rpx;
  top: 60rpx;
  z-index: 1000;
}
.bg {
  width: 790rpx;
  height: 689rpx;
  position: fixed;
  top: -180px;
  left: -68px;
  z-index: 999;
}
.form-box {
  padding: 400rpx 110rpx 30rpx;
}
.text-1 {
  font-size: 40rpx;
  font-weight: bold;
  color: #222222;
}
.code-cell {
  display: flex;
  width: 100%;
  border-bottom: 1rpx solid #cccccc;
}
.form-input {
  align-items: center;
  width: 100%;
  height: 72rpx;
  margin-top: 40rpx;
  border: none;
  border-bottom: 1rpx solid #cccccc;
  font-size: 32rpx;
  &.tf-flex-1 {
    border-bottom: 0;
  }
}
.query-code-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 0 20rpx;
  margin-top: 40rpx;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 32rpx;
  background-color: #fff !important;
  color: #2d4ef6 !important;
}

.tf-checkbox {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  ::v-deep .wx-checkbox-input {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    &.wx-checkbox-input-checked {
      background: #ef4141;
      border-color: #ef4141;
    }
  }
  ::v-deep .van-checkbox__icon--checked .van-icon {
    color: #fff;
    background: #ef4141;
    border-color: #ef4141;
  }

  ::v-deep .van-checkbox__icon {
    height: 28rpx;
    line-height: 28rpx;

    .van-icon {
      width: 28rpx;
      height: 28rpx;
      line-height: 28rpx;
    }
  }
}
.tf-btn-primary {
  width: 530rpx;
  height: 88rpx;
  margin-top: 100rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
}
</style>

<style>
.login-input-placeholder {
  font-size: 32rpx;
  color: #999999;
}
</style>
