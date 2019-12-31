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
        <iframe
                id="iframepage"
                src="http://dev.wwvas.com:10001/#/installOrderList?loanAmount=100000.00&prodqty=undefined&insurance=undefined&ownername=林顺辉&idcard=511021197206082828&mobile=13158585858&contactname=向召&contactmobile=null&vehiclecategory=2&vehicletype=乘用车&model=1&price=200000.00&showTitle=false&externalid=XM201912271820&externalcustnum=undefined&externalvehicleid=201912271923&username=18349309486"
                frameborder="0"
                scrolling="auto"
                width="100%"
                :height="heightPage"
        ></iframe>
        <van-uploader style='margin-top: 1rem;' v-model="fileList" multiple/>
    </ViewPage>
</template>

<script>
  import Vue from "vue";
  import ViewPage from "@/layout/components/ViewPage";
  import Card from "@/components/card/index";
  import { gpsList, GPS_URL } from "@/api/payment";
  import { mapState } from "vuex";
  import Cookies from "js-cookie";
  import { getToken } from '@/utils/auth'
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
        accout: "",
        isLoading: false,
        token: getToken(),
        userName:'',
        loginName:'',
        cookieKeys:{},
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
                    t.pgslist = [];
                    break;
                  case "6":
                    t.gpsname = "订单完成";
                    if (t.insurance == "1") {
                      // t.pgslist = ["查看电子保单"];
                    } else {
                      t.pgslist = [];
                    }
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
        const chassisNumber = item.chassisNumber || ''
        let commonData = `&showTitle=false&externalid=${item.projectNo}&externalcustnum=${item.customNum}&externalvehicleid=${item.id}&username=${this.accout}&capital=${item.capital}&impvin=${chassisNumber}&type=xh_h5`;
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
              this.$prefixurl+
              `repairOrderList?&notRepair=true&orderId=${item.orderId}` +
              commonData;
            break;
          case "完善盗抢险":
            url = this.$prefixurl + `insurance?id=${item.orderId}` + commonData;
            break;
          case "查看电子保单":
            url = this.$prefixurl + `elePolicy?id=${item.orderId}` + commonData;
            break;
          default:
            break;
        }
        this.$store.dispatch("user/gspUrl", url);
        // this.$router.push({
        //   name: "Gpsurl"
        // });
        window.location.replace(url);
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
      }
    },
    mounted() {
      this.accout = Cookies.get("loginName");
      this.userName=Cookies.get('name');
      this.loginName=Cookies.get('loginName');
      this.cookieKeys=Cookies.get();
      // this.accout = '15881033156';
      // this.onLoad();
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
