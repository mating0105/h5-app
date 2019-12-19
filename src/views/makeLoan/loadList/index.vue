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
                                            <van-cell :title="returnText('business_type',item.businesstype)" icon="after-sale"></van-cell>
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
        var newParams=(value)=>{
            let obj={};
            obj.id=47;//value.businesskey;
            return obj
        };
        return {
            listData:[],
            tabList:[
                {name:'待办',value:'3'},
                {name:'已办',value:'1'}
            ],
            active:'3',//待办
            loading: false,
            listLoading:false,
            isLoading: false,
            error: false,
            finished: false,
            alreadyDone:'',
            pageData:{
                searchKey:'',
                status:3,// 待办：3 已办：1
                pageSize:10,
                pageIndex:1,
            },
            dictionaryData:{},//字典数据
            info:{},
            pathData:[
                {name:'银行放款',path:'/lendProcess',params:newParams},
                {name:'征信调查',path:'/bigDataQueryDetail',params:{edit:true,lpCertificateNum:'530423199502263320',id:'191204537544'}},
            ]
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
        returnText(n, val) {
            let name;
            this.dictionaryData[n].forEach(e => {
                if (e.value == val) {
                    name = e.label;
                }
            });
            return name;
        },
        // 发起放款
        applyPay(val) {
            this.info=val;
            this.returnPath(this.returnText('business_type',val.businesstype))
        },
        returnPath(value){
            this.pathData.forEach((item,index)=>{
                if(item.name==value){
                    this.$router.push({
                        path:item.path,
                        query:item.params(this.info)
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
