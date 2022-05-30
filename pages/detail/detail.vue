<template>
  <view>
    <uni-icons
      class="left-btn"
      type="left"
      size="20"
      color="#fff"
      @click="$router.go(-1)"
    ></uni-icons>
    <view style="position: relative;">
      <uni-swiper-dot :info="info.images" :current="current">
        <swiper class="swiper-box" @change="change">
          <swiper-item v-for="(item, index) in info.images" :key="index">
            <image
              class="swiper-image"
              :src="item.smallImages"
              mode="aspectFill"
              @click="previewImage(index)"
            ></image>
          </swiper-item>
        </swiper>
      </uni-swiper-dot>
      <view class="swiper-bg"></view>
      <view class="swiper-index">
        {{ current + 1 }}/{{ info.images.length }}
      </view>
    </view>
    <view class="card tf-mt-100">
      <image
        class="header-bg"
        src="@/static/bg-3.png"
        mode="aspectFill"
      ></image>
      <view class="card-title">{{ info.projectName }}</view>
      <view class="tf-flex-row tf-mt-30">
        <view class="tf-flex-col" style="margin-right: 70rpx;">
          <view class="tf-text-primary tf-text-strong">
            {{ parseFloat(info.averagePrice) }}元/m²
          </view>
          <view class="text-2 tf-mt-10">参考均价</view>
        </view>
        <view class="tf-flex-col">
          <view class="tf-text-strong">
            {{ parseFloat(info.roomMinArea) }}-{{
              parseFloat(info.roomMaxArea)
            }}m²
          </view>
          <view class="text-2 tf-mt-10">
            {{ houseText ? `${houseText}室` : '房间面积' }}
          </view>
        </view>
      </view>
      <view class="tf-mt-20">
        <map
          class="map"
          :latitude="newLocation.latitude"
          :longitude="newLocation.longitude"
          @tap="openMap"
        ></map>
      </view>
    </view>
    <view v-if="houses && houses.length" class="card tf-mt-20">
      <view class="title">户型介绍</view>
      <van-tabs :active="activeIndex" :ellipsis="false" @change="onTabChange">
        <van-tab
          v-for="(item, index) in houses"
          :key="index"
          :title="item.title"
          :name="index"
        ></van-tab>
      </van-tabs>
      <scroll-view class="house-scroll-view" scroll-x="true">
        <view class="tf-flex-row">
          <view
            v-for="(house, i) in activeHouseData"
            :key="i"
            class="house-box"
          >
            <image class="house-image" :src="house.images" @click="previewHouseImage(i)"></image>
            <view class="house-text-1">{{ house.houseName }}</view>
            <view class="tf-mt-10">
              <text class="tf-text-sm">
                {{ parseFloat(house.houseArea) }}m²
              </text>
              <text class="tf-text-sm tf-ml-30">
                <text class="tf-text-primary tf-text-sm">
                  {{ parseFloat(house.averagePrice) }}万
                </text>
                起
              </text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="card tf-mt-20">
      <view class="title">楼盘详情</view>
      <view class="tf-mt-30">
        <rich-text :nodes="info.content"></rich-text>
      </view>
    </view>
    <view class="fixed-placeholder">
      <view class="fixed-box">
        <view class="tf-column-items-center" @click="callPhone">
          <uni-icons type="headphones" size="18"></uni-icons>
          <view class="tf-text-20">咨询</view>
        </view>
        <button
          v-if="!info.yyTime"
          class="fixed-btn tf-btn-primary"
          @click="goAppointment"
        >
          预约选房
        </button>
        <view v-else>
          <text class="tf-text-primary tf-text-sm">已预约</text>
          <text class="text-3">（{{ info.yyTime }}）</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getProjectInfo } from '@/api/user.js';
import { convert2TecentMap, openLocation } from '@/utils/util';

