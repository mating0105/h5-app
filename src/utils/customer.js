//客户需要信息
//通过身份证号 获取性别  1男2女
export function getSex(IdNO) {
    if (IdNO.length == 18) {
        return IdNO.charAt(16) % 2 == 0 ? "2" : "1";
    } else if (IdNO.length == 15) {
        return IdNO.charAt(14) % 2 == 0 ? "2" : "1";
    } else {
        return "";
    }
}
//通过身份证号 获取出生日期
export function getBirth(IdNO) {
    let birthday = "";
    if (IdNO.length == 18) {
        birthday = IdNO.substr(6, 8);
        return birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    } else if (IdNO.length == 15) {
        birthday = "19" + IdNO.substr(6, 6);
        return birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    } else {
        return "";
    }
}
//通过身份证号 获取年龄
export function getAge(IdNO){
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - IdNO.substring(6, 10) - 1;
    if (IdNO.substring(10, 12) < month || IdNO.substring(10, 12) == month && IdNO.substring(12, 14) <= day) {
        age++;
    }
    return age;
}

