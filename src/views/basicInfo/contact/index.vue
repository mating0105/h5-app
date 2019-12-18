<template>
  <ViewPage>
    <Card>
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="联系人信息">
            <van-icon
              slot="right-icon"
              name="plus"
              style="line-height: inherit;"
              @click="addContact"
            />
          </van-cell>
        </section>
      </template>
      <div class="xh-row">
        <div v-for="(i,index) in contactlist" :key="index">
          <van-divider content-position="left">{{ '第'+ numberHun(index) +'联系人信息' }}</van-divider>
          <van-cell-group :border="false">
            <van-field
              :border="false"
              label-width="100px"
              name="emergencyContactName"
              v-model="i.emergencyContactName"
              clearable
              :required="index == 0"
              label="联系人名称："
              input-align="right"
              placeholder="请输入紧急联系人名称"
            />
            <van-field
              :border="false"
              label-width="100px"
              name="contactPhone"
              v-model="i.contactPhone"
              clearable
              :required="index == 0"
              label="联系人电话："
              input-align="right"
              placeholder="请输入联系人电话"
            />
            <van-cell
              :border="false"
              title="与借款人关系："
              :required="index == 0"
              is-link
              :value="i.borrowerRelationshipDesc"
              @click.native="loadList(index)"
            />
          </van-cell-group>
        </div>
      </div>
    </Card>

    <!-- 保 存按钮 -->
    <div class="xh-submit xh-page-body">
      <van-button
        size="large"
        class="xh-bg-main"
        :class="subDisabled ? 'buttonNoColor' : 'buttonColor'"
        :loading="subLoading"
        :disabled="subDisabled"
        @click.native="custSubmit"
      >保 存</van-button>
    </div>

    <!-- 下拉选择器 -->
    <van-action-sheet v-model="selectShow" class="xh-list">
      <van-picker
        show-toolbar
        title="与借款人关系"
        :columns="columns"
        :value-key="'label'"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-action-sheet>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import Card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import { mapState } from "vuex";
import { getContactInfo, setContactSave } from "@/api/client";
import { Row, Col, Icon, Cell, CellGroup, Field, Divider, ActionSheet, Picker, Button } from "vant";

const Components = [Row, Col, Icon, Cell, CellGroup, Field, Divider, ActionSheet, Picker, Button];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  data() {
    return {
      contactlist: [],
      params: {},
      selectShow: false,
      columns: [],
      ofKey: 0,
      subLoading: false,
      subDisabled: false
    };
  },
  components: {
    Card,
    ViewPage
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  methods: {
    // 字典转换
    returnText(n, val) {
      let name;
      this.wordbook[n].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    numberHun(n) {
      switch (n) {
        case 0:
          return '一';
          break;
        case 1:
          return '二';
          break;
        case 2:
          return '三';
          break;
      
        default:
          break;
      }
    },
    onCancel() {
      this.selectShow = false;
    },
    onConfirm(row) {
      this.contactlist[this.ofKey].borrowerRelationship = row.value;
      this.contactlist[this.ofKey].borrowerRelationshipDesc = row.label;
      this.selectShow = false;
    },
    // 添加联系人
    addContact() {
      let num = this.contactlist.length + 1;
      if(this.contactlist.length < 3) {
        this.contactlist.push({
          emergencyContactName: "",
          contactPhone: "",
          borrowerRelationshipDesc: "",
          borrowerRelationship: "",
          customerId: this.params.customerId,
          contactType: num
        });
      } else {

      }
    },
    // 获取数据
    loadData(params) {
      let dataList = {
        customerId: this.params.customerId
      };
      getContactInfo(dataList).then(res => {
        if (res.code == 200) {
          this.contactlist = res.data;
          this.contactlist.forEach(t => {
            t.borrowerRelationshipDesc = this.returnText('kinship_type', t.borrowerRelationship);
          });
        } else {
          this.$notify({ type: "danger", message: res.msg });
        }
      });
    },
    // 选择
    loadList(num) {
      this.columns = this.wordbook.kinship_type;
      this.selectShow = true;
      this.ofKey = num;
    },
    // 保存
    custSubmit() {
      if(this.contactlist.length < 1) {
        this.$notify({ type: 'warning', message: '紧急联系人至少一人' })
        return
      }
      setContactSave(this.contactlist).then(res => {
        if(res.code == 200) {
          this.$notify({ type: "success", message: res.msg });
        } else {
          this.$notify({ type: "danger", message: res.msg });
        }
      });
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.loadData();
  }
};
</script>

<style lang="scss">
.xh-contact-body {
  .van-cell {
    padding: 5px 0;
  }
}
</style>
