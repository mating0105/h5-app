<template>
    <div class="xh-page-body">
      <Card>
        <template v-slot:header>
          豆腐干豆腐 
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
    </div>
</template>

<script>
import Vue from "vue";
import {
  Cell,
  CellGroup
} from "vant";
import Card from "@/components/card/index";
const Components = [
  Cell,
  CellGroup
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
    data(){
      return {
        contactlist: [],
      }
    },
    components: {
      Card
    },
    methods: {
      loadData(params){
        let dataList = {
          customerId: params.customerId,
        };
        requestUrl.getList('/carloan/cuEmergencyContactService/findEmergencyContact', dataList).then( (res) => {
          if(res.data.code == 'SYS.200'){
            this.contactlist = res.data.data.list;
          } else {
            this.$toast({
              position: 'top',
              message: '数据获取失败',
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    mounted(){
    },
  }
</script>

<style lang="scss">
  .xh-contact-body {
    .van-cell {
      padding: 5px 0;
    }
  }
</style>
