<!--
 * @Description:相关文档
   当是查看的时候,可以使用组件的形式引入也可以使用页面的形式引入
   当可以编辑和上传的时候,只能使用组件的形式并且,requestParams与types必传
 * @Author: shenah
 * @Date: 2019-12-20 13:26:57
 * @LastEditors  : shenah
 -->

<template>
  <div class="related-docs">
    <div v-if="dataList.length">
      <card :key="index" class="xh-top-10" v-for="(item, index) in dataList">
        <template v-slot:header>
          <section>{{ item.declare }}</section>
        </template>
        <imageList
          :dataList="[item]"
          :view="params.dealState === '3'"
        ></imageList>
      </card>
    </div>
    <nothing @nothingChange="nothingChange" v-else></nothing>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { queryAllImgs } from "@/api/document";
import Card from "@/components/card/index";
import Nothing from "@/components/Nothing/index";
import ImageList from "@/components/imageList";
import { Toast } from "vant";

export default {
  name: "relatedDocs",
  components: { Card, ImageList, Nothing },
  props: {
    requestParams: {
      // {customerNum:'xxx',customerId:'xxxx',dealState:'3'}
      default: () => {}
    },
    types: {
      // [{type:'1111',must:false}] => type 代表的是文档类型,must代表的是是否必传
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataList: [], // 展示的列表
      params: {} // 请求的参数
    };
  },
  computed: {
    // 所有字典
    ...mapState({
      docTypes: state => state.user.wordbook.document_type
    }),
    info() {
      return this.getStringToObj(this.$route.query.info);
    },
    dealState() {
      // 1代表可以编辑3不可以编辑
      return this.$route.query.dealState;
    }
  },
  mounted() {
    this.initData();
    this.query();
  },
  methods: {
    /**
     * @description: 初始化数据
     * 当成组件时传入requestParams {customerNum:'xxx',customerId:'xxxx',dealState:'3'}
     * 当成页面的时候就使用query里面的参数 {info:'{customerNum:'xxx',customerId:'xxxx',...}',dealState:"3"}
     */
    initData() {
      const { customerNum, customerId } = this.info;
      if (JSON.stringify(this.requestParams) === "{}") {
        this.params = {
          customerNum,
          customerId,
          dealState: this.dealState
        };
      } else {
        this.params = this.requestParams;
      }
    },
    nothingChange() {
      this.query();
    },
    query() {
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
      const { customerNum, customerId, dealState } = this.params;
      const documentType = ''
      let map = new Map();
      // 公用的参数
      const commonParams = {
        isRequire: false,
        deletable: dealState === "1", //是否可以操作-上传和删除
        documentType,
        customerNum,
        customerId,
        kind: "1"
      };
      // 当可以上传或者修改的时候做处理为了防止请求回来的数据为空,而导致无法上传
      if (dealState === "1") {
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
      arr.forEach(item => {
        const { documentType } = item;
        if (!map.has(documentType)) {
          let obj = this.findLabel(documentType);
          map.set(documentType, {
            ...commonParams,
            declare: obj.label, //图片描述
            fileList: [item]
          });
        } else {
          let one = map.get(documentType);
          one.fileList.push(item);
          map.set(documentType, one);
        }
      });
      this.dataList = [...map.values()];
    }
  }
};
</script>
<style lang="scss" scoped>
.related-docs {
  width: 100%;
  height: 100%;
}
</style>
