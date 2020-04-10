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
    <!-- 分组的照片 -->
    <card
      :key="index"
      class="xh-top-10"
      v-for="(item, index) in groupObj"
    >
      <template v-slot:header>
        <section>{{ item.title }}</section>
      </template>
      <card
        :key="i"
        class="xh-top-10"
        v-for="(one, i) in item.fileList"
      >
        <template v-slot:header>
          <section>{{ one.declare }}</section>
        </template>
        <imageList
          :dataList="[one]"
          :view="!one.deletable"
        ></imageList>
      </card>
    </card>
    <!-- 没有分组的照片 -->
    <card
      :key="index"
      class="xh-top-10"
      v-for="(item, index) in noGroupList"
    >
      <template v-slot:header>
        <section>{{ item.declare }}</section>
      </template>
      <imageList
        :dataList="[item]"
        :view="!item.deletable"
      ></imageList>
    </card>
    <nothing
      @nothingChange="nothingChange"
      v-if="noGroupList.length===0 && JSON.stringify(groupObj) === '{}'"
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
  props: {
    requestParams: {
      // {customerNum:'xxx',customerId:'xxxx',dealState:'3'}
      default: () => {}
    },
    types: {
      // [{ type: "1111", must: false, dealState: "1",label:'征信' }] => type代表的是文档类型,must代表是否必传,dealState代表是否可以上传或者是查看,label当前文档的名称
      type: Array,
      default: () => []
    },
    roles: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      group: {
        // 分组的类型
        _0101_0102: "身份证照片"
      },
      groupObj: {}, // 分组的列表
      noGroupList: [], // 没有分组的列表
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
      if (customerNum) {
        this.params = {
          customerNum,
          customerId,
          dealState: String(this.dealState)
        };
      } else {
        this.params = this.requestParams;
        this.params.dealState = String(this.params.dealState);
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
      let map = new Map();
      // 公用的参数
      const commonParams = {
        isRequire: false,
        deletable: false, //是否可以操作-上传和删除
        customerNum,
        customerId,
        kind: "1"
      };
      // 当可以上传或者修改的时候做处理为了防止请求回来的数据为空,而导致无法上传
      this.types.forEach(item => {
        let { type, must, label, dealState: isEdit } = item;
        map.set(type, {
          ...commonParams,
          deletable: isEdit === "1", //是否可以操作-上传和删除
          documentType: type, // 文档类型
          isRequire: must, //*是否必须
          declare: label, //图片描述
          fileList: []
        });
      });
      arr.forEach(item => {
        const { documentType } = item;
        if (!map.has(documentType)) {
          let obj = this.findLabel(documentType);
          map.set(documentType, {
            ...commonParams,
            documentType, // 文档类型
            declare: obj.label, //图片描述
            fileList: [item]
          });
        } else {
          let one = map.get(documentType);
          one.fileList.push(item);
          map.set(documentType, one);
        }
      });
      this.handleGroup([...map.values()]);
      // 先把身份证分出来(最后再来改写代码把)
    },
    handleGroup(list) {
      let group = {};
      let flag = false;
      for (let key in this.group) {
        let title = this.group[key];
        for (let index = 0; index < list.length; index += 1) {
          let one = list[index];
          if (key.indexOf(one.documentType) > -1) {
            flag = true;
            if (!group[key]) {
              group[key] = {
                title,
                fileList: []
              };
            }
            group[key].fileList.push(one);
            list.splice(index, 1);
            index--;
          }
        }
      }
      // 这里剩下的就是其他照片了(没有分类的照片)
      if (flag) {
        group.other = {
          title: "其他",
          fileList: list
        };
      } else {
        if(this.roles == 'khjl'){//客户经理不能查看银行征信授权书
          let lists = [];
          list.forEach(e =>{
            if(e.documentType != 'CRDPBOCB01' && e.documentType !='CRDPBOCB02' && e.documentType !='CRDPBOCB03' && e.documentType != 'CRDPBOCB04' && e.documentType != 'CRDPBOCB05'){
              lists.push(e);
            }
          })
          this.noGroupList = lists;
        }else{
          this.noGroupList = list;
        }
      }
      this.groupObj = group;
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
