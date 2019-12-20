/*
 * @Description: 公用混合方法使用
 * @Author: shenah
 * @Date: 2019-12-18 17:21:56
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-18 17:23:21
 */

export default {
  data() {
    return {};
  },
  methods: {
    /**
     * @description: 返回几层
     * @param {number | string} index 返回几层
     * @return:
     */
    goBack(index = -1) {
      this.$router.go(index);
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
