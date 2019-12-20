<template>
  <div>
    <van-tabs v-model="active" @change='changeState' swipeable>
        <div v-for="item in tabList" :key="item.value">
            <van-tab :title="item.name" :name="item.value">
                <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                    <div class="wrapper" ref="wrapper" style="margin:10px;">
                        <van-search placeholder="搜索" v-model="pageData.searchKey" input-align='left' clearable @blur.click="onSearch"/>
                        <van-list 
                        v-model="loading" 
                        :finished="finished"
                        finished-text="没有更多了"
                        :error.sync="error" 
                        error-text="请求失败，点击重新加载" 
                        @load="onLoad">
                            <div v-for="(item,index) in listData" :key="'loadList'+index" :title="item">
                                <Card class="xh-top-10">
                                    <template v-slot:header>
                                        <section class="xh-plus">
                                            <van-cell :title="returnText(dictionaryData,'business_type',item.businesstype)"  icon="after-sale"></van-cell>
                                        </section>
                                    </template>
                                    <van-row style="padding:10px 10px 20px;line-height:22px;" @click="applyPay(item)">
                                        <van-col span="24">
                                            项目编号：{{item.projectNum}}
                                        </van-col>
                                        <van-col span="10" class="xh-top-10">
                                            客户名称：{{item.customerName}}
                                        </van-col>
                                        <van-col span="14" class="xh-top-10" style="text-align:right;">
                                            {{item.createDate}}
                                        </van-col>
                                    </van-row>
                                </Card>
                            </div>
                        </van-list>
                    </div>
                </van-pull-refresh>
            </van-tab>
        </div>
    </van-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import Card from "@/components/card/index";
import { findList } from '@/api/makeLoan.js'
import { getDic } from "@/api/createCustomer";
// 其他组件
import { Row, Col, Icon, Cell, List,Tab, Tabs,Search,PullRefresh,Toast} from "vant";
const Components = [Row, Col, Icon, Cell,List,Tab, Tabs,Search,PullRefresh,Toast];

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
        var newParams=(value,status)=>{
            //value:当前item  status:待办:1,已办:3
            let obj={};
            obj.info=value;
            obj.dealState=status;
            return obj
        };
        return {
            listData:[],
            tabList:[
                {name:'待办',value:'1'},
                {name:'已办',value:'3'}
            ],
            active:'1',//待办
            loading: false,
            listLoading:false,
            isLoading: false,
            error: false,
            finished: false,
            alreadyDone:'',
            pageData:{
                searchKey:'',
                status:1,// 待办：1 已办：3
                pageSize:10,
                pageIndex:1,
            },
            dictionaryData:{},//字典数据
            //待办跳转对应页面数据
            dealWithData:{//待办页面跳转配置
                activityId:[
                    {label:'客户经理待办',value:'WF_PROJ_APPR_01_T01',processName:'审批流程'},
                    {label:'内勤待办',value:'WF_PROJ_APPR_01_T04',processName:'审批流程'},
                    {label:'审批官待办',value:'WF_PROJ_APPR_01_T52',processName:'审批流程'},
                    {label:'业务人员待办',value:'WF_CAPTURE_001_T001',processName:'走款流程'},
                    {label:'财务走款确认待办',value:'WF_CAPTURE_001_T002',processName:'走款流程'},
                    {label:'客户经理待办',value:'WF_CU_CREDIT_001_T001',processName:'征信流程'},
                    {label:'驻行人员待办',value:'WF_CU_CREDIT_001_T003',processName:'征信流程'},
                    {label:'合规文员待办',value:'WF_BANK_MAKE_LOAN_001_T002',processName:'放款流程'},
                    {label:'驻行内勤待办',value:'WF_BANK_MAKE_LOAN_001_T004',processName:'放款流程'}
                ]
            },
            info:{},
            pathData:{
                //待办路径
                dealwith:[
                    {name:'客户经理待办',path:'/a',params:newParams},
                    {name:'内勤待办',path:'/b',params:newParams},
                    {name:'审批官待办',path:'/c',params:newParams},
                    {name:'业务人员待办',path:'/applyPayment',params:newParams},
                    {name:'财务走款确认待办',path:'/paymentSure',params:newParams},
                    {name:'客户经理待办',path:'/f',params:newParams},
                    {name:'驻行人员待办',path:'/g',params:newParams},
                    {name:'合规文员待办',path:'/h',params:newParams},
                    {name:'驻行内勤待办',path:'/m',params:newParams},
                ],
                //已办路径
                alreadyDone:[
                    {name:'银行放款',path:'/lendProcess',params:newParams},
                    {name:'征信调查',path:'/j',params:newParams},
                    {name:'车商补充资料',path:'/a',params:newParams},
                    {name:'重权回收',path:'/b',params:newParams},
                    {name:'出具抵押合同',path:'/c',params:newParams},
                    {name:'原单变更申请',path:'/d',params:newParams},
                    {name:'车易贷_征信调查',path:'/f',params:newParams},
                    {name:'项目审批',path:'/g',params:newParams},
                    {name:'缴费走款',path:'/paymentSure',params:newParams},
                    {name:'车商准入',path:'/i',params:newParams},
                ]
            }
        };
    },
    watch: {
      error (value) {
        if (!value) {
          this.onLoad()
        }
      }
    },
    methods: {
        onLoad () {
            this.loading = true;
            findList(this.pageData).then(res => {
                const {code, data, msg} = res;
                setTimeout(() => {
                    data.result.forEach(t => {
                        this.listData.push(t);
                    });
                    // 加载状态结束
                    this.loading = false;
                    this.pageData.pageIndex++;
                    // 数据全部加载完成
                    this.finished = this.listData.length === data.totalCount;
                }, 500);
            }).catch(() => {
                this.error = true
                this.loading = false
            });
        },
        onSearch(){
            this.listData = []
            this.finished = false
            this.pageData.pageIndex = 1
            this.onLoad();
        },
        //查字典
        //---------获取字典数据------------------
        async getDictionaryData () {
            try {
                let arr = [
                    "business_type",//银行
                    
                ];
                const data = await getDic(arr);
                if (data.code == 200) {
                    this.dictionaryData=data.data;
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 字典转换
        returnText(dataArr,n, val) {
            let name;
            dataArr[n].forEach(e =>{
                if (e.value == val) {
                    name = e.label;
                }
            })
            return name;
        },
        // 发起放款
        applyPay(val) {
            this.info=val;
            if(this.pageData.status==1){//待办
                this.returnPath(this.returnText(this.dealWithData,'activityId',val.activityId),'dealwith')
            }else{//已办
                this.returnPath(this.returnText(this.dictionaryData,'business_type',val.businesstype),'alreadyDone')
            } 
        },
        returnPath(value,n){
            this.pathData[n].forEach((item,index)=>{
                if(item.name==value){
                    this.$router.push({
                        path:item.path,
                        query:item.params(this.info,this.pageData.status)
                    });
                }
            })
        },
        changeState(val){
            this.pageData.status=Number(val);
            this.listData = []
            this.finished = false
            this.pageData.pageIndex = 1
            this.onLoad();
        },
        //下拉刷新
        onRefresh() {
            this.listData = []
            this.finished = false
            this.pageData.pageIndex = 1
            this.onLoad();
            setTimeout(() => {
                Toast.success('刷新成功');
                this.isLoading = false;
            }, 500);
        }
    },
    mounted(){
        this.getDictionaryData();
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
