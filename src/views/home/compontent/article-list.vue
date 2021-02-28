<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-duration="1500"
      :success-text="refreshSuccessText"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: {
    // 接收父组件传递过来的数据
    channel: {
      type: Object,
      required: true
    }
  },
  // import引入的组件需要注入到对象中才能使用
  data () {
    // 这里存放数据
    return {
      list: [], // 存储数据列表的数组
      loading: false, // 控制加载loading的状态
      finished: false, // 控制数据加载结束的状态
      error: false, // 是否加载失败
      timestamp: null,
      // 控制下拉刷新的失败状态
      isRefreshLoading: false,
      refreshSuccessText: ''
    }
  },
  // 方法集合
  methods: {
    //   加载函数
    async onLoad () {
      console.log('loading')
      // 异步更新数据
      try {
        //   1,请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // 把数据添加到list数组中
        const { results } = data.data // 这个是请求回来的结果数据
        this.list.push(...results) // 将结果数据展开加入到list中
        // 加载状态结束
        this.loading = false

        // 判断数据是否全部加载完成,长度为0 说明没有数据
        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据,设置加载状态结束
          this.finished = true
        }
      } catch (error) {
        this.loading = false
        this.error = true
      }
    },
    // 当触发下拉刷新的时候调用该函数
    async onRefresh () {
      try {
        //   1,请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(),
          with_top: 1
          // 把数据添加到list数组中
        })
        // 把数据添加到list数组中
        const { results } = data.data // 这个是请求回来的结果数据
        this.list.unshift(...results) // 将结果数据展开加入到list中
        // 3,关闭下拉刷新的loading状态
        this.isRefreshLoading = false
        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功,更新了${results.length}数据`
      } catch (error) {
        // 3,关闭下拉刷新的loading状态
        this.isRefreshLoading = false
        // 提示用户
        this.$toast('刷新数据失败')
      }
    }
  }
}
</script>
<style lang='less' scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
