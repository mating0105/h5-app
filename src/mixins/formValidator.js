import { fieldRules } from '@/api/makeLoan'

export default {
  data () {
    return {
      ruleData: [],
      errorMsg: {}
    };
  },
  methods: {
// 验证值
    returnMsg (name, value) {
      if (this.ruleData[name]) {
        let infoObj = this.ruleData[name];
        let error = ""; // 错误信息
        if (infoObj.mustFill) {
          if (value === "" || value === undefined || value === null) {
            error = "必填项，不能为空";
          }
        } else {
          if (value === "" || value === undefined || value === null) {
            error = "";
          }
        }
        if (infoObj.regular.length > 0) {
          for (let i = 0; i < infoObj.regular.length; i += 1) {
            const {rule, message} = infoObj.regular[i];
            const reg = new RegExp(rule);
            if (!reg.test(value)) {
              error = message;
            } else {
              if (infoObj.urlSuffix) {
                this.urlRules(infoObj.urlSuffix, infoObj);
              }
            }
          }
        }
        return error;
      }
    },
    //规则验证
    ruleMessge (e, index) {
      let name = e.target.name;
      let val = e.target.value;
      if (index !== undefined) {
        let arr = [];
        arr[index] = this.returnMsg(name, val);
        this.errorMsg[name] = arr;
      } else {
        this.errorMsg[name] = this.returnMsg(name, val);
      }
    },
    // 获取验证信息
    rulesForm (serverName) {
      let para = {
        serverName//做单页面
      }
      fieldRules(para).then((res) => {
        if (res.code === 200) {
          this.ruleData = res.data;
        }
      }).catch((err) => {
        console.log(err);
      })
    },
  }
};
