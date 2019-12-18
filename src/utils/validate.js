/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 
 * @param {string} idCard 身份证号
 * @param {Number} num 返回类型 num=1 :出生年月  num=2 :性别  num=3 :年龄
 */
export function toUserCard(idCard, num) {
  if (num == 1) {
    //获取出生日期
    var birth = idCard.substring(6, 10) + "-" + idCard.substring(10, 12) + "-" + idCard.substring(12, 14);
    return birth;
  }
  if (num == 2) {
    //获取性别
    if (parseInt(idCard.substr(16, 1)) % 2 == 1) {
      //男 1
      return "1";
    } else {
      //女 2
      return "2";
    }
  }
  if (num == 3) {
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - idCard.substring(6, 10) - 1;
    if (idCard.substring(10, 12) < month || idCard.substring(10, 12) == month && idCard.substring(12, 14) <= day) {
      age++;
    }
    return age;
  }
}
