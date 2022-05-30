<template>
  <view>
    <uni-nav-bar
      title="预约选房"
      leftWidth="58rpx"
      leftIcon="left"
      statusBar="true"
      backgroundColor="false"
      :fixed="true"
      :border="false"
      @clickLeft="$router.go(-1)"
    />
    <image class="bg" src="@/static/bg-2.png" mode="aspectFill"></image>
    <view class="tf-p-30">
      <view class="card">
        <view class="title">
          意向楼盘
          <text class="tf-text-primary">*</text>
        </view>
        <picker
          range-key="projectName"
          :value="projectIndex"
          :range="projectOptions"
          @change="bindPickerChange"
        >
          <view class="select tf-mt-20 tf-mb-20">
            <text>
              {{ projectOptions[projectIndex].projectName || '请选择' }}
            </text>
            <uni-icons type="bottom"></uni-icons>
          </view>
        </picker>
        <view v-if="houseOptions && houseOptions.length" class="title tf-mt-40">
          意向户型
        </view>
        <view v-if="houseOptions && houseOptions.length" class="tf-mt-20">
          <tf-radio-btn
            v-model="houseIds"
            label-key="houseName"
            value-key="id"
            :data="houseOptions"
            :multiple="true"
          ></tf-radio-btn>
        </view>
      </view>
      <view class="card tf-mt-20">
        <view class="title">
          预约人姓名
          <text class="tf-text-primary">*</text>
        </view>
        <view class="tf-mt-20 tf-mb-60">
          <input v-model="realName" class="input" maxlength="10" />
        </view>
        <view class="title">
          联系电话
          <text class="tf-text-primary">*</text>
        </view>
        <view class="tf-mt-20 tf-mb-60">
          <input v-model="mobile" class="input" maxlength="11" type="number" />
        </view>
        <view class="title">
          预约时间
          <text class="tf-text-primary">*</text>
        </view>
        <view class="tf-mt-20 tf-mb-60">
          <uni-datetime-picker
            v-model="yyTime"
            type="datetime"
            :start="minDate"
            :hide-second="true"
            @change="handleDateChange"
          />
        </view>
        <view class="title">其他说明</view>
        <view class="tf-mt-20 tf-mb-20">
          <input v-model="explain" class="input" maxlength="100" />
        </view>
      </view>
      <view class="fixed-placeholder">
        <view class="fixed-box">
          <view class="tf-text-sm">预约成功后，工作人员会联系您</view>
          <button class="fixed-btn tf-btn-primary" @click="submit">提交</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAllProject, getAllHouse, addIntention } from '@/api/user.js';
import TfRadioBtn from '@/components/TfRadioBtn';
import { mapGetters } from 'vuex';
export default {
  components: {
    TfRadioBtn
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() {
    return {
      projectId: '',
      projectOptions: [],
      houseOptions: [],
      minDate: new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000,
      realName: '',
      mobile: '',
      yyTime: '',
      explain: '',
      houseIds: [],
      projectIndex: ''
    };
  },
  onLoad({ projectId }) {
    this.projectId = projectId || '';
    this.getAllProject();
    if (this.userInfo.realname) {
      this.realName = this.userInfo.realname;
    }
    if (this.userInfo.mobile) {
      this.mobile = this.userInfo.mobile;
    }
  },
  methods: {
    async getAllProject() {
      const { records } = await getAllProject();
      this.projectOptions = records || [];
      if (records?.length && this.projectId) {
        const index = records.findIndex(obj => obj.id === +this.projectId);
        this.projectIndex = index;
        this.getAllHouse();
      }
    },
    bindPickerChange({ detail }) {
      const value = detail.value;
      this.projectIndex = value;
      this.houseIds = [];
      this.getAllHouse();
    },
    handleDateChange(value) {
      const time = new Date(value.replace(/-/g, '/')).getTime();
      console.log(time);
      if (time < this.minDate) {
        this.$nextTick(() => {
          this.yyTime = '';
        });
      }
    },
    async getAllHouse() {
      const { records } = await getAllHouse({
        projectId: this.projectOptions[this.projectIndex].id
      });
      this.houseOptions = records || [];
    },
    submit() {
      if (this.projectIndex === '' || this.projectIndex < 0) {
        uni.showToast({
          title: '请选择意向户型',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (!this.realName) {
        uni.showToast({
          title: '请填写姓名',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (!this.mobile) {
        uni.showToast({
          title: '请填写联系电话',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (!this.yyTime) {
        uni.showToast({
          title: '请选择预约时间',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      this.addIntention();
    },
    async addIntention() {
      const projectId = this.projectOptions[this.projectIndex].id;
      const { code } = await addIntention({
        projectId,
        houseIds: this.houseIds.join(','),
        realName: this.realName,
        mobile: this.mobile,
        yyTime: this.yyTime,
        explain: this.explain
      });
      if (code === 200) {
        uni.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 2000
        });
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  width: 1040rpx;
  height: 500rpx;
  position: fixed;
  top: -160px;
  left: -68px;
  z-index: 2;
}
.card {
  padding: 40rpx 30rpx 20rpx;
  background: #ffffff;
  border-radius: 20rpx;
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #000000;
  }
  .select {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 80rpx;
    padding: 20rpx;
    background: #ffffff;
    border-radius: 10rpx;
    border: 1px solid #cccccc;
  }
  .input {
    height: 60rpx;
    // padding: 10rpx 0;
    margin-top: 20rpx;
    font-size: 28rpx;
    border-bottom: 1px solid #cccccc;
  }
}
.tf-mb-60 {
  margin-bottom: 60rpx;
}
.tf-mt-40 {
  margin-top: 40rpx;
}
.fixed-placeholder {
  height: calc(158rpx + env(safe-area-inset-bottom));
  height: calc(158rpx + constant(safe-area-inset-bottom));
}
.fixed-box {
  position: fixed;
  z-index: 9;
  bottom: env(safe-area-inset-bottom);
  bottom: constant(safe-area-inset-bottom);
  left: 30rpx;
  right: 30rpx;
  padding-bottom: 30rpx;
  background-color: #f7f7f7;
  .tf-text-sm {
    display: flex;
    justify-content: center;
    padding: 20rpx 0;
  }
}

.fixed-btn {
  width: 690rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
}
</style>

<style>
page {
  background-color: #f7f7f7;
}
</style>
