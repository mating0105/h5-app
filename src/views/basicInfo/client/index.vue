<template>
<!-- 客户及配偶 -->
  <div class="xh-page-body xh-bg-maingray">
      <div class="xh-card">
        <van-row>
          <van-col :span="24">
            <van-cell-group>
              <van-field name="customerName" v-model="customerName" required clearable label="客户姓名：" input-align="right"
                placeholder="请输入客户姓名" @blur.prevent="ruleMessge" :error-message="errorMsg.customerName"/>
            </van-cell-group>
            <van-cell-group>
              <van-field name="certificateNum" v-model="certificateNum" required disabled clearable label="证件号码：" input-align="right"
                placeholder="请输入证件号码"  @blur.prevent="ruleMessge" :error-message="errorMsg.certificateNum"/>
            </van-cell-group>
            <van-cell-group>
              <van-field name="contactPhone" v-model="contactPhone" clearable required label="联系电话：" input-align="right"
                placeholder="请输入联系电话" @blur.prevent="ruleMessge"
                :error-message="errorMsg.contactPhone" />
            </van-cell-group>

            <van-cell-group>
              <van-cell title="婚姻状况：" required is-link :value="fromData.marriageDesc" @click.native="loadList('婚姻状况')" />
            </van-cell-group>
            <van-cell-group>
              <van-cell title="文化程度：" required is-link :value="fromData.levelEducationDesc"
                @click.native="loadList('文化程度')" />
            </van-cell-group>
            <van-cell-group>
              <van-cell title="单位性质：" required is-link :value="fromData.unitCharDesc" @click.native="loadList('单位性质')" />
            </van-cell-group>
            <van-cell-group>
              <van-field name="primarySchool" v-model="fromData.primarySchool" clearable required label="曾就读小学：" input-align="right"
                placeholder="请输入曾就读小学"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.primarySchool" />
            </van-cell-group>
            <van-cell-group>
              <van-cell title="户籍地址：" required is-link :value="fromData.pProvCityZon"
                @click.native="loadList('户籍地址')" />
            </van-cell-group>
            <van-cell-group>
              <van-cell title="居住地：" required is-link :value="fromData.rProvCityZon" @click.native="loadList('居住地')" />
            </van-cell-group>
            <van-cell-group>
              <van-field name="spsRsdncDtlAdr" v-model="fromData.spsRsdncDtlAdr" required clearable label="居住地详细地址：" input-align="right"
                placeholder="请输入详细地址"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsRsdncDtlAdr" />
            </van-cell-group>
            <van-cell-group>
              <van-cell title="子女情况：" required is-link :value="fromData.childrenSituationDesc"
                @click.native="loadList('子女情况')" />
            </van-cell-group>
            <van-cell-group v-if="fromData.childrenSituationDesc != '无' ">
              <van-cell title="子女上学情况：" required is-link :value="fromData.schoolSituationDesc"
                @click.native="loadList('子女上学情况')" />
            </van-cell-group>
            <van-cell-group>
              <van-field name="localResidence" v-model="fromData.localResidence" clearable required type="number" label="本地居住年限(年)："
                input-align="right" placeholder="请输入居住年限"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.localResidence" />
            </van-cell-group>
            <van-cell-group>
              <van-field name="remark" v-model="fromData.remark" type="textarea" placeholder="请输入备注" rows="1" autosize />
            </van-cell-group>

            <!-- 下拉选择器 -->
            <van-actionsheet v-model="selectShow" class="xh-list">
              <van-picker show-toolbar :title="pickerTitle" :columns="columns" :value-key="'label'" @cancel="onCancel"
                @confirm="onConfirm" />
            </van-actionsheet>

            <!-- 弹出省市区 -->
            <van-actionsheet v-model="addressShow" class="xh-list">
              <div class="xh-list-body">
                <van-area :area-list="areaList" :title="addressTitle" :loading="selectLoading"
                  @confirm="addressOnCancel" @cancel="addressOnConfirm" />
              </div>
            </van-actionsheet>

          </van-col>
        </van-row>
      </div>
      <div class="xh-card car2" v-if="spouseShow">
        <van-row style="background: white;">
          <van-col :span="21">
            <van-cell-group>
              <van-field name="spsNm" v-model="spsNm" clearable required label="配偶姓名：" input-align="right" placeholder="请输入配偶姓名"
                @blur.prevent="ruleMessge" :error-message="errorMsg.spsNm" />
            </van-cell-group>
          </van-col>
          <van-col :span="3">
            <div style="height: 35.38px;background: white;text-align: center;" @click="OCRScan">
              <img src="../../../icon/icon-ocr.png" style="height: 15px;padding: 8px 5px;">
            </div>
          </van-col>
          <van-col :span="24">
            <van-cell-group>
              <van-field name="spsCrdtNo" v-model="spsCrdtNo" clearable required label="配偶证件号码：" input-align="right"
                placeholder="请输入配偶证件号码" @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsCrdtNo" />
            </van-cell-group>
            <van-cell-group>
              <van-field name="spsCtcTel" v-model="spsCtcTel" clearable required label="配偶联系电话：" input-align="right"
                placeholder="请输入配偶联系电话" @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsCtcTel" />
            </van-cell-group>
            <van-cell-group>
              <van-cell title="配偶文化程度：" required is-link :value="fromData.spsCltrDgrDesc"
                @click.native="loadList('配偶文化程度')" />
            </van-cell-group>
            <van-cell-group>
              <van-cell title="配偶单位性质：" required is-link :value="fromData.spsUnitCharDesc"
                @click.native="loadList('配偶单位性质')" />
            </van-cell-group>
          </van-col>
        </van-row>
      </div>
      <!-- 保 存按钮 -->
      <div class="xh-submit">
        <van-button size="large" class="xh-bg-main" :class="[subDisabled ? 'buttonNoColor' : 'buttonColor']"
          :loading="subLoading" :disabled="subDisabled" @click.native="custSubmit">保 存</van-button>
      </div>
  </div>
