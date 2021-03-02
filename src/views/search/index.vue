<template>
  <div class="search-container">
    <form action="/">
      <van-search
        class="search-form"
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
      <!-- 搜索结果 -->
      <search-result v-if="isResultShow" :search-text="searchText" />
      <!-- 搜索建议  -->
      <search-suggestion
        :search-text="searchText"
        @search="onSearch"
        v-else-if="searchText"
      />
      <!-- 搜索历史 -->
      <search-history
        v-else
        :search-histories="searchHistories"
        @clear-search-history="searchHistories = []"
        @search="onSearch"
      />
      <!-- 触发自定义事件时让数组等于空 -->
    </form>
  </div>
</template>

<script>
import SearchHistory from './compontents/search-history'
import SearchSuggestion from './compontents/search-suggestion'
import SearchResult from './compontents/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 用来存储历史记录
    }
  },
  computed: {},
  watch: {
    searchHistories (value) {
      // 存储到本地
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch (val) {
      // console.log(val);
      this.searchText = val
      // 存储历史记录
      // 最新的历史记录排在最前面
      const index = this.searchHistories.indexOf(val)
      // console.log(index);
      if (index !== -1) {
        // 说明查找的字符串在数组中
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val) // 在头部添加
      // 输入搜索关键字，敲回车之后触发搜索事件
      this.isResultShow = true
    },
    onCancel () {
      // 点击取消按钮，触发cancel事件
      this.$router.push('/')
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
