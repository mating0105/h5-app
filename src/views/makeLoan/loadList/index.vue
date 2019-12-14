<template>
  <div>
    <van-tabs v-model="active" @change='changeState' swipeable>
        <van-tab title="待办" name="1">
            <div class="wrapper" ref="wrapper" style="margin:10px;">
                <van-search placeholder="搜索" v-model="dealWith" input-align='center' clearable/>
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
                :error.sync="error" error-text="请求失败，点击重新加载" @load="onLoad">
                    <div v-for="item in 3" :key="item" :title="item">
                        <Card class="xh-top-10">
                            <template v-slot:header>
                                <section class="xh-plus">
                                    <van-cell title="银行放款" icon="after-sale"></van-cell>
                                </section>
                            </template>
                            <van-row>
                                <van-col span="24">
                                    项目编号：190321505301
                                </van-col>
                                <van-col span="12" class="xh-top-10">
                                    客户名称：姜宁勇
                                </van-col>
                                <van-col span="12" class="xh-top-10">
                                    2019年03月21日 18:08:08
                                </van-col>
                            </van-row>
                            <template v-slot:footer>
                                <div style="text-align:right;">
                                    <van-button
                                    plain
                                    type="danger"
                                    class="xh-radius"
                                    style="border-radius: 6px;"
                                    @click="applyPay"
                                    >发起做单</van-button>
                                </div>
                            </template>
                        </Card>
                    </div>
                </van-list>
            </div>
        </van-tab>
        <van-tab title="已办" name="2">
            <div>
                <van-search placeholder="搜索" v-model="alreadyDone" input-align='center' clearable/>
            </div>
        </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import Card from "@/components/card/index";
// 其他组件
import { Row, Col, Icon, Cell, Button, List,Tab, Tabs,Search  } from "vant";
const Components = [Row, Col, Icon, Cell, Button, List,Tab, Tabs,Search ];

Components.forEach(item => {
  Vue.use(item);
});
export default {
    name:'lendProcessList',
    props: {
      scroll: true,
      margin: true
    },
    components: {
        Card
    },
    data() {
        return {
            active:'1',
            list: ['银行放款','银行放款','银行放款'],
            loading: false,
            error: false,
            finished: false,
            alreadyDone:'',
            dealWith:'',
        };
    },
    methods: {
        onLoad() {
            // 异步更新数据
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    // this.list.push(this.list.length + 1);
                }
                // 加载状态结束
                this.loading = false;
                // 数据全部加载完成
                if (this.list.length >= 40) {
                    this.finished = true;
                }
            }, 500);
        },
        // 发起放款
        applyPay() {
            this.$router.push("/lendProcess");
        },
        changeState(val){
            
        }
    }
};
</script>

<style lang="scss">
.xh-plus {
  span {
    color: rgb(196, 37, 42);
  }
}
.xh-fixed-submit {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  .van-button {
    border-radius: 0;
  }
}
</style>
