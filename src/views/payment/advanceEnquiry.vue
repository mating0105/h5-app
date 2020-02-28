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
                    style="min-height: 80vh"
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
                                <van-cell :title="item.projectNo" value=""></van-cell>
                            </section>
                        </template>
                        <van-row style="min-height: 10rem">
                            <van-col span="12">客户名称：{{ item.customerName }}</van-col>
                            <van-col span="12" style="text-align:right;">
                                {{dayjs(item.advancesTime).format('YYYY-MM-DD HH:mm:ss')}}
                            </van-col>
                            <van-col span="24" class="xh-top-10">身份证：{{ item.certificateNum }}</van-col>
                            <van-col span="24" class="xh-top-10">垫款金额：{{ item.advancesMoney }}</van-col>
                            <van-col span="24" class="xh-top-10">贷款类型：{{ item.carNature }}</van-col>
                        </van-row>
                    </Card>
                </div>
            </van-list>
        </van-pull-refresh>
    </ViewPage>
</template>

<script>
  import Vue from "vue";
  import dayjs from 'dayjs'
  import { getAdvanceEnquiryList } from "@/api/bigData";
  // 自定义组件
  import ViewPage from "@/layout/components/ViewPage";
  import Card from "@/components/card/index";
  // 其他组件
  import { Row, Col, Icon, Cell, Button, List, Search, PullRefresh, Toast } from "vant";

  const Components = [Row, Col, Icon, Cell, Button, List, Search, PullRefresh, Toast];

  Components.forEach(item => {
    Vue.use(item);
  });
  import { mapState } from "vuex";

  export default {
    name: 'advanceEnquiry',
    components: {
      ViewPage,
      Card
    },
    data () {
      return {
        dayjs:dayjs,
        list: [],
        loading: false,
        error: false,
        finished: false,
        isLoading: false,
        params: {
          pageIndex: 1,
          pageSize: 10,
          searchKey: ''
        },
      };
    },
    computed: {
      // 所有字典
      ...mapState({
        wordbook: state => state.user.wordbook,
      })
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
        let name;
        this.wordbook.cu_credit_status.forEach(e => {
          if (e.value === val) {
            name = e.label;
          }
        });
        return name;
      },
      onLoad () {
        this.loading = !this.isLoading;
        getAdvanceEnquiryList(this.params).then(res => {
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
        this.params.searchKey = this.params.searchKey.replace(/\s+/g,'');
        this.onLoad()
      },
      // 取消搜索
      onCancel() {
        this.params.searchKey = '';
        this.onSearch();
      },
      //点击卡片-暂不开发
      startFormFn (item) {
        // this.startForm(item, {edit: false, bigData: true})
      },
      // 详情
      startForm (item, query = {}) {
        // this.$router.push({path: '/bigDataQueryDetail', query: {edit: true, bigData: true, lpCertificateNum: item.lpCertificateNum, id: item.id, ...query}})
      },
      nameToString () {
        return [...arguments].map(item => item).join('')
      },
      //下拉刷新
      onRefresh () {
        this.list = []
        this.params.pageIndex = 1
        if(this.finished) {
          this.finished = false
        } else {
          this.onLoad()
        }
        setTimeout(() => {
          Toast.success('刷新成功');
        }, 500);
      }
    },
    mounted () {
      this.onLoad();
    }
  };
</script>

<style lang="scss">
    .xh-plus {
        span {
            color: rgb(196, 37, 42);
        }
    }
</style>
