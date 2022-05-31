<template>
  <view>
    <uni-nav-bar
      leftWidth="0"
      statusBar="true"
      backgroundColor="false"
      :fixed="true"
      :border="false"
    />
    <image class="bg" src="@/static/bg-3.png" mode="aspectFill"></image>
    <view class="tf-p-30-20" style="position: relative;z-index: 1000;">
      <view class="header-box" @click="goLogin">
        <image
          class="header"
          src="@/static/header.png"
          mode="aspectFill"
        ></image>
        <view class="header-content tf-row-justify-between">
          <image
            class="avatar"
            src="@/static/avatar.png"
            mode="aspectFill"
          ></image>
          <view class="text">{{ userInfo.id ? userMobile : '登录/注册' }}</view>
        </view>
      </view>
      <view class="container">
        <template v-if="listData && listData.length">
          <view
            v-for="item in listData"
            class="house-item"
            :key="item.id"
            @click="goDetail(item)"
          >
            <image
              class="house-image"
              :src="item.images"
              mode="aspectFill"
            ></image>
            <view v-if="item.status == 2" class="house-tag">
              {{ item.statusv }}
            </view>
            <view class="tf-flex-1">
              <view class="text-1">{{ item.projectName }}</view>
              <view class="tf-mt-10 text-2">
                {{ item.province }} {{ item.city }} {{ item.area }}/建面{{
                  item.roomMinArea | roomArea(item.roomMaxArea)
                }}m²
              </view>
              <view class="tf-mt-20">
                <text class="text-3">{{ parseFloat(item.averagePrice) }}</text>
                <text class="text-4">元/m²</text>
              </view>
            </view>
          </view>
        </template>
        <view v-else class="empty-box">
          <image class="empty-image" src="@/static/empty.png"></image>
          <view class="">暂无在售楼盘</view>
        </view>
      </view>
    </view>
    <mobile-login-popup
      v-model="loginVisible"
      @success="init"
    ></mobile-login-popup>
  </view>
</template>

<script>
import { getProjectList, getShareInfo } from '@/api/user.js';
import MobileLoginPopup from '@/components/MobileLoginPopup/index';
import ListMixins from '@/mixins/list.js';
import { mapGetters } from 'vuex';
export default {
  mixins: [ListMixins],
  components: {
    MobileLoginPopup
  },
  computed: {
    ...mapGetters(['userInfo', 'userMobile'])
  },
  filters: {
    roomArea(roomMinArea = 0, roomMaxArea = 0) {
      roomMinArea = parseFloat(roomMinArea);
      roomMaxArea = parseFloat(roomMaxArea);
      if (roomMinArea > 0 && roomMaxArea > 0) {
        return `${roomMinArea} - ${roomMaxArea}`;
      }
      return roomMinArea || roomMaxArea;
    }
  },
  data() {
    return {
      loginVisible: false,
      infoShowPermissions: 0,
      shareInfo: {}
    };
  },
  onLoad() {
    this.getShareInfo();
    // if (!this.userInfo.id) {
    //   this.loginVisible = true
    // }
  },
  onShow() {
    if (uni.getStorageSync('access_token')) {
      this.$store.dispatch('getMyAccount').then(() => {
        this.refreshLoad();
      });
    } else {
      this.refreshLoad();
    }
  },
  onShareAppMessage() {
    return {
      title: this.shareInfo.appletShareTitle,
      path: '/pages/tabBar/home/home',
      imageUrl: this.shareInfo.appletShareImg
    };
  },
  methods: {
    init() {},
    getListData() {
      return getProjectList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        utype: this.userInfo?.utype || 0
      }).then(res => {
        this.infoShowPermissions = +res.infoShowPermissions;
        return res;
      });
    },
    async getShareInfo() {
      const { records } = await getShareInfo();
      this.shareInfo = records || {};
    },
    goLogin() {
      if (!this.userInfo.id) {
        this.$router.push({
          path: '/pages/login/login'
        });
      } else {
        this.$router.push({
          path: '/pages/personal/personal'
        });
      }
    },
    goDetail({ id }) {
      if (this.userInfo.id && +this.infoShowPermissions) {
        this.$router.push({
          path: '/pages/detail/detail',
          query: {
            id
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  width: 790rpx;
  height: 689rpx;
  position: fixed;
  top: -180px;
  left: -68px;
  z-index: 9;
}
.header-box {
  position: relative;
  height: 140rpx;
  border-radius: 20rpx 20rpx 0 0;
}
.header {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.header-content {
  height: 100%;
  padding: 20rpx 60rpx 0;
}
.avatar {
  width: 70rpx;
  height: 70rpx;
  padding: 5rpx;
  background: #fff;
  border-radius: 50%;
}
.text {
  font-size: 32rpx;
  line-height: 80rpx;
  font-weight: bold;
  color: #ffffff;
}
.container {
  padding: 30rpx;
  margin-top: -20rpx;
  border-radius: 20rpx;
  background-color: #fff;
}
.house-item {
  display: flex;
  padding: 30rpx 0;
  position: relative;
  border-bottom: 1rpx solid #eeeeee;
  .house-image {
    width: 240rpx;
    height: 160rpx;
    margin-right: 30rpx;
    border-radius: 6rpx;
  }
  .house-tag {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 118rpx;
    height: 50rpx;
    position: absolute;
    top: 30rpx;
    left: 0;
    font-size: 22rpx;
    color: #ffffff;
    background: #2d4ef6e6;
    border-radius: 10rpx 0 10rpx 0;
  }
  .text-1 {
    font-size: 32rpx;
    font-weight: bold;
    color: #222222;
  }
  .text-2 {
    font-size: 22rpx;
    font-weight: bold;
    color: #222222;
  }
  .text-3 {
    font-size: 36rpx;
    font-weight: bold;
    color: #ef4141;
  }
  .text-4 {
    font-size: 24rpx;
    font-weight: bold;
    color: #ef4141;
  }
}
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 220rpx 0;
  .empty-image {
    width: 290rpx;
    height: 360rpx;
  }
}
</style>

<style>
page {
  background-color: #f7f7f7;
}
</style>
