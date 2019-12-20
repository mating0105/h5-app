<!--
 * @Description: 重权管理 - 基本信息
 * @Author: shenah
 * @Date: 2019-12-18 16:07:43
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-20 19:57:22
 -->

<template>
  <div class="basic">
    <Card class="xh-top-10">
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell>
            <span>客户信息</span>
          </van-cell>
        </section>
      </template>
      <van-row class="form-content">
        <van-col span="24">
          <van-cell
            :value="details.customerName"
            class="info"
            title="客户姓名:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.certificateNum"
            class="info"
            title="证件号码:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.contactPhone"
            class="info"
            title="手机号码:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.creditObjectType | codeInToName(wordbook.credit_object_type)"
            class="info"
            title="征信对象类型"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.dsbrPltfrmNm"
            class="info"
            title="银行:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.intentionPrice"
            class="info"
            title="意向贷款金额(元):"
          />
        </van-col>
      </van-row>
    </Card>

    <van-collapse
      class="xh-fold-panel is-always-shadow"
      v-model="activeName"
    >
      <van-collapse-item
        name="car"
        title="车辆信息"
        title-class="left-title"
      >
        <van-row
          :key="index"
          class="xh-fold-panel-item"
          v-for="(item,index) in details.cars"
        >
          <van-col span="24">
            <van-cell
              :value="item.carNatureDesc"
              class="info"
              title="车辆性质:"
            />
          </van-col>
          <van-col span="24">
            <van-cell
              :value="item.carFrameNum"
              class="info"
              title="车架号:"
            />
          </van-col>
          <van-col span="24">
            <van-cell
              :value="item.automarke"
              class="info"
              title="车辆品牌:"
            />
          </van-col>
          <van-col span="24">
            <van-cell
              :value="item.carSeries"
              class="info"
              title="车系"
            />
          </van-col>
          <van-col span="24">
            <van-cell
              :value="item.carModel"
              class="info"
              title="车辆型号"
            />
          </van-col>
          <van-col span="24">
            <van-cell
              :value="item.estimateOriginalPrice"
              class="info"
              title="评估价:"
            />
          </van-col>
          <van-col span="24">
            <van-field
              :border="false"
              class="info"
              input-align="right"
              label="实际开票价(元):"
              label-width="120"
              name
              placeholder="请输入"
              required
              type="number"
              v-model="item.actualInvoicedPrice"
            />
          </van-col>
          <van-col span="24">
            <van-cell
              class="info"
              required
              title="车牌号:"
            >
              <licensePlateNum v-model="item.licensePlateNum"></licensePlateNum>
            </van-cell>
          </van-col>
          <van-col span="24">
            <van-field
              :border="false"
              class="info"
              input-align="right"
              label="发动机号:"
              name
              placeholder="请输入"
              required
              v-model="item.engineNum"
            />
          </van-col>
          <van-col span="24">
            <van-field
              :border="false"
              @click="dateRowClick('insuranceExpire','保险到期日','cars',index)"
              class="info"
              input-align="right"
              is-link
              label="保险到期日:"
              label-width="120"
              name
              placeholder="请选择"
              readonly
              required
              v-model="item.insuranceExpire"
            />
          </van-col>
          <van-col span="24">
            <van-divider />
          </van-col>
        </van-row>
      </van-collapse-item>
    </van-collapse>

    <Card class="xh-top-10">
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell>
            <span>重权信息</span>
          </van-cell>
        </section>
      </template>
      <van-row class="xh-right-info">
        <van-col
          class="form-content xh-black xh-relative xh-boder-left"
          span="24"
        >
          <section>
            <van-field
              :border="false"
              @click="dateRowClick('mortgageTime','办理抵押上牌日期')"
              class="info"
              input-align="right"
              is-link
              label="办理抵押上牌日期:"
              label-width="120"
              name
              placeholder="请选择"
              readonly
              required
              v-model="details.mortgageTime"
            />
          </section>
          <section>
            <van-field
              :border="false"
              class="info"
              clearable
              input-align="right"
              label="上户地点:"
              placeholder="请输入"
              required
              v-model="details.registeredPlace"
            />
          </section>
          <section>
            <van-field
              :border="false"
              @click="dateRowClick('transactionDate','交易日期')"
              class="info"
              input-align="right"
              is-link
              label="交易日期:"
              name
              placeholder="请选择"
              readonly
              required
              v-model="details.transactionDate"
            />
          </section>
          <section>
            <van-cell
              class="info"
              required
              title="是否有套票:"
            >
              <singleConnect
                :default-active-value="details.ispackage*1"
                :list="YESORNO"
                @singleChange="singleChange"
                type="ispackage"
              ></singleConnect>
            </van-cell>
          </section>
          <section>
            <van-field
              :border="false"
              @input="inputValue"
              class="info"
              input-align="right"
              label="套票成交价（元）:"
              label-width="120"
              name
              placeholder="请输入"
              required
              type="number"
              v-if="details.ispackage*1 === 1"
              v-model="details.packageDeal"
            />
          </section>
          <section>
            <van-field
              :border="false"
              class="info"
              input-align="right"
              label="与贷款金额差价（元）"
              label-width="140"
              name
              placeholder="自动计算"
              readonly
              required
              v-if="details.ispackage*1 === 1"
              v-model="details.differenceCarprice"
            />
          </section>
          <section>
            <van-cell
              class="info"
              required
              title="是否失信客户:"
            >
              <singleConnect
                :default-active-value="details.dishonestyCustomer*1"
                :list="YESORNO"
                @singleChange="singleChange"
                type="dishonestyCustomer"
              ></singleConnect>
            </van-cell>
          </section>
          <section>
            <van-field
              :border="false"
              @click="dateRowClick('ownershipRegisterDate','重权登记日期')"
              class="info"
              input-align="right"
              is-link
              label="重权登记日期:"
              name
              placeholder="请选择"
              readonly
              required
              v-model="details.ownershipRegisterDate"
            />
          </section>
        </van-col>
      </van-row>
    </Card>
    <!-- 时间选择器 -->
    <van-action-sheet
      class="xh-list"
      get-container="#app"
      v-model="datePopFlag"
    >
      <van-datetime-picker
        :formatter="formatter"
        :title="datePopTitle"
        @cancel="cancelTime"
        @confirm="confirmTime"
        type="date"
        v-model="currentDate"
      />
    </van-action-sheet>
    <!-- 保 存按钮 -->
    <div class="xh-submit xh-page-body">
      <van-button
        :loading="subLoading"
        @click.native="sub"
        class="xh-bg-main"
        size="large"
      >保 存</van-button>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