export default {
  computed: {
    images() {
      return this.info.images.map(obj => obj.url);
    },
    activeHouseData() {
      const index = this.activeIndex;
      if (this.houses && this.houses.length) {
        return this.houses[index].data;
      }
      return [];
    },
    address() {
      const { province = '', city = '', area = '', address = '' } = this.info;
      return `${province}${city}${area}${address}`;
    },
    newLocation() {
      const { latitude, longitude } = this.info
      const newLocation = convert2TecentMap({
        latitude: latitude,
        longitude: longitude
      })
      return newLocation
    }
  },
  data() {
    return {
      id: '',
      info: {
        images: []
      },
      current: 0,
      activeIndex: 0,
      houses: [],
      houseText: ''
    };
  },
  onLoad({ id }) {
    this.id = id;
  },
  onShow() {
    this.getProjectInfo();
  },
  methods: {
    async getProjectInfo() {
      const { records } = await getProjectInfo({
        id: this.id
      });
      this.info = records || {};
      if (records.house) {
        const houseText = [];
        const tableData = Object.keys(records.house).map(key => {
          houseText.push(key);
          return records.house[key];
        });
        this.houseText = houseText.join('/');
        this.houses = tableData;
      }
    },
    change(e) {
      this.current = e.detail.current;
    },
    onTabChange(event) {
      this.activeIndex = event.detail.name;
    },
    goAppointment() {
      this.$router.push({
        path: '/pages/appointment/appointment',
        query: {
          projectId: this.id
        }
      });
    },
    previewImage(index) {
      uni.previewImage({
        urls: this.images,
        current: index
      });
    },
    previewHouseImage(index) {
      const images = this.activeHouseData.map((house) => {
        return house.images
      })
      uni.previewImage({
        urls: images,
        current: index
      });
    },
    previewContentImage() {
      
    },
    openMap() {
      openLocation({
        name: this.info.projectName,
        address: this.address,
        longitude: this.info.longitude,
        latitude: this.info.latitude
      });
    },
    callPhone() {
      uni.makePhoneCall({
        phoneNumber: this.info.mobile
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tf-text-20 {
  font-size: 20rpx;
}
.tf-mt-100 {
  margin-top: -100rpx;
}
.left-btn {
  position: fixed;
  top: 24rpx;
  left: 34rpx;
  margin-top: var(--status-bar-height);
  z-index: 999;
}
.swiper-bg {
  width: 750rpx;
  height: 100rpx;
  position: absolute;
  bottom: 0;
  background: linear-gradient(180deg, rgba(247, 247, 247, 0) 0%, #f7f7f7 100%);
}
.swiper-index {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100rpx;
  height: 44rpx;
  position: absolute;
  right: 30rpx;
  bottom: 120rpx;
  background: #00000099;
  border-radius: 22rpx;
  font-size: 24rpx;
  color: #ffffff;
}
.card {
  width: 690rpx;
  padding: 30rpx;
  margin-left: 30rpx;
  position: relative;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  .header-bg {
    width: 690rpx;
    height: 352rpx;
    position: absolute;
    top: -160rpx;
    right: -140rpx;
  }
  .card-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #222222;
  }
  .title {
    font-size: 32rpx;
    font-weight: bold;
    color: #222222;
  }
  .text-2 {
    font-size: 24rpx;
    color: #999999;
  }
}
.house-scroll-view {
  padding-top: 30rpx;
}
.house-box + .house-box {
  margin-left: 20rpx;
}
.house-text-1 {
  margin-top: 30rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #222222;
}
.house-image {
  width: 360rpx;
  height: 260rpx;
  border-radius: 10rpx;
  border: 1rpx solid #cccccc;
}
::v-deep .van-tabs {
  width: calc(100% + 60rpx);
  margin-left: -30rpx;
  border-bottom: 1px solid #eeeeee;
  .van-tab {
    padding: 0 16rpx;
  }
}
::v-deep .van-tab--active .tf-ellipsis {
  font-size: 32rpx;
}
::v-deep .van-tabs__line {
  width: 48rpx !important;
  height: 6rpx;
  background: #ef4141;
  border-radius: 3rpx;
}

::v-deep .swiper-box {
  width: 750rpx;
  height: 680rpx;
}

.map {
  width: 626rpx;
  height: 192rpx;
  border-radius: 10rpx 10rpx 10rpx 10rpx;
}

.swiper-image {
  width: 750rpx;
  height: 680rpx;
}
.fixed-placeholder {
  height: calc(128rpx + env(safe-area-inset-bottom));
  height: calc(128rpx + constant(safe-area-inset-bottom));
}
.fixed-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 98rpx;
  padding: 0 30rpx;
  position: fixed;
  bottom: env(safe-area-inset-bottom);
  bottom: constant(safe-area-inset-bottom);
  left: 0;
  right: 0;
  background-color: #fff;
  .tf-column-items-center {
    padding: 0 80rpx;
  }
  .text-3 {
    font-size: 24rpx;
    color: #2d4ef6;
  }
}

.fixed-btn {
  width: 460rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 36rpx;
}
</style>

<style>
page {
  background-color: #f7f7f7;
}
</style>