</template>

<script>
export default {
  
}
</script>
    
<script>
export default {
    data() {
      return {
        fromData: {
          // 额外提交(上页传递)
          projectId: '', //项目Id
          customerId: '',//客户id
          customerNum: '',//客户编号
          certificateType: '1', //证件类型
          id: '',  // 查询接口返回
          // 额外提交
          customerName: '', //客户姓名
          certificateNum: '', //证件号码
          contactPhone: '', //联系电话
          marriage: '', //婚姻状况
          marriageDesc: '',
          unitChar: '',//单位性质
          unitCharDesc: '',
          levelEducation: '', //文化程度
          levelEducationDesc: '',
          primarySchool: '', //曾就读小学
          pProvCityZon: '', //户籍地址
          rProvCityZon: '', //居住地
          spsRsdncDtlAdr: '', //居住地详细地址
          childrenSituation: '', //子女情况
          childrenSituationDesc: '',
          schoolSituation: '', //子女上学情况
          schoolSituationDesc: '',
          localResidence: '', //本地居住年限(年)
          remark: '', //备注
          spsNm: '', //配偶姓名
          spsCrdtTp: '',//配偶证件类型
          spsCrdtNo: '', //配偶证件号码
          spsCtcTel: '', //配偶联系电话
          spsCltrDgr: '', //配偶文化程度
          spsCltrDgrDesc: '',
          spsUnitChar: '',//配偶单位性质
          spsUnitCharDesc: ''
        },
        searchData: {
          projectId: '', //项目Id
          id: '',
        },
        subData: {},
        params: {}, // 传过来的参数集合
        rules: rules, //验证 方法
        cpCertificateNum: cpCertificateNum,//身份证验证
        errorMsg: {
          localResidence: '', //本地居住年限(年)
          spsRsdncDtlAdr: '', //居住地详细地址
          spsNm: '', //配偶姓名
          spsCrdtNo: '', //配偶证件号码
          spsCtcTel: '', //配偶联系电话
          contactPhone: '', //联系电话
          primarySchool: '', //曾就读小学
          
          certificateNum: '',
          childrenSituation: '',
          customerName: '',
          emgrCtcpsnNm: '',
          isBonds: '',
          levelEducation: '',
          marriage: '',
          pProvCityZonId: '',
          rProvCityZonId: '',
          relationCus: '',
          schoolSituation: '',
          unitChar: '',
        },
        spouseShow: false, //显示配偶
        selectShow: false, //下拉选择器显示
        selectLoading: true, //下拉选择 loading
        pickerTitle: '',//下拉列表title
        addressShow: false,// 城市下拉选择器显示
        addressTitle: '',//城市下拉列表title
        areaList: {},//城市列表 init
        columns: [], //待选择列表
        pProvCityZonList: [], //户籍地址
        rProvCityZonList: [], //居住地
        subLoading: false, //提交loading
        subDisabled: false, //按钮禁用状态
        customerName: '', // 客户名字  
        contactPhone: '', // 客户电话   
        certificateNum: '', // 客户证件号码  
        spsNm: '', // 客户配偶名字      
        spsCtcTel: '', // 客户配偶电话   
        spsCrdtNo: '', // 客户配偶证件号码
        ruleData: {}
      }
    },
    created() {
      // 初始化城市列表
      this.areaList.province_list = province;
      this.areaList.city_list = city;
      this.areaList.county_list = area;

      this.params = commonFun.urlParam(location.search)
      if (this.params.isChangeProj == "1") {
        this.params.isChangeProj = "1"
      } else {
        this.params.isChangeProj = "0"
      }
      token = this.params.token;

      publicData(); // 获取字典

      if (Object.keys(this.params).length > 0) {

        // 查询
        this.searchData.projectId = this.params.projectId
        this.searchData.id = this.params.id

        // 保存
        this.fromData.projectId = this.params.projectId
        this.fromData.customerId = this.params.customerId
        this.fromData.customerNum = this.params.customerNum

      } else {
        this.$toast({
          position: 'top',
          message: '未接收到上页传递的数据',
        });
      }

      requestUrl.getList('/order/viceProj/getCustomerInfo', this.searchData, 'soa').then(res => {
        if(res.data.code == 200) {
          this.fromData = res.data.data;
          if (this.params.isChangeProj == '1') {
            this.customerName = this.fromData.spsNm;
            this.contactPhone = this.fromData.spsCtcTel;
            this.certificateNum = this.fromData.spsCrdtNo;
            this.spsNm = this.fromData.customerName;
            this.spsCtcTel = this.fromData.contactPhone;
            this.spsCrdtNo = this.fromData.certificateNum;
          } else {
            this.customerName = this.fromData.customerName;
            this.contactPhone = this.fromData.contactPhone;
            this.certificateNum = this.fromData.certificateNum;
            this.spsNm = this.fromData.spsNm;
            this.spsCtcTel = this.fromData.spsCtcTel;
            this.spsCrdtNo = this.fromData.spsCrdtNo;
          }
          this.fromData.marriageDesc = returnName(this.fromData.marriage,publicList.marriage_type);
          this.fromData.levelEducationDesc = returnName(this.fromData.levelEducation,publicList.DegreeOfEducation);
          this.fromData.childrenSituationDesc = returnName(this.fromData.childrenSituation,publicList.children);
          this.fromData.schoolSituationDesc = returnName(this.fromData.schoolSituation,publicList.school_Situation);
          this.fromData.spsCltrDgrDesc = returnName(this.fromData.spsCltrDgr,publicList.DegreeOfEducation);
          this.fromData.unitCharDesc = returnName(this.fromData.unitChar,publicList.unit_Property);
          this.fromData.spsUnitCharDesc = returnName(this.fromData.spsUnitChar,publicList.unit_Property);
          if (this.fromData.marriageDesc == "已婚" || this.fromData.marriageDesc == "事实婚姻") {
            this.spouseShow = true;
          } else {
            this.spouseShow = false;
          }
        }
      })
      this.rulesForm();
    },
    methods: {
      OCRScan() {
        bridge.callhandler('OCRScan', "1", (data) => {
          this.$set(this, 'spsNm', data.ID_NAME);
          this.$set(this, 'spsCrdtNo', data.ID_NUM);
        })
      },
      loadList(val) {
        this.selectShow = true
        setTimeout(() => { this.selectLoading = false }, 500)
        switch (val) {
          case '婚姻状况':
            this.columns = publicList.marriage_type;
            this.pickerTitle = '婚姻状况'
            break
          case '文化程度':
            this.columns = publicList.DegreeOfEducation;
            this.pickerTitle = '文化程度'
            break
          case '户籍地址':
            this.addressShow = true
            this.selectShow = false
            this.addressTitle = '户籍地址'
            this.pickerTitle = '户籍地址'
            break
          case '居住地':
            this.addressShow = true
            this.selectShow = false
            this.addressTitle = '居住地'
            this.pickerTitle = '居住地'
            break
          case '子女情况':
            this.columns = publicList.children;
            this.pickerTitle = '子女情况'
            break
          case '子女上学情况':
            this.columns = publicList.school_Situation;
            this.pickerTitle = '子女上学情况'
            break
          case '配偶文化程度':
            this.columns = publicList.DegreeOfEducation;
            this.pickerTitle = '配偶文化程度'
            break
          case '单位性质':
            this.columns = publicList.unit_Property;
            this.pickerTitle = '单位性质'
            break
          case '配偶单位性质':
            this.columns = publicList.unit_Property;
            this.pickerTitle = '配偶单位性质'
            break
        }
      },
      unitCharDes(val) {
        switch (val) {
          case '1':
            return "国企/事业单位/机关团体（合同工/正式员工）"
          case '2':
            return "私企"
          case '3':
            return "个体商户"
          case '4':
            return "自由职业"
          default:
            return ""
        }
      },
      onConfirm(rows, index) {
        this.selectShow = false
        this.selectLoading = true

        switch (this.pickerTitle) {
          case '婚姻状况':
            this.fromData.marriage = rows.value;
            this.fromData.marriageDesc = rows.label;
            break
          case '文化程度':
            this.fromData.levelEducation = rows.value;
            this.fromData.levelEducationDesc = rows.label;
            break
          // case '户籍地址':
          //   this.fromData.pProvCityZon = this.address;
          //   break
          // case '居住地':
          //   this.fromData.rProvCityZon = this.address;
          //   break
          case '子女情况':
            this.fromData.childrenSituation = rows.value;
            this.fromData.childrenSituationDesc = rows.label;
            break
          case '子女上学情况':
            this.fromData.schoolSituation = rows.value;
            this.fromData.schoolSituationDesc = rows.label;
            break
          case '配偶文化程度':
            this.fromData.spsCltrDgr = rows.value;
            this.fromData.spsCltrDgrDesc = rows.label;
            break
          case '单位性质':
            this.fromData.unitChar = rows.value;
            this.fromData.unitCharDesc = rows.label;
            break
          case '配偶单位性质':
            this.fromData.spsUnitChar = rows.value;
            this.fromData.spsUnitCharDesc = rows.label;
            break
        }

        if (this.fromData.marriageDesc == '已婚' || this.fromData.marriageDesc == '事实婚姻') {
          this.spouseShow = true
        } else {
          this.spouseShow = false
        }

      },
      onCancel() {
        this.selectShow = false
        this.selectLoading = true
      },

      // 省市区选择
      addressOnCancel(list) {
        this.addressShow = false
        this.selectLoading = true
        let a1,a2,a3;
        let name = []
        let addId = []
        list.forEach(e => {
          if (e != undefined) {
            name.push(e.name);
            addId.push(e.code);
          }
        });
        if(addId.length > 2 || addId.length === 2) {
          a2 = realCity(name[1]);
        }
        a1 = addId[0];
        a3 = addId[2];
        switch (this.pickerTitle) {
          case '户籍地址':
            this.fromData.pprovCityZon = name.join('-');
            this.fromData.pProvCityZon = name.join('-');
            this.fromData.pProvCityZonCode = a1+(a2?'-'+a2:'')+(a3?'-'+a3:'');
            break
          case '居住地':
            this.fromData.rprovCityZon = name.join('-')
            this.fromData.rProvCityZon = name.join('-')
            this.fromData.rProvCityZonCode = a1+(a2?'-'+a2:'')+(a3?'-'+a3:'');
            break
        }
      },
      addressOnConfirm() {
        this.addressShow = false;
        this.selectLoading = true;
      },
      subMit() {
        this.subLoading = true;
        this.subDisabled = true;

        requestUrl.postList('/order/viceProj/saveCustomerInfo', this.subData, 'soa').then(res => {
          this.subLoading = false
          this.subDisabled = false
          if (res.code == 200) {
            this.$toast.success('保存成功');
            setTimeout(() => {
              bridge.ReturnVC(1, true)
            }, 1000);
          } else {
            this.$toast({
              position: 'top',
              message: res.msg
            });
          }
        }).catch(error=> {
          this.subLoading = false
          this.subDisabled = false
        });
      },

      // submit
      custSubmit() {
        if (this.params.isChangeProj == '1') { //配偶互换过的
          this.fromData.customerName = this.spsNm
          this.fromData.contactPhone = this.spsCtcTel
          this.fromData.certificateNum = this.spsCrdtNo
          this.fromData.spsNm = this.customerName
          this.fromData.spsCtcTel = this.contactPhone
          this.fromData.spsCrdtNo = this.certificateNum
        } else {
          this.fromData.customerName = this.customerName
          this.fromData.contactPhone = this.contactPhone
          this.fromData.certificateNum = this.certificateNum
          this.fromData.spsNm = this.spsNm
          this.fromData.spsCtcTel = this.spsCtcTel
          this.fromData.spsCrdtNo = this.spsCrdtNo
        }
        let sub1 = false, sub2 = false, errNum = 0
        for (let item in this.errorMsg) {
          this.errorMsg[item] ? errNum++ : ''
        }
        this.subData = Object.assign({}, this.fromData);
        this.subData.marriage = this.fromData.marriage
        this.subData.levelEducation = this.fromData.levelEducation
        this.subData.childrenSituation = this.fromData.childrenSituation
        this.subData.schoolSituation = this.fromData.schoolSituation
        this.subData.spsCltrDgr = this.fromData.spsCltrDgr
        this.subData.unitChar = this.fromData.unitChar
        this.subData.spsUnitChar = this.fromData.spsUnitChar
        
        // 根据身份证获取 性别  and 年龄
        this.subData.sex = UUserCard(this.fromData.certificateNum, 2)
        this.subData.age = UUserCard(this.fromData.certificateNum, 3)
        this.subData.spsGnd = this.fromData.spsCrdtNo ? UUserCard(this.fromData.spsCrdtNo, 2) : ''
        this.subData.spsAge = this.fromData.spsCrdtNo ? UUserCard(this.fromData.spsCrdtNo, 3) : ''

        console.log('fromData：', this.fromData)
        console.log('subData：', this.subData)
        // 客户信息

        if (this.fromData.unitChar && this.fromData.certificateNum && this.fromData.contactPhone && this.fromData.marriage && this.fromData.primarySchool && this.fromData.levelEducation && this.fromData.pProvCityZon && this.fromData.rProvCityZon && this.fromData.childrenSituation && this.fromData.localResidence && this.fromData.spsRsdncDtlAdr) {
          if (this.subData.childrenSituation == '0') {
            sub1 = true
          } else {
            if (this.subData.schoolSituation) {
              sub1 = true
            } else {
              sub1 = false
            }
          }
        } else {
          sub1 = false
        }

        // 配偶信息
        if (this.fromData.spsCltrDgr && this.fromData.spsUnitChar && this.fromData.spsNm && this.fromData.spsCrdtNo && this.fromData.spsCtcTel) {
          sub2 = true
        } else {
          sub2 = false
        }

        if (this.fromData.marriageDesc != '已婚' && this.fromData.marriageDesc != '事实婚姻') {
          if (sub1 && errNum == 0) {
            this.subMit()
          } else {
            this.$toast({
              position: 'top',
              message: '带 * 必须填写完整, 且填写无误'
            });
          }
        } else {
          if (sub1 && sub2 && errNum == 0) {
            this.subMit()
          } else {
            this.$toast({
              position: 'top',
              message: '带 * 必须填写完整, 且填写无误'
            });
          }
        }
      },
      // 有接口验证的时候
      urlRules(urls, rows) {
        let param = rows.params.split(',');
        let obj = {};
        param.forEach(t => {
          obj[t] = this.fromData[t];
        });
        requestUrl.getList(urls, obj, 'soa').then(res => {
          if (res.data.code === 200) {
            let { message } = res.data.data;
            this.errorMsg[rows.field] = message;
          } else {
            this.$toast(res.data.msg);
          }
        })
      },
      // 验证值
      returnMsg(name, value) {
        if(this.ruleData[name]) {
          let infoObj = this.ruleData[name];
          let error = ''; // 错误信息
          if(infoObj.mustFill) {
            if(value == '' || value === undefined || value === null) {
              error = '必填项，不能为空';
            }
          } else {
            if(value == '' || value === undefined || value === null) {
              error = '';
            }
          }
          if(infoObj.regular.length > 0) {
            for (let i = 0; i < infoObj.regular.length; i += 1) {
              const { rule, message } = infoObj.regular[i];
              const reg = new RegExp(rule);
              if (!reg.test(value)) {
                error = message;
              } else {
                if(infoObj.urlSuffix) {
                  this.urlRules(infoObj.urlSuffix, infoObj);
                }
              }
            }
          }
          return error;
        }
      },
      ruleMessge(e) {
        let name = e.target.name;
        let val = e.target.value;
        this.errorMsg[name] = this.returnMsg(name, val);
      },
      // 获取验证信息
      rulesForm () {
        requestUrl.getList('/manage/regularConfig/getRegularByServer',{ serverName: 'order/viceProj'}, 'soa').then(res => {
          if (res.data.code === 200) {
            this.ruleData = res.data.data;
          } else {
            this.$toast(res.data.message);
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  
</style>
