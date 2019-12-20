<!--
 * @Description:相关文档
 * @Author: shenah
 * @Date: 2019-12-20 13:26:57
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-20 20:23:07
 -->

<template>
  <div class="related-docs">
    <div v-if="dataList.length">
      <card
        :key="index"
        class="xh-top-10"
        v-for="(item,index) in dataList"
      >
        <template v-slot:header>
          <section>{{item.declare}}</section>
        </template>
        <imageList
          :dataList="[item]"
          :view="dealState === '3'"
        ></imageList>
      </card>
    </div>
    <nothing
      @nothingChange="nothingChange"
      v-else
    ></nothing>
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
  data() {
    return {
      dataList: []
    };
  },
  computed: {
    // 所有字典
    ...mapState({
      docTypes: state => state.user.wordbook.document_type
    }),
    info() {
      console.log(this.$route.query)
      return this.getStringToObj(this.$route.query).info;
    },
    dealState() {
      // 1代表可以编辑3不可以编辑
      return this.getStringToObj(this.$route.query).dealState;
    }
  },
  props: {},
  mounted() {
    this.query();
  },
  methods: {
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
        customerNum: this.info && this.info.customerNum,
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
      let map = new Map();
      arr.forEach(item => {
        const { documentType } = item;
        let obj = this.docTypes.filter(
          one => one.value + "" === documentType
        )[0];
        if (!map.has(documentType)) {
          map.set(documentType, {
            declare: obj && obj.label, //图片描述
            isRequire: true, //*是否必须
            deletable: this.dealState === "1", //是否可以操作-上传和删除
            documentType,
            customerNum: this.info && this.info.customerNum,
            customerId: this.info && this.info.customerId,
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
<style lang='scss' scoped>
.related-docs {
  width: 100%;
  height: 100%;
}
</style>