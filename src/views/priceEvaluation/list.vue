<template>
    <ViewPage :backFn="closeNativeWebView">
        <template v-slot:head>
            <van-search
                    v-model="params.searchKey"
                    placeholder="请输入搜索关键词"
                    show-action
                    @search="onSearch"
                    @cancel="onCancel"
            />
        </template>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    :error.sync="error"
                    error-text="请求失败，点击重新加载"
                    @load="onLoad"
            >
                <div v-for="(item,ie) in list" :key="ie" class="van-clearfix">
                    <Card class="xh-top-10" :bodyPadding='true' @click.native="startFormFn(item)" style="margin:1rem 1rem 0 1rem;">
                        <template v-slot:header>
                            <section class="xh-plus">
                                <van-cell :title="item.chassisNumber" :value="returnText(item.status)" icon="notes-o"></van-cell>
                            </section>
                        </template>
                        <van-row style="min-height: 10rem">
                            <van-col span="24">车架号：{{ item.chassisNumber }}</van-col>
                            <van-col span="24" class="xh-top-10" style="display: flex">
                                <div style="white-space:nowrap;">品牌型号：</div>
                                <div>{{nameToString(item.brndNm, item.carSeries, item.carModel)}}</div>
                            </van-col>
                            <van-col span="24" class="xh-top-10">车牌所在地：{{ item.carLicenseLocation }}</van-col>
                            <van-col span="24" class="xh-top-10">首次上牌日期：{{ item.plateDate }}</van-col>
                            <van-col span="24" class="xh-top-10">行驶里程：{{ item.roadHaul }}公里</van-col>
                            <van-col span="24" class="xh-top-10" v-if="item.status === '2' || item.status === '3'">
                            <span class="xh-primary-tag">
                               二手车评估中
                            </span>
                            </van-col>
                            <van-col span="24" class="xh-top-10" v-else-if="item.status === '4'">
                            <span class="xh-success-tag">
                               二手车评估价{{item.evaluatingPriceDot}}元
                            </span>
                            </van-col>
                        </van-row>
                             <template v-slot:footer>
<!--                        <template v-slot:footer v-if="item.yn != 1">-->
                            <div style="text-align:right; min-height: 2rem">
                                <van-button
                                        v-if="item.status === '1'"
                                        plain
                                        size="small"
                                        type="danger"
                                        class="xh-radius"
                                        style="border-radius: 6px;"
                                        @click.stop="startForm(item)"
                                >发起二手车评估
                                </van-button>
                                <van-button
                                        v-else-if="item.status === '4' && isSendRole"
                                        plain
                                        size="small"
                                        type="danger"
                                        class="xh-radius"
                                        style="border-radius: 6px;"
                                        @click.stop="startForm(item)"
                                >重新发起二手车评估
                                </van-button>

                                <van-button
                                        v-if="item.status === '3'"
                                        plain
                                        size="small"
                                        type="danger"
                                        class="xh-radius"
                                        style="border-radius: 6px;"
                                        @click.stop="startForm(item, {isReply: true, edit: false})"
                                >立即评估
                                </van-button>
<!--                                <van-button-->
<!--                                        v-else-if="item.status === '4'"-->
<!--                                        plain-->
<!--                                        size="small"-->
<!--                                        type="danger"-->
<!--                                        class="xh-radius"-->
<!--                                        style="border-radius: 6px;"-->
<!--                                        @click.stop="startForm(item, {isReply: true, edit: false})"-->
<!--                                >重新评估-->
<!--                                </van-button>-->
                            </div>
                        </template>
                    </Card>
                </div>
            </van-list>
        </van-pull-refresh>
        <div class="xh-fixed-submit">
            <div class="xh-submit">
                <van-button
                        icon="plus"
                        size="large"
                        class="xh-bg-main"
                        @click="addVehicle"
                >新增二手车
                </van-button>
            </div>
        </div>
    </ViewPage>
</template>

<script>
  import Vue from "vue";
  import { getList, getUserInfoByTo } from "@/api/priceEvaluation";
  // 自定义组件
  import ViewPage from "@/layout/components/ViewPage";
  import Card from "@/components/card/index";
  // 其他组件
  import { Row, Col, Icon, Cell, Button, List, Search, Toast, PullRefresh } from "vant";

  const Components = [Row, Col, Icon, Cell, Button, List, Search, Toast, PullRefresh];

  Components.forEach(item => {
    Vue.use(item);
  });
  import { mapState } from "vuex";

  export default {
    name: 'priceEvaluationList',
    components: {
      ViewPage,
      Card
    },
    data () {
      return {
        list: [],
        loading: false,
        isLoading: false,
        error: false,
        finished: false,
        params: {
          pageIndex: 1,
          pageSize: 10,
          searchKey: ''
        },
        isReply: false,
        roleInfoList: []
      };
    },
    computed: {
      // 所有字典
      ...mapState({
        wordbook: state => state.user.wordbook,
      }),
      isSendRole () {
        let flag = true
        let list = ['CustomerAttache', 'CustomerManager']
        const arr = this.roleInfoList.filter(item => {
            return list.includes(item.enname)
        })
        flag = arr.length > 0
        return flag
      }
    },
    watch: {
      error (value) {
        if (!value) {
          this.onLoad()
        }
      }
    },
    methods: {
      // 字典转换
      returnText (val) {
        let name = '';
        this.wordbook.Used_car_evaluation.forEach(e => {
          if (e.value === val && val !== '1') {
            name = e.label;
          }
        });
        return name;
      },
      onLoad () {
        this.loading = !this.isLoading;
        getList(this.params).then(res => {
          const {code, data, msg} = res;
          data.result.forEach(t => {
            this.list.push(t);
          });
          // 加载状态结束
          this.loading = false;
          this.params.pageIndex++;
          // 数据全部加载完成
          this.finished = this.list.length === data.totalCount;
          this.isLoading = false;
        }).catch(() => {
          this.error = true
          this.loading = false
        });
      },
      onSearch () {
        this.list = []
        this.finished = false
        this.params.pageIndex = 1
        this.params.searchKey = this.params.searchKey.replace(/\s+/g, '');
        this.onLoad()
      },
      // 取消搜索
      onCancel () {
        this.params.searchKey = '';
        this.onSearch();
      },
      startFormFn (item) {
        let query = {}
        if (item.status === '3' || item.status === '4') {
          query = {isReply: true, isReplyView: true}
        }
        this.startForm(item, {edit: false, ...query})
      },
      // 详情
      startForm (item, query = {}) {
        this.$router.push({path: '/priceEvaluationDetail', query: {edit: true, ...item, ...query}})
      },
      nameToString () {
        return [...arguments].map(item => item).join('')
      },
      //下拉刷新
      onRefresh () {
        this.list = []
        this.params.pageIndex = 1
        this.finished = false
        if (this.finished) {
          this.finished = false
        } else {
          this.onLoad()
        }
        setTimeout(() => {
          Toast.success('刷新成功');
        }, 500);
      },
      addVehicle () {
        this.$router.push({
          path: '/vehicle',
          query: {
            addUsedCar: true
          }
        })
      },
      //获取用户信息
      async getUserInfoByTo () {
        try {
          const {data} = await getUserInfoByTo()
          this.roleInfoList = data.roleInfoList
        } catch (e) {
          console.log(e)
        }
      }
    },
    mounted () {
      // if(this.$route.name === 'priceEvaluationReplyList') {
      //   this.isReply = true
      // }
      this.onLoad();
      this.getUserInfoByTo();
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
