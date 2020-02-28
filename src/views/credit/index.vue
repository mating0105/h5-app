<template>
    <ViewPage :goPage='rightFn' iconClass="filter-o" :rightMenuList="cuCreditStatus" :backFn="closeNativeWebView">
        <template v-slot:head>
            <van-search
                    v-model="params.searchKey"
                    placeholder="请输入搜索关键词"
                    show-action
                    @search="onSearch"
                    @cancel="onCancel"
            />
        </template>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="margin-bottom: 4rem">
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
                    <Card class="xh-top-10" :bodyPadding='true' @click.native="startFormFn(item, {edit: false}, '/bankQuery')" style="margin:1rem 1rem 0 1rem;">
                        <template v-slot:header>
                            <section class="xh-plus">
                                <van-cell :title="item.customerNum" :value="returnText(item.status)" icon="notes-o"></van-cell>
                            </section>
                        </template>
                        <van-row>
                            <van-col span="24">客户名称：{{ item.loanPersonName }}</van-col>
                            <van-col span="24" class="xh-top-10">身份证：{{ item.lpCertificateNum }}</van-col>
                            <van-col span="24" class="xh-top-10">手机号码：{{ item.telephone }}</van-col>
                            <van-col span="24" class="xh-top-10">申报人：{{ item.applicantName }}</van-col>
                            <van-col span="24" class="xh-top-10" v-if="item.creditResult === 'pass'">
                            <span class="xh-success-tag">
                               银行征信通过
                            </span>
                            </van-col>
                            <van-col span="24" class="xh-top-10" v-else-if="item.creditResult === 'not_pass'">
                            <span class="xh-danger-tag">
                               银行征信未通过
                            </span>
                            </van-col>
                            <van-col span="24" class="xh-top-10" v-if="item.bigDataResult === 'pass'">
                            <span class="xh-success-tag">
                               大数据征信通过
                            </span>
                            </van-col>
                            <van-col span="24" class="xh-top-10" v-else-if="item.bigDataResult === 'not_pass'">
                            <span class="xh-danger-tag">
                               大数据征信未通过
                            </span>
                            </van-col>
                            <van-col span="24" class="xh-top-10" v-if="item.personalGuaResult === 'pass'">
                            <span class="xh-success-tag">
                               人保征信通过
                            </span>
                            </van-col>
                            <van-col span="24" class="xh-top-10" v-else-if="item.personalGuaResult === 'not_pass'">
                            <span class="xh-danger-tag">
                               人保征信未通过
                            </span>
                            </van-col>
                        </van-row>
                        <template v-slot:footer>
                            <div style="text-align:right; min-height: 2rem">
                                <span v-for="(i, index) in buttonList" style="margin-left: 0.12rem" :key='index'>
                                  <van-button
                                        v-if="i.buttonId !== '1'"
                                        plain
                                        size="small"
                                        type="danger"
                                        class="xh-radius"
                                        style="border-radius: 6px;"
                                        @click.stop="startForm(item, i)"
                                    >{{i.buttonName}}
                                  </van-button>
                                  <template v-else-if="item.status === '01' || item.status === '-1' || item.status === '04' || item.status === '03'">
                                      <van-button
                                              v-if="item.status === '01' || item.status === '-1'"
                                              plain
                                              size="small"
                                              type="danger"
                                              class="xh-radius"
                                              style="border-radius: 6px;"
                                              @click.stop="startForm(item, i)"
                                        >{{i.buttonName}}
                                        </van-button>
                                        <van-button
                                                  v-else-if="item.status === '04' || item.status === '03'"
                                                  plain
                                                  size="small"
                                                  type="danger"
                                                  class="xh-radius"
                                                  style="border-radius: 6px;"
                                                  @click.stop="startFormAgain(item)"
                                          >重新发起征信
                                        </van-button>
                                  </template>
                                </span>
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
                        @click="addClint"
                >新增客户
                </van-button>
            </div>
        </div>
    </ViewPage>
</template>

<script>
  import Vue from "vue";
  import { getList, getButtonList, checkedReregisterMob } from "@/api/credit";
  // 自定义组件
  import ViewPage from "@/layout/components/ViewPage";
  import Card from "@/components/card/index";
  import { removeValue } from '@/utils/session'
  // 其他组件
  import { Row, Col, Icon, Cell, Button, List, Search, PullRefresh, Toast } from "vant";

  const Components = [Row, Col, Icon, Cell, Button, List, Search, PullRefresh, Toast];

  Components.forEach(item => {
    Vue.use(item);
  });
  import { mapState } from "vuex";

  export default {
    name: 'creditList',
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
          searchKey: '',
          status: ''
        },
        buttonList: []
      };
    },
    computed: {
      // 所有字典
      ...mapState({
        wordbook: state => state.user.wordbook,
      }),
      cuCreditStatus () {
        return [{label: '全部', value: ''}, ...this.wordbook.cu_credit_status] || []
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
        getList(this.params).then(res => {
          const {code, data, msg} = res;
          data.result.forEach(t => {
            this.list.push(t);
          });
          // 加载状态结束
          this.params.pageIndex++;
          // 数据全部加载完成
          this.finished = this.list.length === data.totalCount;
          this.loading = false;
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
        this.params.status = '';
        this.onSearch();
      },
      startFormFn (item, query = {edit: false}, path = '/bigDataQueryDetail') {
        this.$router.push({path, query: {lpCertificateNum: item.lpCertificateNum, id: item.id, ...query}})
      },
      // 发起报单
      startForm (item, type, query = {}) {
        removeValue("credit");
        const goPageCredit  = () => {
          this.$router.push({path: '/reNewCredit', query: {lpCertificateNum: item.lpCertificateNum, id: item.id, edit: true, ...query}})
        }
        switch (type.buttonId) {
          case '1': goPageCredit()
          break;
          case '2': this.startFormFn(item, {edit: true, bigData: true})
          break;
          case '3': this.startFormFn(item, {edit: true, rbCredit: true}, '/rbDetail')
          break;
        }
      
      },
      // 重新发起
      async startFormAgain (item) {
        try {
          await checkedReregisterMob({lpCertificateNum: item.lpCertificateNum})
          this.startForm(item, {buttonId: '1'} ,{again: true})
        } catch (e) {
          console.log(e)
        }
      },
      // 新建客户
      addClint () {
        this.$router.push({
          path: '/creatCustomer',
        })
      },
      rightFn (item) {
        this.params.status = item.value
        this.onSearch()
      },
      //下拉刷新
      onRefresh () {
        this.list = []
        this.params.pageIndex = 1
        if (this.finished) {
          this.finished = false
        } else {
          this.onLoad()
        }
        setTimeout(() => {
          Toast.success('刷新成功');
        }, 500);
      },
      async getButtonList() {
        try {
          const {data} = await getButtonList()
          this.buttonList = data
        }catch (e) {
          console.log(e)
        }
      }
    },
    mounted () {
      this.onLoad();
      this.getButtonList();
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
