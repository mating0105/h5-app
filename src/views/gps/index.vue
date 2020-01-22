<template>
  <ViewPage
    :goPage="rightFn"
    iconClass="ellipsis"
    :rightMenuList="cuCreditStatus"
    :backFn="closeNativeWebView"
    :scroll="true"
  >
    <template v-slot:head>
      <van-search v-model="params.searchKey" placeholder="请输入客户名称" show-action @search="onSearch" />
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
        <div v-for="(item,index) in list" :key="index" :title="item" class="van-clearfix">
          <Card class="xh-top-10" :bodyPadding="true">
            <template v-slot:header>
              <section class="xh-plus">
                <van-cell :title="item.projectNo" :value="item.gpsname" icon="notes-o"></van-cell>
              </section>
            </template>
            <van-row>
              <van-col span="24">客户名称：{{item.customerName}}</van-col>
              <van-col span="24" class="xh-top-10">身份证：{{item.idcard}}</van-col>
              <van-col span="24" class="xh-top-10">手机号码：{{item.mobile}}</van-col>
            </van-row>
            <template v-slot:footer>
              <div style="text-align:right;">
                <van-button
                  v-for="btn in item.pgslist"
                  plain
                  type="danger"
                  class="xh-radius"
                  style="border-radius: 6px;margin-left:5px;"
                  v-show="btn"
                  @click="gpsUrl(btn,item)"
                >{{btn}}</van-button>
              </div>
            </template>
          </Card>
        </div>
      </van-list>
    </van-pull-refresh>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import { gpsList, GPS_URL } from "@/api/payment";
