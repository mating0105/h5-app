// 审批记录
<template>
  <div>
    <Card v-for="item in recordList" style="margin-top:10px;">
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
  </div>
</template>
<script>
import Vue from "vue";
import { Row, Col, Cell, CellGroup } from "vant";
import Card from "@/components/card/index";
import { approvalRecord } from "@/api/payment";
import { format } from "@/utils/format";
import { mapState } from "vuex";
const Components = [Row, Col, Cell, CellGroup];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    Card
  },
  data() {
    return {
      recordList: []
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
        businessKey: this.params.info.businessKey,
        businessType: this.params.info.businessType
      };
      approvalRecord(data).then(res => {
        this.recordList = res.data;
        this.recordList.forEach(e => {
          e.createDate = format(new Date(e.createDate), "yyyy-MM-dd");
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
    debugger
    if(this.$route.query.dealState && this.$route.query.info) {
      this.params = {
        info: this.getStringToObj(this.$route.query.info),
        dealState: this.$route.query.dealState
      };
    } else {
      this.params.info = this.requestParams
    }
    this.loadRecord(); //加载审批记录
  }
};
</script>
<style>
.xh-approval-name {
  padding: 0 14px;
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
