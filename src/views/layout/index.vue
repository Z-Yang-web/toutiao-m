<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view />
    <!-- 标签导航栏 -->
    <!-- route:开启路由模式,路由模式下会自动匹配路径和标签的to属性,并自动选中标签 -->
    <van-tabbar class="layout-tabbar" route>
      <van-tabbar-item to="/">
        <i slot="icon" class="toutiao toutiao-shouye"></i>
        <span class="text">首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <i slot="icon" class="toutiao toutiao-wenda"></i>
        <span class="text">问答</span>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <i slot="icon" class="toutiao toutiao-shipin"></i>
        <span class="text">视频</span>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <i slot="icon" class="toutiao toutiao-wode"></i>
        <span class="text">{{ $store.state.user ? "我的" : "未登录" }}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layoutINdex',
  // import引入的组件需要注入到对象中才能使用
  data () {
    // 这里存放数据
    return {}
  },
  // 方法集合
  methods: {}
}
</script>
<style lang='less' scoped>
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 20px;
    }
  }
}
</style>
