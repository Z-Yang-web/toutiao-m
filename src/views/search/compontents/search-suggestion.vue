<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highLight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  computed: {},
  watch: {
    // 实时监听searchText变化,只要发生变化我们需要发起请求
    searchText: {
      // 当 searchText 发生改变的时候就会调用 handler 函数
      // 注意：handler 函数名称是固定的
      //   handler(val) {
      //     this.loadSearchSuggestions(val);
      //   },
      // 使用防抖
      handler: debounce(function (val) {
        this.loadSearchSuggestions(val)
      }, 200),
      // 首次监视触发（如果不添加这个属性，那么handler无法监听到第一次searchText的变化）
      immediate: true // immediate立即的意思
    }
  },
  created () {},
  mounted () {},
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('获取失败')
      }
    },
    highLight (text) {
      //   console.log(text);
      const hightLightStr = `<span style="color:red">${this.searchText}</span>`
      //    RegExp正则表达式构造函数
      // 参数1:匹配模式字符串,他会根据这个字符串创建正则对象
      // 参数2:匹配模式,要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightLightStr)
    }
  }
}
</script>

<style scoped lang="less">
</style>
