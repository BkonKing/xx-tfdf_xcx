<template>
  <view>
    <image class="bg" src="@/static/bg-1.png" mode="aspectFill"></image>
    <uni-nav-bar
      statusBar="true"
      backgroundColor="#ffff"
      :fixed="true"
      :border="false"
    />
    <view v-if="!userInfo.id" class="login-box" @click="goLogin">
      <image class="avatar" src="@/static/avatar.png" mode="aspectFill"></image>
      <view class="text-1">登录后可体验更多服务</view>
      <button class="tf-btn-primary">登录/注册</button>
    </view>
    <view v-else style="position: relative;z-index: 1000;">
      <view class="user-info" @click="goPersonal">
        <image
          class="user-avatar"
          src="@/static/avatar.png"
          mode="aspectFill"
        ></image>
        <view class="tf-row-items-center" style="position: relative;">
          <view class="user-nickname">{{ userMobile }}</view>
          <image class="border-image" src="@/static/border.png"></image>
        </view>
      </view>
      <view v-if="listData && listData.length" class="card-list">
        <view
          v-for="(item, index) in listData"
          class="card"
          :key="index"
          :class="{ 'card-gray': item.status !== 1 }"
        >
          <view class="tf-row-justify-between">
            <view class="tf-row-items-center">
              <view class="tag" :class="{ 'tag-gray': item.status !== 1 }">
                {{ item.statusv }}
              </view>
              <text class="text-3 tf-ml-20">{{ item.yytime }}</text>
            </view>
            <button
              v-if="item.status === 1"
              class="btn"
              @click="handleCancel(item)"
            >
              取消预约
            </button>
          </view>
          <view class="text-4 tf-mt-30">
            {{ item.project }} {{ item.house ? `(${item.house})` : '' }}
          </view>
          <view class="text-4 tf-mt-10">
            {{ item.realname ? `${item.realname}，` : '' }}{{ item.mobile
            }}{{ item.explain ? `，${item.explain}` : '' }}
          </view>
        </view>
      </view>
      <view v-else class="empty-box">
        <image class="empty-image" src="@/static/empty-1.png"></image>
        <view class="tf-mt-30">还没有预约~</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getIntentionList, updateIntentionStatus } from '@/api/user.js';
import { mapGetters } from 'vuex';
import ListMixins from '@/mixins/list.js';
export default {
  mixins: [ListMixins],
  computed: {
    ...mapGetters(['userInfo', 'userMobile'])
  },
  data() {
    return {};
  },
  onShow() {
    if (uni.getStorageSync('access_token')) {
      this.$store.dispatch('getMyAccount').then(() => {
        this.refreshLoad();
      });
    }
  },
  methods: {
    getListData() {
      if (!this.userInfo?.id) {
        return Promise.reject();
      }
      return getIntentionList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.infoShowPermissions = +res.infoShowPermissions;
        return res;
      });
    },
    handleCancel(data) {
      uni.showModal({
        title: '取消预约',
        content: '确定取消预约吗',
        confirmText: '确 定',
        cancelText: '我再想想',
        success: res => {
          if (res.confirm) {
            this.updateIntentionStatus(data);
          } else if (res.cancel) {
          }
        }
      });
    },
    async updateIntentionStatus(data) {
      const { id } = data;
      const { code } = await updateIntentionStatus({
        id,
        status: 2
      });
      if (code === 200) {
        uni.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
        });
        data.status = 2;
        data.statusv = '已取消';
      }
    },
    goLogin() {
      this.$router.push({
        path: '/pages/login/login'
      });
    },
    goPersonal() {
      this.$router.push({
        path: '/pages/personal/personal'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  width: 1200rpx;
  height: 690rpx;
  position: fixed;
  top: -340rpx;
  left: -200rpx;
  z-index: 999;
}
.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 300rpx;
  position: relative;
  z-index: 1000;
  .avatar {
    width: 160rpx;
    height: 160rpx;
    background: #f7f7f7;
    border-radius: 50%;
  }
  .text-1 {
    margin-top: 40rpx;
    margin-bottom: 40rpx;
    color: #222;
  }
  .tf-btn-primary {
    width: 280rpx;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
  }
}
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60rpx 0 30rpx;
  margin-top: 42rpx;
  .user-avatar {
    width: 120rpx;
    height: 120rpx;
    background: #f7f7f7;
    border-radius: 50%;
  }
  .user-nickname {
    font-size: 48rpx;
    font-weight: bold;
    color: #222222;
  }
  .border-image {
    width: 97rpx;
    height: 18rpx;
    position: absolute;
    right: 0;
    bottom: -30rpx;
  }
}
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 322rpx;
  .empty-image {
    width: 290rpx;
    height: 256rpx;
  }
}
.card-list {
  width: 690rpx;
  margin-left: 30rpx;
  margin-top: 52rpx;
}
.card {
  padding: 40rpx;
  margin-top: 20rpx;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 20rpx 1rpx rgba(0, 0, 0, 0.050980392156862744);
  border-radius: 20rpx 20rpx 20rpx 20rpx;
  .tag {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 96rpx;
    height: 48rpx;
    background: #2d4ef6;
    border-radius: 6rpx;
    font-size: 24rpx;
    color: #ffffff;
  }
  .tag-gray {
    background: #999999;
  }
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 140rpx;
    height: 56rpx;
    margin: 0;
    padding: 0;
    border-radius: 28rpx;
    border: 1px solid #cccccc;
    font-size: 24rpx;
    color: #999999;
    background-color: #fff;
  }
  .text-2 {
    font-size: 40rpx;
    font-weight: bold;
    color: #222222;
  }
  .text-3 {
    font-size: 28rpx;
    font-weight: bold;
    color: #222222;
  }
  .text-4 {
    font-size: 24rpx;
    color: #222222;
  }
}
.card-gray {
  box-shadow: none;
  background: #f7f7f7;
}
</style>

<style>
page {
  background-color: #fff;
}
</style>
