<!--
 * @Description:相关文档
 * @Author: shenah
 * @Date: 2019-12-20 13:26:57
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-20 22:27:08
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
      type: String,
      default: () => {}
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
    // 处理图片数据
    handleImgData(arr) {
      const { customerNum, customerId, dealState } = this.params;
      let map = new Map();
      arr.forEach(item => {
        const { documentType } = item;
        if (!map.has(documentType)) {
          let obj = this.docTypes.filter(
            one => one.value + "" === documentType
          )[0];
          map.set(documentType, {
            declare: obj && obj.label, //图片描述
            isRequire: true, //*是否必须
            deletable: dealState === "1", //是否可以操作-上传和删除
            documentType,
            customerNum,
            customerId,
            kind: "1",
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
