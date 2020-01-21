/*
 * @Description: 公用混合方法使用
 * @Author: shenah
 * @Date: 2019-12-18 17:21:56
 * @LastEditors  : shenah
 * @LastEditTime : 2020-01-17 13:55:00
 */
import { Notify } from 'vant';
import Vue from 'vue';
Vue.use(Notify)

export default {
  data() {
    return {};
  },
  methods: {
    /**
     * @description: 保留几位小数
     * @param {any} value  任何数
     * @param {number} num 需要保留几位小数
     * @param {string} company 单位
     */
    keepDecimal(val, num = 2, company) {
      let number = val * 1;
      if (
        val === "" ||
        val === undefined ||
        val === null ||
        val instanceof Object ||
        isNaN(number)
      ) {
        if (company) {
          return ` ${company}`;
        }
        return "";
      }
      if (company) {
        return `${number.toFixed(num)} ${company}`;
      }
      return number.toFixed(num);
    },
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
     */
    goBack(index = -1) {
      this.$router.go(index);
    },
    loadingImg(imgName) {
      return require(`../images/${imgName}`);
    },
    dataURLtoFile: function(dataurl, filename = new Date() + ".jpg") {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]),
        n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    closeNativeWebView() {
      this.$bridge.callHandler("returnBack", "", res => {}); //调用原生关闭webview
    },
    /**
     * 金额保留两位小数
     * @param obj
     * @param value
     */
    priceFloat(obj, value) {
      if (obj[value] || obj[value] == "0") {
        obj[value] = this.returnFloat(obj[value]);
      } else {
        obj[value] = obj[value];
      }
    },
    returnFloat(value) {
      let reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/
      if(!reg.test(value)) {
        this.$notify({
          type: "danger",
          message: "请输入数字"
        });
        return ''
      }
      value = Math.round(parseFloat(value) * 100) / 100;
      let xsd = value.toString().split(".");
      if (xsd.length === 1) {
        value = value.toString() + ".00";
        return value;
      }
      if (xsd.length > 1) {
        if (xsd[1].length < 2) {
          value = value.toString() + "0";
        }
        return value;
      }
    },
    /**
     * 截取当前数据到小数点后三位
     * @param {*} value 
     */
    numFilter (value) {
      let realVal = ''
      if (!isNaN(value) && value!== '' && value !== null) {
        let tempVal = parseFloat(value).toFixed(3)
        realVal = tempVal.substring(0, tempVal.length - 1)
      } else {
        realVal = ''
      }
      return realVal
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
