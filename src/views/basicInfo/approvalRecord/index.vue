// 审批记录
<template>
  <div class="xh-approval">
    <Card v-for="item in recordList" style="margin-top:10px;" v-if="recordList.length > 0">
      <van-row>
        <van-col class="xh-approval-name">
          <span>{{item.name}}</span>
          {{item.processedRole}}
        </van-col>
      </van-row>
      <van-cell-group :border="false">
        <van-cell title="时间:" :value="item.createDate" />
      </van-cell-group>
      <van-cell-group :border="false">
        <van-cell title="流程类型:" :value="returnText('business_type',item.businessType)" />
      </van-cell-group>
      <van-cell-group :border="false">
        <van-cell title="意见描述:" :value="item.commentsDesc" />
      </van-cell-group>
    </Card>
    <div v-if="recordList.length < 1"><van-divider>暂无操作记录</van-divider></div>
  </div>
</template>
<script>
import Vue from "vue";
import { Row, Col, Cell, CellGroup,Divider } from "vant";
import Card from "@/components/card/index";
import { approvalRecord } from "@/api/payment";
import { format } from "@/utils/format";
import { mapState } from "vuex";
const Components = [Row, Col, Cell, CellGroup,Divider];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    Card
  },
  data() {
    return {
      recordList: [],
      params: {}
    };
  },
  props: {
    requestParams: {
      // {businessKey:'xxx',businessType:'xxxx'}
      default: () => {
      }
    },
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  methods: {
    loadRecord() {
      let data = {
        businessKey: this.params.info.businesskey ? this.params.info.businesskey: (this.params.info.businessKey ? this.params.info.businessKey : (this.params.info.id? this.params.info.id:this.params.info.payInfoId)),
        businessType: this.params.info.businessType
      };
      approvalRecord(data).then(res => {
        this.recordList = res.data;
        this.recordList.forEach(e => {
          e.createDate = format(new Date(e.createDate), "yyyy-MM-dd hh:mm:ss");
        });
      });
    },
    returnText(n,val) {
      let name;
      this.wordbook[n].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    }
  },
  mounted() {
    if(this.$route.query.dealState && this.$route.query.info) {
      this.params = {
        info: this.getStringToObj(this.$route.query.info),
        dealState: this.$route.query.dealState
      };
      console.log(this.params)
    } else {
      this.params.info = this.requestParams
      console.log(this.params)
    }
    this.loadRecord(); //加载审批记录
  }
};
</script>
<style>
.xh-approval .van-cell{
  padding:1px 14px;
}
.xh-approval-name {
  padding: 5px 14px;
  color: #ee0a24;
  margin: 5px 0;
}
.xh-approval-name span {
  font-size: 20px;
}
.xh-approval-time {
  margin-top: 7px;
  margin-bottom: 5px;
  color: #7d7e80;
}
</style>
