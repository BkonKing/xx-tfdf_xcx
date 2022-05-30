<template>
  <tf-popup v-model="visible" closeable type="bottom" :isMaskClick="true">
    <view class="tf-p-30">
      <tf-user-info avatar="../../static/login_logo.png" name="美好生活"></tf-user-info>
      <view class="tf-mt-30">
        <view class="tf-text-strong tf-mb-10">获取你的手机号码</view>
        <view class="tf-text-sm tf-text-gray-7">用于登录注册</view>
      </view>
      <view class="tf-flex-row tf-mt-30">
        <button class="tf-flex-1 tf-mr-20" @click="visible = false">
          拒绝
        </button>
        <button
          class="tf-flex-1 tf-btn-primary"
          open-type="getPhoneNumber"
          @getphonenumber="handlePhoneNumber"
        >
          允许
        </button>
      </view>
    </view>
  </tf-popup>
</template>

<script>
import TfUserInfo from '@/components/TfUserInfo/index.vue';
import TfPopup from '@/components/TfPopup/index';
import { getWxMobile } from '@/api/user';

export default {
  name: 'MobileLoginPopup',
  components: {
    TfUserInfo,
    TfPopup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.value
    };
  },
  methods: {
    handlePhoneNumber(e) {
      console.log(e);
      if (e.detail.iv) {
        this.getPhoneNumber(e.detail);
      } else {
        this.visible = false;
      }
    },
    getPhoneNumber(data) {
      var iv = data.iv;
      var encryptedData = data.encryptedData;
      this.$store.dispatch('getWxLoginCode').then(code => {
        getWxMobile({
          xcx_code: code,
          iv,
          encryptedData
        })
          .then(async ({ data, code }) => {
            if (code === '200' && data.access_token) {
              uni.setStorageSync('access_token', data.access_token);
              uni.setStorageSync('refresh_token', data.refresh_token);
              await this.$store.dispatch('getMyAccount');
              await this.$store.dispatch('getHouse');
              this.visible = false;
              this.$emit('success');
            } else {
              uni.showToast({
                title: '获取手机号失败',
                icon: 'none'
              });
            }
          })
          .catch(() => {
            uni.showToast({
              title: '获取手机号失败',
              icon: 'none'
            });
          });
      });
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