import Vue from "vue";
import { YESORNO } from "@/constants/dictionaries";
import {
  queryRightSuppleDetails,
  saveHeavyRightBasic
} from "@/api/heavyRightSupplement";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import SingleConnect from "@/components/SingleConnect/index";
import LicensePlateNum from "@/components/LicensePlateNum/index";

// 其他组件
import {
  Row,
  Col,
  Icon,
  Cell,
  Button,
  Collapse,
  CollapseItem,
  Divider,
  Field,
  ActionSheet,
  DatetimePicker,
  Toast
} from "vant";
const Components = [
  Row,
  Col,
  Cell,
  Button,
  Collapse,
  CollapseItem,
  Divider,
  Field,
  ActionSheet,
  DatetimePicker
];

Components.forEach(item => {
  Vue.use(item);
});
import { mapState } from "vuex";
import { log } from "util";
import { format } from "@/utils/format";
export default {
  name: "basic",
  components: { Card, SingleConnect, LicensePlateNum },
  computed: {
    ...mapState({
      wordbook: state => state.user.wordbook
    }),
    id() {
      return this.$route.params.id;
    }
  },
  data() {
    return {
      errorMsg:{
        differenceCarprice:'', // 与贷款金额差价（元）
        dishonestyCustomer:'', // 是否失信客户
        ownershipRegisterDate:'', // 重权登记日期
      },
      subLoading: false,
      currentDate: new Date(), // 当前日期
      dateIndex: "",
      dateArr: "",
      datePopTitle: "", // 当前弹出框的名称
      datePopFlag: false, // 时间选择器
      dateSelectType: "", // 当前选择时间的type
      YESORNO,
      activeName: ["car"],
      details: {}
    };
  },
  props: {},
  mounted() {
    this.queryDetails();
  },
  methods: {
    singleChange({ type, item }) {
      this.details[type] = item.value;
    },
    // 查询补录的详情
    queryDetails() {
      this.toast = Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
        overlay: true
      });
      queryRightSuppleDetails({
        projectId: this.id
      })
        .then(res => {
          const { code, data, msg } = res;
          if (code == 200) {
            this.details = data;
          } else {
            this.$notify({ type: "danger", message: msg });
          }
          Toast.clear(this.toast);
        })
        .catch(() => {
          Toast.clear(this.toast);
        });
    },
    formatter(type, value) {
      if (type == "year") {
        return `${value}年`;
      } else if (type == "month") {
        return `${value}月`;
      } else if (type == "day") {
        return `${value}日`;
      }
    },
    // 正在输入的时候
    inputValue(value) {
      // 与贷款金额的差价 = 套票成交价-贷款金额
      this.details.packageDeal = value;
      if (value) {
        if (this.details.differenceCarprice) {
          this.details.differenceCarprice = value * 1 - this.details.loanAmt;
        } else {
          this.details.differenceCarprice = value;
        }
      } else {
        this.details.differenceCarprice = "";
      }
    },
    dateRowClick(type, title, arrStr, index) {
      this.datePopTitle = title;
      this.datePopFlag = true;
      this.dateSelectType = type;
      this.dateArr = arrStr;
      this.dateIndex = index;
      if (arrStr) {
        let nowValue = this.details[this.dateArr][this.dateIndex][
          this.dateSelectType
        ];
        this.currentDate = nowValue ? new Date(nowValue) : new Date();
      } else {
        this.currentDate = this.details[type]
          ? new Date(this.details[type])
          : new Date();
      }
    },
    // 确认时间选择
    confirmTime(value) {
      var time = format(value, "yyyy-MM-dd");
      if (this.dateArr) {
        this.details[this.dateArr][this.dateIndex][this.dateSelectType] = time;
      } else {
        this.details[this.dateSelectType] = time;
      }
      this.datePopFlag = false;
    },
    // 提交表单
    sub() {
      if (this.details.ispackage * 1 !== 1) {
        this.details.packageDeal = "";
        this.details.differenceCarprice = "";
      }
      this.subLoading = true;
      saveHeavyRightBasic(this.details)
        .then(res => {
          const { code, data, msg } = res;
          if (code == 200) {
            this.$notify({ type: "success", message: msg });
            // this.goBack();
          } else {
            this.$notify({ type: "danger", message: msg });
          }
          this.subLoading = false;
        })
        .catch(() => {
          this.subLoading = false;
        });
    },
    cancelTime() {
      this.datePopFlag = false;
    }
  }
};
</script>
<style lang='scss' scoped>
.basic {
  .form-content {
    padding: 10px 0;
  }
  .info {
    padding-top: 0;
    padding-bottom: 0.4rem;
  }
  .xh-fold-panel >>> .van-collapse-item__content {
    padding: 10px 0 0 0;
  }
  .xh-plus {
    span {
      color: rgb(196, 37, 42);
    }
  }
}
</style>