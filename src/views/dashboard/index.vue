<template>
    <ViewPage>
        <van-button type="default" @click="clickFn">默认按钮</van-button>
<!--        <van-button type="primary">主要按钮</van-button>-->
<!--        <van-button type="info">信息按钮</van-button>-->
<!--        <van-button type="warning">警告按钮</van-button>-->
<!--        <van-button type="danger">危险按钮</van-button>-->
        <p>token: {{token}}</p>
        <p>name：{{userName}}</p>
        <p>loginName：{{loginName}}</p>
        <p>cookieKeys:{{cookieKeys}}</p>
<!--        <p style="font-weight: 600;font-size: 2rem">这是返回的消息:</p>-->
<!--        <p style="color: #21C272">{{test}}</p>-->
<!--        <input type="file">-->
<!--        <iframe-->
<!--                id="iframepage"-->
<!--                src="http://dev.wwvas.com:10001/#/installOrderList?loanAmount=100000.00&prodqty=undefined&insurance=undefined&ownername=林顺辉&idcard=511021197206082828&mobile=13158585858&contactname=向召&contactmobile=null&vehiclecategory=2&vehicletype=乘用车&model=1&price=200000.00&showTitle=false&externalid=XM201912271820&externalcustnum=undefined&externalvehicleid=201912271923&username=18349309486"-->
<!--                frameborder="0"-->
<!--                scrolling="auto"-->
<!--                width="100%"-->
<!--                :height="heightPage"-->
<!--        ></iframe>-->
<!--        <van-uploader style='margin-top: 1rem;' v-model="fileList" multiple/>-->
    </ViewPage>

</template>

<script>
  import { mapGetters } from 'vuex'
  import ViewPage from '@/layout/components/ViewPage';
  import Vue from 'vue'
  import { Button, Checkbox, Field, Cell, CellGroup, List, Toast, Uploader } from 'vant';
  import { getList } from '@/api/table'
  import { getToken } from '@/utils/auth'
  import Cookies from 'js-cookie'

  const Components = [Button, Checkbox, Field, Cell, CellGroup, List, Toast, Uploader]

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
        token: getToken(),
        userName:'',
        loginName:'',
        cookieKeys:{},
        fileList: [
          {url: 'https://img.yzcdn.cn/vant/leaf.jpg'},
        ]
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
      this.userName=Cookies.get('name');
      this.loginName=Cookies.get('loginName');
      this.cookieKeys=Cookies.get();
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
