export default {
  data() {
    return {
      listData: [],
      pageNum: 1,
      pageSize: 10,
      isFinish: false,
      loadMoreStatus: '',
    }
  },
  watch: {
    isFinish(newValue) {
      if (newValue) {
        this.loadMoreStatus = 'no-more';
      }
    }
  },
  onLoad() {
    setTimeout(() => {
      this.handleLoad(true);
    }, 0)
  },
  onReachBottom() {
    !this.isFinish && this.getNextPage()
  },
  onPullDownRefresh() {
    this.refreshLoad();
  },
  methods: {
    async handleLoad(isContinuous = false) {
      if (this.isFinish) {
        return;
      }
      this.loadMoreStatus = 'loading';
      const {
        records: data
      } = await this.getListData();
      this.loadMoreStatus = 'more';
      if (data && data.length > 0) {
        this.listData.push(...data);
      }
      this.isFinish = !data || data.length < this.pageSize;
      !this.isFinish && isContinuous && this.getNextPage()
      uni.stopPullDownRefresh()
    },
    refreshLoad() {
      this.pageNum = 1;
      this.listData = [];
      this.isFinish = false;
      this.handleLoad(true);
    },
    getNextPage() {
      this.pageNum++;
      this.handleLoad();
    }
  }
}
