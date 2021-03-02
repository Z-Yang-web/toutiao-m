<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <!-- 增加一个名为title的插槽   -->
      <van-button
        class="search-btn"
        slot="title"
        icon="search"
        type="info"
        round
        to="search"
        >搜索 </van-button
      >,
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        :key="index"
        v-for="(channel, index) in channels"
      >
        <!-- 频道的文章列表 -->
        <article-list :channel="channel" />
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑 -->
    <van-popup
      v-model="isChennelEditShow"
      position="bottom"
      closeable
      round
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :active="active"
        :my-channels="channels"
        @update-active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './compontent/article-list'
import ChannelEdit from './compontent/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomePage',
  components: {
    ArticleList,
    ChannelEdit
  },
  // import引入的组件需要注入到对象中才能使用
  data () {
    // 这里存放数据
    return {
      active: 0,
      channels: [], // 频道列表
      isChennelEditShow: false
    }
  },
  created () {
    this.loadChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  // 方法集合
  methods: {
    async loadChannels () {
      try {
        let channels = []
        const localChannels = getItem('TOUTIAO_CHANNELS')
        if (this.user || !localChannels) {
          // 用户已登录 或者未登录本地没有存储,获取数据
          const { data } = await getUserChannels()
          // console.log(data);
          channels = data.data.channels
        } else {
          // 未登录并且本地有数据
          channels = localChannels
        }
        // 将数据更新到组件中
        this.channels = channels
      } catch (error) {
        this.$toast('获取用户频道列表失败')
      }
    },
    onUpdateActive (index, isChennelEditShow = true) {
      this.active = index
      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>
<style lang='less' scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      height: 82px;
      z-index: 1;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
  }
  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }
  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.92;
    i.toutiao {
      font-size: 33px;
    }
  }
}
</style>
