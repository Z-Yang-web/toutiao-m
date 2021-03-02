<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <!-- 如果isDeleteShow为true显示此模板 -->
        <span @click="$emit('clear-search-history')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete-o" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
      :title="history"
      :key="index"
      v-for="(history, index) in searchHistories"
      @click="onSearchItemClick(history, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearchItemClick (history, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态,直接进入搜索
        this.$emit('search', history)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
