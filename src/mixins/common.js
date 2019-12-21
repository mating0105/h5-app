/*
 * @Description: 公用混合方法使用
 * @Author: shenah
 * @Date: 2019-12-18 17:21:56
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-20 22:28:19
 */

export default {
  data() {
    return {};
  },
  methods: {
    /**
     * @description: 将JSON字符串转化成JSON对象
     * @param {string} str json字符串类型
     * @return: obj
     */
    getStringToObj(str) {
      try {
        return JSON.parse(str);
      } catch (error) {
        return {};
      }
    },
    /**
     * @description: 返回几层
     * @param {number | string} index 返回几层
     * @return:
     */
    goBack(index = -1) {
      this.$router.go(index);
    },
    // 加载加载图片防止打包后图片的路径不对
    loadingImg(imgName) {
      return require(`../images/${imgName}`);
    }
  },
  filters: {
    /**
     * @description: 将code => 中文名
     * @param {string|number} value code的值
     * @param {array} list 当前需要解码的数组
     * @return: 当前code所对应的中文名
     */

    codeInToName(value, list) {
      if (!Array.isArray(list)) {
        return "";
      }
      if (value !== null) {
        const array = list.filter(item => item.value === value)[0];
        if (array) {
          return array.label;
        }
        return "";
      }
      return "";
    }
  }
};
