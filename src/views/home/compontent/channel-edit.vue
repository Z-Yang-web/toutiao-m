<template>
  <div class="channel-edit">
    <!-- 头部我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        round
        size="mini"
        type="danger"
        plain
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(channle, index) in myChannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(channle, index)"
      >
        <van-icon
          name="clear"
          v-show="isEdit && !fiexdChannels.includes(channle.id)"
          slot="icon"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">
          {{ channle.name }}</span
        >
      </van-grid-item>
    </van-grid>
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">推荐频道</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        class="grid-item"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'channel-edit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0] // 固定频道,不允许删除
    }
  },
  computed: {
    recommendChannels () {
      const channels = []
      this.allChannels.forEach((channel) => {
        // 遍历所有频道，如果不在我的频道中，就放入空数组channels
        // find 遍历数组，找到满足条件的元素项
        const ret = this.myChannels.find((myChannel) => {
          // 在我的频道中查找是否有此频道
          return myChannel.id === channel.id
        })

        // 如果不存在，放入空数组
        if (!ret) {
          channels.push(channel)
        }
      })
      // 把计算结果返回
      return channels
    },
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('获取频道列表数据失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      //   判断用户是否登录
      if (this.user) {
        // 已登录
        try {
          // 已登录,数据存储到线上
          await addUserChannel({
            id: channel.id, // 频道 id
            seq: this.myChannels.length // 频道的 序号
          })
          this.$toast('添加成功')
        } catch (error) {
          this.$toast('保存失败')
        }
      } else {
        // 未登录
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 点击我的频道
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        //   1,如果是固定频道,则不允许删除
        if (this.fiexdChannels.includes(channel.id)) {
          return this.$notify('此频道不允许删除')
        }
        //   删除频道项
        this.myChannels.splice(index, 1)
        // 如果删除的激活频道之前的项目,则更新激活的频道项
        if (index <= this.active) {
          // 让激活频道的索引减一
          this.$emit('update-active', this.active - 1, true)
        }
        // 处理持久化
        this.deleteChannel(channel)
      } else {
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          //   已登录,经数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录,将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (error) {
        this.$notify('删除频道失败,请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
  /deep/.my-grid {
    .van-icon-clear {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 30px;
      color: #cacaca;
      z-index: 2;
    }
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 28px;
        color: #222;
        /* 添加margin-top:0 */
        margin-top: 0;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
