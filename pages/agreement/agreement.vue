<template>
  <view>
    <uni-nav-bar
      :title="title"
      leftWidth="58rpx"
      leftIcon="left"
      statusBar="true"
      :fixed="true"
      :border="false"
      @clickLeft="$router.go(-1)"
    />
    <view class="tf-p-30"><rich-text :nodes="content"></rich-text></view>
  </view>
</template>

<script>
import { getAgreementInfo } from '@/api/user.js';
export default {
  data() {
    return {
      id: '',
      title: '',
      content: ''
    };
  },
  onLoad({id}) {
    this.id = id
    this.getAgreementInfo()
  },
  methods: {
    async getAgreementInfo() {
      const { records } = await getAgreementInfo({
        id: this.id
      });
      this.title = records.title;
      this.content = records.content;
    },
  }
};
</script>

<style></style>
