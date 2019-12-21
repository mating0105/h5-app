<template>
  <ViewPage>
    <Card :key="index" class="xh-top-10" v-for="(item, index) in dataList">
      <template v-slot:header>
        <section>{{ item.declare }}</section>
      </template>
      <imageList
        :dataList="[item]"
        :view="params.isView === '1'"
      ></imageList>
    </Card>
  </ViewPage>
</template>

<script>
import Vue from "vue";
// 自定义组件
import { mapState } from "vuex";
import { queryAllImgs } from "@/api/document";
import Nothing from "@/components/Nothing/index";
import { Toast } from "vant";
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import imageList from "@/components/imageList";

export default {
  components: {
    imageList,
    ViewPage,
    Card
  },
  data() {
    return {
      params: {},
      dataList: []
    };
  },
  computed: {
    // 所有字典
    ...mapState({
      docTypes: state => state.user.wordbook.document_type
    })
  },
  methods: {
    // 字典转换
    returnText(val) {
      let name;
      this.docTypes.forEach(e => {
        if(e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    loadImges() {
      this.toast = Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
        overlay: true
      });
      queryAllImgs({
        customerNum: this.params.customerNum,
        kind: "1"
      })
        .then(res => {
          Toast.clear(this.toast);
          this.handleImgData(res.data);
          // this.dataList = res.data;
        })
        .catch(() => {
          Toast.clear(this.toast);
        });
    },
    findLabel(docType) {
      for (let i = 0; i < this.docTypes.length; i++) {
        let one = this.docTypes[i];
        if (one.value + "" === docType) {
          return one;
        }
      }
      return {};
    },
    // 处理图片数据
    handleImgData(arr) {
      debugger
      const { customerNum, customerId, isView } = this.params;
      let map = new Map();
      // 公用的参数
      const commonParams = {
        isRequire: false,
        deletable: isView === "1", //是否可以操作-上传和删除
        documentType,
        customerNum,
        customerId,
        kind: "1"
      };
      // 当可以上传或者修改的时候做处理为了防止请求回来的数据为空,而导致无法上传
      if (isView === "1") {
        this.types.forEach(item => {
          let { type, must } = item;
          let obj = this.findLabel(type);
          map.set(item, {
            ...commonParams,
            isRequire: must, //*是否必须
            declare: obj.label, //图片描述
            fileList: []
          });
        });
      }
      // arr.forEach(t => {
        
      // });
      arr.forEach(item => {
        const { documentType } = item;
        if (!map.has(documentType)) {
          map.set(documentType, {
            ...commonParams,
            declare: this.returnText(documentType), //图片描述
            fileList: [item]
          });
        } else {
          let one = map.get(documentType);
          one.fileList.push(item);
          map.set(documentType, one);
        }
      });
      this.dataList = [...map.values()];
      console.log(this.dataList);
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.loadImges();
  }
};
</script>

<style lang="scss">
</style>
