import { serviceOther } from '@/utils/request'

// 照片
export const getDocumentByType = params => serviceOther({
  method: 'post',
  url: '/document/getDocumentBytype',
  data: params
})

// 照片
export const uploadsDocument = params => {
  const formData = new FormData()
  for (let key in params) {
    if(params.hasOwnProperty(key)) {
      if(Object.prototype.toString.call(params[key]) === "[object Array]") {
        for (let i = 0;i < params[key].length;i++) {
          formData.append(key, params[key][i])
        }
      } else {
        formData.append(key, params[key])
      }
    }
  }
  return serviceOther({
    method: 'post',
    url: '/document/uploads',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: formData
  })
}

// 照片
export const removeDocument = params => serviceOther({
  method: 'post',
  url: '/document/delete',
  data: params
})
// 照片
export const removeDocuments = params => serviceOther({
  method: 'post',
  url: '/document/delDocumentForUserCar',
  data: params
})

// app获取图片
export const queryAllImgs = params => serviceOther({
  method: 'get',
  url: '/document/api/queryAllPic',
  params
})


// 照片编码
// CUIDA01			身份证人像面				文档类型(主借人)
// CUIDA02			身份证人像面				文档类型(主借人配偶)
// CUIDA03			身份证人像面				文档类型(共债人)
// CUIDA04			身份证人像面				文档类型(共债人配偶)
// CUIDA05			身份证人像面				文档类型(担保人)
// CUIDB01			身份证国徽面				文档类型(主借人)
// CUIDB02			身份证国徽面				文档类型(主借人配偶)
// CUIDB03			身份证国徽面				文档类型(共债人)
// CUIDB04			身份证国徽面				文档类型(共债人配偶)
// CUIDB05			身份证国徽面				文档类型(担保人)
// CUCARD01			银行卡正面				文档类型(主借人)
// CUCARD02			银行卡正面				文档类型(主借人配偶)
// CUCARD03			银行卡正面				文档类型(共债人)
// CUCARD04			银行卡正面				文档类型(共债人配偶)
// CUCARD05			银行卡正面				文档类型(担保人)
// CUCARD11			银行卡反面				文档类型(人行征信主借人)
// CUCARD12			银行卡反面				文档类型(人行征信主借人配偶)
// CUCARD13			银行卡反面				文档类型(人行征信公债人)
// CUCARD14			银行卡反面				文档类型(人行征信公债人配偶)
// CUCARD15			银行卡反面				文档类型(人行征信担保人)
// CUDRV01			驾驶证				文档类型(人行征信主借人)
// CUDRV02			驾驶证				文档类型(人行征信主借人配偶)
// CUDRV03			驾驶证				文档类型(人行征信公债人)
// CUDRV04			驾驶证				文档类型(人行征信公债人配偶)
// CUDRV05			驾驶证				文档类型(人行征信担保人)
// CUQUA001			收入证明				文档类型_客户资料
// CUQUA002			客户工作证				文档类型_客户资料
// CUQUA003			客户个体营业执照				文档类型_客户资料
// CUQUA004			客户公司执照				文档类型_客户资料
// CUQUA005			客户各类经营合同				文档类型_客户资料
// CUQUA006			销售票据				文档类型_客户资料
// CUQUA007			客户银行流水				文档类型_客户资料
// CUQUA008			客户流水卡号				文档类型_客户资料
// CUQUA009			调查视频				文档类型_客户资料
// CUQUA010			调查照片				文档类型_客户资料
// CUQUA011			房产证				文档类型_客户资料
// CUQUA012			购房合同与付款收据				文档类型_客户资料
// CUQUA013			自建房证明				文档类型_客户资料
// CUQUA014			宅基地证				文档类型_客户资料
// CUQUA015			土地批复证明				文档类型_客户资料
// CUQUA016			户口本				文档类型_客户资料
// CUQUA017			结婚证				文档类型_客户资料
// CUQUA018			婚姻状态证明				文档类型_客户资料
// CUQUA019			基础资料				文档类型_客户资料
// CUQUA020			房产资料				文档类型_客户资料
// CUQUA021			收入资料				文档类型_客户资料
// CUQUA022			担保人资料				文档类型_客户资料
// CUQUA023			客户面谈照				文档类型_客户资料
// CUQUA024			单身声明				文档类型_客户资料
// CUQUA025			居住证明				文档类型_客户资料
// CUQUA026			企业营业执照(挂靠公司)				文档类型_客户资料
// CRDBIGA01			大数据征信查询授权书				文档类型(主借人)
// CRDBIGA02			大数据征信查询授权书				文档类型(主借人配偶)
// CRDBIGA03			大数据征信查询授权书				文档类型(公债人)
// CRDBIGA04			大数据征信查询授权书				文档类型(公债人配偶)
// CRDBIGA05			大数据征信查询授权书				文档类型(担保人)
// CRDBIGB01			大数据征信报告				文档类型(主借人)
// CRDBIGB02			大数据征信报告				文档类型(主借人配偶)
// CRDBIGB03			大数据征信报告				文档类型(共债人)
// CRDBIGB04			大数据征信报告				文档类型(共债人配偶)
// CRDBIGB05			大数据征信报告				文档类型(担保人)
// CRDPBOCA01			银行征信查询授权书				文档类型(主借人)
// CRDPBOCA02			银行征信查询授权书				文档类型(主借人配偶)
// CRDPBOCA03			银行征信查询授权书				文档类型(共债人)
// CRDPBOCA04			银行征信查询授权书				文档类型(共债人配偶)
// CRDPBOCA05			银行征信查询授权书				文档类型(担保人)
// CRDPBOCB01			银行征信报告				文档类型(主借人)
// CRDPBOCB02			银行征信报告				文档类型(主借人配偶)
// CRDPBOCB03			银行征信报告				文档类型(共债人)
// CRDPBOCB04			银行征信报告				文档类型(共债人配偶)
// CRDPBOCB05			银行征信报告				文档类型(担保人)
// CRDPICCA01			人保征信查询授权书				文档类型(主借人)
// CRDPICCA02			人保征信查询授权书				文档类型(主借人配偶)
// CRDPICCA03			人保征信查询授权书				文档类型(公债人)
// CRDPICCA04			人保征信查询授权书				文档类型(公债人配偶)
// CRDPICCA05			人保征信查询授权书				文档类型(担保人)
// CRDPICCB01			人保征信报告				文档类型(主借人)
// CRDPICCB02			人保征信报告				文档类型(主借人配偶)
// CRDPICCB03			人保征信报告				文档类型(公债人)
// CRDPICCB04			人保征信报告				文档类型(公债人配偶)
// CRDPICCB05			人保征信报告				文档类型(担保人)
// CRDMANA01			人工征信授权书				文档类型(主借人)
// CRDMANA02			人工征信授权书				文档类型(主借人配偶)
// CRDMANA03			人工征信授权书				文档类型(公债人)
// CRDMANA04			人工征信授权书				文档类型(公债人配偶)
// CRDMANA05			人工征信授权书				文档类型(担保人)
// CRDMANB01			人工征信报告				文档类型(主借人)
// CRDMANB02			人工征信报告				文档类型(主借人配偶)
// CRDMANB03			人工征信报告				文档类型(公债人)
// CRDMANB04			人工征信报告				文档类型(公债人配偶)
// CRDMANB05			人工征信报告				文档类型(担保人)
// CRDOTH01			其他征信资料				文档类型(主借人)
// CRDOTH02			其他征信资料				文档类型(主借人配偶)
// CRDOTH03			其他征信资料				文档类型(公债人)
// CRDOTH04			其他征信资料				文档类型(公债人配偶)
// CRDOTH05			其他征信资料				文档类型(担保人)
// CRDOTH06			第三方查询授权书				文档类型(第三方)
// VICDOC001			车辆照片				文档类型_车辆资料
// VICDOC002			车架号图片				文档类型_车辆资料
// VICDOC003			人车合影				文档类型_车辆资料
// VICDOC004			人车合影(平行进口车)				文档类型_车辆资料
// VICDOC005			随车校验单				文档类型_车辆资料
// VICDOC006			合格证				文档类型_车辆资料
// VICDOC007			关单				文档类型_车辆资料
// VICDOC008			车辆登记证				文档类型_车辆资料
// VICDOC009			提车承诺函				文档类型_车辆资料
// VICDOC010			缴费POS单				文档类型_车辆资料
// VICDOC011			垫款资料				文档类型_车辆资料
// VICDOC012			关单(平行进口车)				文档类型_车辆资料
// VICDOC013			商检单(平行进口车)				文档类型_车辆资料
// VICDOC014			一致性证书(平行进口车)				文档类型_车辆资料
// VICEVA001			二手车资料				文档类型_二手车资料
// VICEVA002			二手车评估报告				文档类型_二手车资料
// VICEVA003			车架号				文档类型_二手车资料
// VICEVA004			发动机舱				文档类型_二手车资料
// VICEVA005			铭牌				文档类型_二手车资料
// VICEVA006			左前45度				文档类型_二手车资料
// VICEVA007			右后45度				文档类型_二手车资料
// VICEVA008			左A柱与左B柱(主驾侧)				文档类型_二手车资料
// VICEVA009			左C柱(主驾侧)				文档类型_二手车资料
// VICEVA010			右A柱与右B柱(副驾侧)				文档类型_二手车资料
// VICEVA011			右C柱(副驾侧)				文档类型_二手车资料
// VICEVA012			左后翼子板流水槽(主驾侧)				文档类型_二手车资料
// VICEVA013			右后翼子板流水槽(副驾侧)				文档类型_二手车资料
// VICEVA014			左前减震器(主驾侧)				文档类型_二手车资料
// VICEVA015			右前减震器(副驾侧)				文档类型_二手车资料
// VICEVA016			中控台				文档类型_二手车资料
// VICEVA017			仪表盘				文档类型_二手车资料
// VICEVA018			安全带				文档类型_二手车资料
// VICEVA019			后备箱底板				文档类型_二手车资料
// VICEVA020			后备箱左侧底板				文档类型_二手车资料
// VICEVA021			后备箱右侧底板				文档类型_二手车资料
// VICEVA022			行驶证				文档类型_二手车资料
// VICEVA023			登记证书1-2页				文档类型_二手车资料
// VICEVA024			登记证书3-4页				文档类型_二手车资料
// VICEVA025			登记证书5-6页				文档类型_二手车资料
// VICEVA026			其他				文档类型_二手车资料
// VICEVA027			车辆发动机细节				文档类型_二手车资料
// VICEVA028			车辆内饰				文档类型_二手车资料
// VICEVA029			车辆外观				文档类型_二手车资料
// VICEVA030			原车主车辆行驶证+登记证				文档类型_二手车资料
// VICEVA031			车辆登记证页码至显示抵押权人页(二手车)				文档类型_二手车资料
// VICORI001			购车发票原件(重权)				文档类型_重权资料
// VICORI002			商业险保单原件(重权)				文档类型_重权资料
// VICORI003			交强险保单原件(重权)				文档类型_重权资料
// VICORI004			购置税发票原件(重权)				文档类型_重权资料
// VICORI005			登记证书原件(重权)				文档类型_重权资料
// VICORI006			盗抢险原件(重权)				文档类型_重权资料
// VICORI007			其它重权资料				文档类型_重权资料
// DLRDOC001			车商营业执照				文档类型_车商资料
// DLRDOC001			车商法人身份证				文档类型_车商资料
// DLRDOC001			车商转款委托书				文档类型_车商资料
// DLRDOC001			车商合作协议				文档类型_车商资料
// MTRADD001			退单资料				文档类型_补充资料
// MTRADD002			视频资料				文档类型_补充资料
// MTRADD003			申诉资料				文档类型_补充资料
// MTRADD004			面签照片				文档类型_补充资料
// MTRADD005			车辆销售发票				文档类型_补充资料
// MTRADD006			保单照片				文档类型_补充资料
// CTRDOC001			共同还款承诺函				文档类型_合同资料
// CTRDOC002			告客户书(担保类)				文档类型_合同资料
// CTRDOC003			新续保承诺				文档类型_合同资料
// CTRDOC004			非营运性质承诺书				文档类型_合同资料
// CTRDOC005			抵押声明书				文档类型_合同资料
// CTRDOC006			(新)无卡交易授权委托书				文档类型_合同资料
// CTRDOC007			(新)购车委托书				文档类型_合同资料
// CTRDOC008			车辆登记证影像版全部页				文档类型_合同资料
// CTRDOC009			车辆买卖合同(平行进口车)				文档类型_合同资料
// CTRBANK001			汽车分期承诺书				文档类型_银行资料
// CTRBANK002			专向分期付款业务告知书				文档类型_银行资料
// CTRBANK003			信用卡分期账户激活申请即确认授权书				文档类型_银行资料
// CTRBANK004			贷款居间服务协议				文档类型_银行资料
// CTRBANK005			消费贷款信息确认函				文档类型_银行资料
// CTRBANK006			汽车专向分期抵押合同				文档类型_银行资料
// CTRBANK007			二手车分期业务申请表				文档类型_银行资料
// CTRBANK008			分期申请意愿调查表				文档类型_银行资料
// CTRBANK009			办卡面签照				文档类型_银行资料
// CTRBANK010			制卡卡表				文档类型_银行资料
// CTRBANK011			制卡资料				文档类型_银行资料
// CTROTH001			鑫玉达购车合同				文档类型_其它资料
// CTROTH002			车辆GPS安装信息资料				文档类型_其它资料
// CTROTH003			加急件				文档类型_其它资料
// CTROTH004			业务受理表				文档类型_其它资料
// CTROTH005			GPS安装信息截图				文档类型_其它资料
// RECBANK01			渠道商垫款电子凭证				文档类型_凭证资料
// RECBANK02			垫款凭证				文档类型_凭证资料
// RECBANK03			放款凭证				文档类型_凭证资料
// RECBANK04			缴费凭证				文档类型_凭证资料
// RECBANK05			转款凭证				文档类型_凭证资料
// RECBANK06			走款凭证				文档类型_凭证资料
// RECBANK07			刷卡凭证				文档类型_凭证资料