import { mapState } from "vuex";
import Cookies from "js-cookie";
import { getToken } from "@/utils/auth";
import {
  Row,
  Col,
  Icon,
  Cell,
  Button,
  List,
  Search,
  Toast,
  PullRefresh
} from "vant";
const Components = [
  Row,
  Col,
  Icon,
  Cell,
  Button,
  List,
  Search,
  Toast,
  PullRefresh
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    ViewPage,
    Card
  },
  data() {
    return {
      list: [],
      loading: false,
      error: false,
      finished: false,
      params: {
        pageIndex: 1,
        pageSize: 10
      },
      accout: "", //用户账号
      phone: "", //用户手机号
      isLoading: false
    };
  },
  computed: {
    ...mapState({
      name: state => state.user.name,
      wordbook: state => state.user.wordbook
    }),
    cuCreditStatus() {
      return (
        [{ label: "全部", value: "" }, ...this.wordbook.WW_GPS_IS_DONE] || []
      );
    }
  },
  methods: {
    onSearch() {
      this.list = [];
      this.finished = false;
      this.params.pageIndex = 1;
      this.onLoad();
    },
    onLoad() {
      this.loading = !this.isLoading;
      gpsList(this.params).then(res => {
        if (res.code == 200) {
          setTimeout(() => {
            res.data.result.forEach(t => {
              switch (t.gpsIsDone) {
                case "-1":
                  t.gpsname = "待申请";
                  t.pgslist = ["申请安装"];
                  break;
                case "1":
                  t.gpsname = "待派单";
                  t.pgslist = ["订单修改"];
                  break;
                case "2":
                  t.gpsname = "待接单";
                  t.pgslist = ["订单修改"];
                  break;
                case "3":
                  t.gpsname = "待施工";
                  t.pgslist = ["订单修改"];
                  break;
                case "4":
                  t.gpsname = "施工中";
                  t.pgslist = ["订单修改"];
                  break;
                case "5":
                  t.gpsname = "保险待出单";
                  t.pgslist = ["查看详情"];
                  break;
                case "6":
                  t.gpsname = "安装完成";
                  t.pgslist = ["查看详情"];
                  break;
                case "0":
                  t.gpsname = "订单作废";
                  t.pgslist = [];
                  break;
                case "-9":
                  t.gpsname = "订单作废(删除车辆)";
                  t.pgslist = [];
                  break;
                case "10":
                  t.gpsname = "拆除-待接单";
                  t.pgslist = [];
                  break;
                case "20":
                  t.gpsname = "拆除-待接单";
                  t.pgslist = [];
                  break;
                case "30":
                  t.gpsname = "拆除-待施工";
                  t.pgslist = [];
                  break;
                case "40":
                  t.gpsname = "拆除-施工中";
                  t.pgslist = [];
                  break;
                case "60":
                  t.gpsname = "拆除-订单完成";
                  t.pgslist = [];
                  break;
                case "70":
                  t.gpsname = "拆除-订单取消";
                  t.pgslist = [];
                  break;
              }
              this.list.push(t);
            });
            // 加载状态结束
            this.loading = false;
            this.isLoading = false;
            this.params.pageIndex++;
            // 数据全部加载完成
            if (this.list.length == res.data.totalCount) {
              this.finished = true;
            } else {
              this.finished = false;
            }
          }, 500);
        } else {
          this.$notify({ type: "danger", message: msg });
          this.loading = false;
        }
      });
    },
    gpsUrl(name, item) {
      let url = "";
      let insurance;
      if (item.thiefRescue != null && item.thiefRescue != "2") {
        insurance = "1";
      } else {
        insurance = "0";
      }
      const chassisNumber = item.chassisNumber || "";
      let commonData = `&showTitle=false&externalid=${item.projectNo}&externalcustnum=${item.customNum}&externalvehicleid=${item.id}&username=${this.accout}&capital=${item.capital}&impvin=${chassisNumber}&xhphonenum=${this.phone}&type=xh_h5`;
      switch (name) {
        case "申请安装":
        // let param = `loanAmount=${item.loanAmount}&prodqty=${item.gpsnums}&insurance=${insurance}&ownername=${item.customerName}&idcard=${item.idcard}&mobile=${item.mobile}&contactname=${item.contactname}&contactmobile=${item.contactmobile}&vehiclecategory=${item.vehiclecategory}&vehicletype=${item.vehicletype}&model=${item.model}&price=${item.price}`;
        // url = this.GPS_URL + "installOrderList?" + param + commonData;
        // break;
        case "申请加装":
          let param = `loanAmount=${item.loanAmount}&prodqty=${item.gpsnums}&insurance=${insurance}&ownername=${item.customerName}&idcard=${item.idcard}&mobile=${item.mobile}&contactname=${item.contactname}&contactmobile=${item.contactmobile}&vehiclecategory=${item.vehiclecategory}&vehicletype=${item.vehicletype}&model=${item.model}&price=${item.price}`;
          url = this.$prefixurl + "installOrderList?" + param + commonData;
          break;
        case "订单修改":
          url =
            this.$prefixurl +
            `modifyOrder?&loanAmount=${item.loanAmount}&id=${item.orderId}` +
            commonData;
          break;
        case "申请拆除":
          url =
            this.$prefixurl +
            `repairOrderList?&notRepair=true&orderId=${item.orderId}` +
            commonData;
          break;
        case "完善盗抢险":
          url = this.$prefixurl + `insurance?id=${item.orderId}` + commonData;
          break;
        case "查看电子保单":
          url = this.$prefixurl + `elePolicy?id=${item.orderId}` + commonData;
          break;
        case "查看详情":
          url = `${this.$prefixurl}orderDetail?id=${item.orderId}&showTitle=false&externalid=${item.projectNo}&externalcustnum=${item.customNum}&username=${this.accout}&xhphonenum=${this.phone}&type=xh_h5`;
          break;
        default:
          break;
      }
      通知移动端加载gps安装页面
      this.$bridge.callHandler("loadUrl", url, data => {
        this.onLoad();
      });
      // window.location.href = url;
    },
    rightFn(item) {
      this.list = [];
      this.params.pageIndex = 1;
      this.params.status = item.value;
      this.onLoad();
    },
    //下拉刷新
    onRefresh() {
      this.list = [];
      this.params.pageIndex = 1;
      if (this.finished) {
        this.finished = false;
      } else {
        this.onLoad();
      }
      setTimeout(() => {
        Toast.success("刷新成功");
      }, 500);
    },
  },
  mounted() {
    this.accout = Cookies.get("loginName");
    this.phone = Cookies.get("phone");
    // this.accout = '0170';
    // this.phone = '13200000002'
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
