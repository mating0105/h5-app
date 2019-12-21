<template>
    <ViewPage>
        <van-button type="default" @click="clickFn">默认按钮</van-button>
        <van-button type="primary">主要按钮</van-button>
        <van-button type="info">信息按钮</van-button>
        <van-button type="warning">警告按钮</van-button>
        <van-button type="danger">危险按钮</van-button>
        <p>token: {{token}}</p>
        <p style="font-weight: 600;font-size: 2rem">这是返回的消息:</p>
        <p style="color: #21C272">{{test}}</p>
<!--        <van-checkbox v-model="check">复选框</van-checkbox>-->
<!--        <van-cell-group>-->
<!--            <van-field v-model="value" placeholder="请输入用户名"/>-->
<!--        </van-cell-group>-->
        <!--        <van-list-->
        <!--                v-model="loading"-->
        <!--                :finished="finished"-->
        <!--                finished-text="没有更多了"-->
        <!--                @load="getList"-->
        <!--        >-->
        <!--            <van-cell-->
        <!--                    v-for="item in dataList"-->
        <!--                    :key="item.id"-->
        <!--                    :title="item.display_time"-->
        <!--            />-->
        <!--        </van-list>-->
    </ViewPage>

</template>

<script>
  import { mapGetters } from 'vuex'
  import ViewPage from '@/layout/components/ViewPage';
  import Vue from 'vue'
  import { Button, Checkbox, Field, Cell, CellGroup, List, Toast } from 'vant';
  import { getList } from '@/api/table'
  import { getToken } from '@/utils/auth'

  const Components = [Button, Checkbox, Field, Cell, CellGroup, List, Toast]

  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: 'Dashboard',
    components: {
      ViewPage
      // van-button
      // NavBar
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data () {
      return {
        check: true,
        value: '',
        dataList: [],
        loading: false,
        finished: false,
        msg: 'test data',
        test: '',
        token: getToken()
      }
    },
    methods: {
      async getList () {
        const response = await getList()
        this.dataList = response.data.items
        this.finished = true
      },
      //js调app
      sendMsg (fnName) {
        let msg = this.msg
        this.$bridge.callHandler(fnName, msg, (res) => {
          Toast('获取app响应数据:' + res)
          this.test = res
        })
      },
      // app调js
      getAPPDate (fnName) {
        this.$bridge.registerHandler(fnName, (data, responseCallback) => {
          Toast('app主动调用js方法，传入数据:' + data)
          responseCallback(data)
        })
      },
      clickFn () {
        try {
          this.sendMsg('callNativeCode')
          // if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.callNativeCode) {
          //   window.webkit.messageHandlers.callNativeCode.postMessage('callNativeCode')
          // }
          // if (window.WebViewJavascriptBridge) {
          //   //do your work here
          // } else {
          //   document.addEventListener(
          //     'WebViewJavascriptBridgeReady'
          //     , function () {
          //       //do your work here
          //     },
          //     false
          //   );
          // }
        } catch (e) {
          Toast(e);
        }
      }
    },
    mounted () {
      this.getAPPDate('callJsCode')
      // this.getList()
    }
  }
</script>

<style lang="scss" scoped>
    /*.dashboard {*/
    /*    &-container {*/
    /*        margin: 30px;*/
    /*    }*/

    /*    &-text {*/
    /*        font-size: 30px;*/
    /*        line-height: 46px;*/
    /*    }*/
    /*}*/
</style>
