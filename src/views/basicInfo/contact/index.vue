<template>
  <ViewPage>
    <Card>
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="紧急联系人">
            <van-icon
              slot="right-icon"
              name="plus"
              style="line-height: inherit;"
              @click="pathAdd"
            />
          </van-cell>
        </section>
      </template>
      <div class="xh-contact-body">
        <section>
          <van-cell title="紧急联系人名称：" value="i.emgrCtcpsnNm" />
        </section>
        <section>
          <van-cell title="与借款人关系：" value="i.withBrwrRelDesc" />
        </section>
        <section>
          <van-cell title="联系电话：" value="i.ctcTel" />
        </section>
      </div>
    </Card>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import Card from "@/components/card/index";
import ViewPage from '@/layout/components/ViewPage';
import {
  Row,
  Col,
  Icon,
  Cell
} from "vant";

const Components = [
  Row,
  Col,
  Icon,
  Cell
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  data() {
    return {
      contactlist: []
    };
  },
  components: {
    Card,
    ViewPage
  },
  methods: {
    loadData(params) {
      let dataList = {
        customerId: params.customerId
      };
      requestUrl
        .getList(
          "/carloan/cuEmergencyContactService/findEmergencyContact",
          dataList
        )
        .then(res => {
          if (res.data.code == "SYS.200") {
            this.contactlist = res.data.data.list;
          } else {
            this.$toast({
              position: "top",
              message: "数据获取失败"
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    pathAdd() {
      
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
  .xh-contact-body {
    .van-cell {
      padding: 5px 0;
    }
  }
</style>
