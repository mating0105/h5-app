<template>
  <ViewPage>
    <Card>
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="家庭收入">
            <van-icon slot="right-icon" name="plus" style="line-height: inherit;" />
          </van-cell>
        </section>
      </template>
      <van-row class="xh-row">
        <van-col span="24" class="xh-row-col xh-top-10"
          v-for="(i,index) in guarantorList"
          :key="index"
          @click="pushUrl(i)"
        >
          <van-swipe-cell :right-width="120">
            <div class="xh-form-body">
              <van-cell-group>
                <van-cell title="担保人姓名：" :value="i.customerName" />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="证件号码：" :value="i.certificateNum" />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="是否共债人：" :value="i.isBondsDesc" />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="与客户关系：" :value="i.relationCusDesc" />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="担保人联系电话：" :value="i.contactPhone" />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="婚姻状况：" :value="i.marriageDesc" />
              </van-cell-group>
              <van-cell-group>
                <van-cell title="户籍地址：" :value="i.pProvCityZon" />
              </van-cell-group>
            </div>
            <van-row slot="right" class="xh-swipe-btn">
              <div class="xh-col-12 xh-swipe-edit" @click="edit(i.id)">编辑</div>
              <div class="xh-col-12 xh-swipe-delete" @click="deleteThis(i.id)">删除</div>
            </van-row>
          </van-swipe-cell>
        </van-col>
      </van-row>
    </Card>
  </ViewPage>
</template>

<script>
import Vue from "vue";
// 自定义组件
import Card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
// 其他组件
import { Row, Col, Icon, Cell, SwipeCell } from "vant";
const Components = [Row, Col, Icon, Cell, SwipeCell];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    Card,
    ViewPage
  },
  data() {
    return {
      guarantorList: [
        { name: 1 }
      ],
      projectId: "",
      params: {}
    };
  },
  methods: {
    loadData(params) {
      let dataList = {
        customerNum: params.customerNum,
        projectId: params.projectId
      };
      requestUrl
        .getList("/order/cuGuarantee/findCuGuaranteeDetail", dataList, "soa")
        .then(res => {
          if (res.data.code == 200) {
            let {
              cuGuaranteeIncome,
              cuGuaranteeHouseList,
              cuGuaranteeList
            } = res.data.data;
            cuGuaranteeList.forEach(t => {
              t.isBondsDesc = returnName(t.isBonds, publicList.yes_no);
              t.relationCusDesc = returnName(
                t.relationCus,
                publicList.relation_Cus
              );
              t.marriageDesc = returnName(t.marriage, publicList.marriage_type);
            });
            this.guarantorList = cuGuaranteeList;
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    pushUrl(i) {
      urls = "zhgjApp/page/projectDeclaration/infoGuarantor.html?id=" + i.id;
      bridge.loadurlwithmobile({ url: urls });
    },
    //新增
    addBtn() {
      bridge.loadurlwithmobile({
        url:
          "zhgjApp/page/zy/guarantorInfo/addAssure.html?projectId=" +
          this.projectId
      });
    },
    //编辑
    edit(id) {
      bridge.loadurlwithmobile({
        url:
          "zhgjApp/page/zy/guarantorInfo/addAssure.html?id=" +
          id +
          "&projectId=" +
          this.projectId +
          "&customerNum" +
          this.params.customerNum
      });
    },
    //删除
    deleteThis(id) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确认删除此担保人吗？"
        })
        .then(() => {
          var dataList = {
            id: id
          };
          requestUrl
            .getList("/carloan/projProjectInfo/deleteCuGuarantee", dataList)
            .then(res => {
              if (res.data.code == "SYS.200") {
                this.$toast.success("删除成功");
                location.reload();
              } else {
                this.$toast(res.message);
              }
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    // var params = commonFun.urlParam(location.search);
    // token = params.token;
    // this.projectId = params.projectId;
    // this.params = params;
    // publicData();
    // this.loadData(params);
  }
};
</script>
