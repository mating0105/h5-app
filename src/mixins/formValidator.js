import { fieldRules, fieldRulesNew } from "@/api/makeLoan";

export default {
  data() {
    return {
      ruleData: [],
      errorMsg: {}
    };
  },
  methods: {
    // 验证值
    returnMsg(name, value) {
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
            const { rule, message } = infoObj.regular[i];
            const reg = new RegExp(rule);
            if (!reg.test(value)) {
              error = message;
            } else {
              if (infoObj.urlSuffix) {
                this.urlRules(infoObj.urlSuffix, infoObj, value);
              }
            }
          }
        }
        return error;
      }
    },
    // 有接口验证的时候
    urlRules(urls, rows, value) {
      let param = rows.params.split(",");
      let obj = {};
      param.forEach(t => {
        obj[t] = value;
      });
      fieldRulesNew({ urls, obj })
        .then(res => {
          if (res.code === 200) {
            let { message } = res.data;
            this.errorMsg[rows.field] = message;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //规则验证
    ruleMessge(e, index, cb) {
      let name = e.target.name;
      let val = e.target.value;
      if (index !== undefined && index !== null) {
        let arr = [];
        arr[index] = this.returnMsg(name, val);
        this.errorMsg[name] = arr;
      } else {
        this.errorMsg[name] = this.returnMsg(name, val);
      }
      cb && cb();
    },
    // 获取验证信息
    rulesForm(serverName) {
      let para = {
        serverName //做单页面
      };
      fieldRules(para)
        .then(res => {
          if (res.code === 200) {
            this.ruleData = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
