<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
// 引入获取搜索结果的函数
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        // 异步更新数据
        const { data } = await getSearchResult({
          page: this.page, // 页码默认为第一页
          per_Page: this.perPage, // 每页的数量
          q: this.searchText
        })
        // console.log(data);
        const { results } = data.data
        // console.log(...results);
        this.list.push(...results)
        // 设置加载状态结束
        this.loading = false
        // 判断数据是否加载完毕
        if (results.length) {
          this.page++ // 如果有数据则加载下一页数据
        } else {
          this.finished = true // 没有数据则设置结束状态为真,停止加载
        }
      } catch (err) {
        // 加载失败
        this.error = true
        // 加载失败loading状态关闭
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
