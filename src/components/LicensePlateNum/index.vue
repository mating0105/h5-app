<!--
 * @Description: 车牌号组件
 * @Author: shenah
 * @Date: 2019-12-19 13:55:28
 * @LastEditors  : shenah
 * @LastEditTime : 2020-01-22 16:02:23
 -->

<template>
  <div class="keyboard">
    <!-- 选择车牌号 首个汉字键盘 弹出层 -->
    <showList
      :arr="cacheNumArr"
      :first="cacheFirst"
      :isNew="false"
      :second="cacheSecond"
      @click="clickShowKeyboard"
      @scanChange="scanChange"
      isScan
      v-if="isEdit"
    ></showList>
    <div v-else>{{value}}</div>
    <div class="plate_number">
      <van-popup
        :overlay="true"
        overlay-class="displayNone"
        position="bottom"
        v-model="showChinese"
      >
        <div class="pop-content">
          <div class="operate-btn">
            <div
              @click.stop="closeKeyboard"
              class="cancel"
            >取消</div>
            <div class="pop-title">选择车牌号</div>
            <div
              @click.stop="sub"
              class="ok"
            >确定</div>
          </div>
          <div class="show-list-wrap">
            <showList
              :arr="numArr"
              :first="first"
              :second="second"
            ></showList>
          </div>
          <div class="plate_chinese_box">
            <!-- 点击对应的汉字，进行输入 -->
            <van-button
              :key="item.id"
              @click="checkChinese(index)"
              size="small"
              v-for="(item, index) in chList"
            >{{item.name}}</van-button>
          </div>
        </div>
      </van-popup>
    </div>
    <!-- 英文 键盘 -->
    <div class="allBoard">
      <van-popup
        position="bottom"
        v-model="showLetter"
      >
        <div class="pop-content">
          <div class="operate-btn">
            <div
              @click.stop="closeKeyboard"
              class="cancel"
            >取消</div>
            <div class="pop-title">选择车牌号</div>
            <div
              @click.stop="sub"
              class="ok"
            >确定</div>
          </div>
          <div class="show-list-wrap">
            <showList
              :arr="numArr"
              :first="first"
              :second="second"
            ></showList>
          </div>

          <div class="plate_number_box">
            <!-- 点击对应的字母或数字，进行输入 -->
            <van-button
              :key="item.id"
              @click="checkLetter(index)"
              size="small"
              v-for="(item, index) in letterList"
            >{{item.name}}</van-button>
          </div>
        </div>
      </van-popup>
    </div>
    <!-- 数字键盘 -->
    <div class="allBoard">
      <van-popup
        position="bottom"
        v-model="showNumber"
      >
        <div class="pop-content">
          <div class="operate-btn">
            <div
              @click.stop="closeKeyboard"
              class="cancel"
            >取消</div>
            <div class="pop-title">选择车牌号</div>
            <div
              @click.stop="sub"
              class="ok"
            >确定</div>
          </div>
          <div class="show-list-wrap">
            <showList
              :arr="numArr"
              :first="first"
              :second="second"
            ></showList>
          </div>

          <div class="plate_number_box">
            <!-- 点击对应的字母或数字，进行输入 -->
            <van-button
              :key="item.id"
              @click="checkNum(index)"
              size="small"
              v-for="(item, index) in numLetterList"
            >{{item.name}}</van-button>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import ShowList from "./showList";
// 其他组件
import { Popup, Notify } from "vant";
const Components = [Popup, Notify];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  name: "LicensePlateNum",
  components: { ShowList },
  props: {
    value: {
      type: [String, null, undefined]
    },
    type: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cacheFirst: "", // 缓存中文
      cacheSecond: "", // 缓存字母
      cacheNumArr: [], // 缓存数组
      showKeyboard: true, //车牌号输入框是否聚焦
      showChinese: false, //是否显示汉字键盘
      showLetter: false, //是否显示英文键盘
      showNumber: false, //是否显示数字键盘
      chList: [
        { name: "京", id: 1 },
        { name: "津", id: 2 },
        { name: "冀", id: 3 },
        { name: "晋", id: 4 },
        { name: "蒙", id: 5 },
        { name: "辽", id: 6 },
        { name: "吉", id: 7 },
        { name: "黑", id: 8 },
        { name: "沪", id: 9 },
        { name: "苏", id: 10 },
        { name: "浙", id: 11 },
        { name: "皖", id: 12 },
        { name: "闽", id: 13 },
        { name: "赣", id: 14 },
        { name: "鲁", id: 15 },
        { name: "豫", id: 16 },
        { name: "鄂", id: 17 },
        { name: "湘", id: 18 },
        { name: "粤", id: 19 },
        { name: "桂", id: 20 },
        { name: "琼", id: 21 },
        { name: "渝", id: 22 },
        { name: "川", id: 23 },
        { name: "贵", id: 24 },
        { name: "云", id: 25 },
        { name: "藏", id: 26 },
        { name: "陕", id: 27 },
        { name: "甘", id: 28 },
        { name: "青", id: 29 },
        { name: "宁", id: 30 },
        { name: "新", id: 31 },
        { name: "←", id: 99 }
      ], // 车牌号中文字典
      letterList: [
        // 字母
        { name: "Q", id: 38 },
        { name: "W", id: 39 },
        { name: "E", id: 40 },
        { name: "R", id: 41 },
        { name: "T", id: 42 },
        { name: "Y", id: 43 },
        { name: "U", id: 44 },
        { name: "I", id: 45 },
        { name: "O", id: 46 },
        { name: "P", id: 47 },
        { name: "A", id: 48 },
        { name: "S", id: 49 },
        { name: "D", id: 50 },
        { name: "F", id: 51 },
        { name: "G", id: 52 },
        { name: "H", id: 53 },
        { name: "J", id: 54 },
        { name: "K", id: 55 },
        { name: "L", id: 56 },
        { name: "Z", id: 57 },
        { name: "X", id: 58 },
        { name: "C", id: 59 },
        { name: "V", id: 60 },
        { name: "B", id: 61 },
        { name: "N", id: 62 },
        { name: "M", id: 63 },
        { name: "←", id: 99 }
      ],
      numLetterList: [
        // 数字加字母
        { name: "1", id: 28 },
        { name: "2", id: 29 },
        { name: "3", id: 30 },
        { name: "4", id: 31 },
        { name: "5", id: 32 },
        { name: "6", id: 33 },
        { name: "7", id: 34 },
        { name: "8", id: 35 },
        { name: "9", id: 36 },
        { name: "0", id: 37 },
        { name: "Q", id: 38 },
        { name: "W", id: 39 },
        { name: "E", id: 40 },
        { name: "R", id: 41 },
        { name: "T", id: 42 },
        { name: "Y", id: 43 },
        { name: "U", id: 44 },
        { name: "I", id: 45 },
        { name: "O", id: 46 },
        { name: "P", id: 47 },
        { name: "A", id: 48 },
        { name: "S", id: 49 },
        { name: "D", id: 50 },
        { name: "F", id: 51 },
        { name: "G", id: 52 },
        { name: "H", id: 53 },
        { name: "J", id: 54 },
        { name: "K", id: 55 },
        { name: "L", id: 56 },
        { name: "Z", id: 57 },
        { name: "X", id: 58 },
        { name: "C", id: 59 },
        { name: "V", id: 60 },
        { name: "B", id: 61 },
        { name: "N", id: 62 },
        { name: "M", id: 63 },
        { name: "←", id: 99 }
      ], // 键盘字母与数字字典
      first: "", // 汉字
      second: "", // 字母
      numArr: [] // 车牌号剩下
    };
  },
  watch: {
    value(val, oldValue) {
      if (oldValue !== "") {
        this.judgeCarNum(val);
      } else {
        this.judgeCarNum(val, true);
      }
    }
  },
  mounted() {
    this.judgeCarNum(this.value, true);
  },
  methods: {
    judgeCarNum(num, flag) {
      if (num) {
        const [first, second, ...numArr] = num.substr(0, 8).split("");
        this.first = first;
        this.second = second;
        this.numArr = numArr;
        if (flag) {
          this.cacheFirst = first;
          this.cacheSecond = second;
          this.cacheNumArr = numArr;
        }
      } else {
        this.first = "";
        this.second = "";
        this.numArr = [];
      }
    },
    // 唤起键盘
    clickShowKeyboard() {
      this.judgeCarNum(this.value);
      if (!this.first) {
        this.showChinese = true;
      } else if (!this.second && this.numArr.length === 0) {
        this.showChinese = false;
        this.showLetter = true;
        this.showNumber = false;
      } else {
        this.showChinese = false;
        this.showLetter = false;
        this.showNumber = true;
      }
    },
    // 选择车牌号前面的汉字
    checkChinese(index) {
      // 如果点击删除键，删除第一个格的内容
      if (this.chList[index].id == 99) {
        this.first = "";
      } else {
        // 把选中的字赋值给第一个格，并且切换键盘
        this.first = this.chList[index].name;
        this.showChinese = false;
        this.showLetter = true;
      }
    },
    // 选择车牌号字母
    checkLetter(index) {
      // 如果点击删除键，删除 numArr 的最后一个值
      if (this.letterList[index].id == 99) {
        if (this.second !== "") {
          this.second = "";
          this.showChinese = false;
          this.showLetter = true;
          this.showNumber = false;
        } else {
          this.first = "";
          this.showChinese = true;
          this.showLetter = false;
          this.showNumber = false;
        }
      } else {
        this.second = this.letterList[index].name;
        this.showChinese = false;
        this.showLetter = false;
        this.showNumber = true;
      }
    },
    // 选择车牌号后面的数字
    checkNum(index) {
      // 如果点击删除键，删除 numArr 的最后一个值
      if (this.numLetterList[index].id == 99) {
        if (this.numArr.length) {
          this.numArr.pop();
        } else {
          this.second = "";
          this.showChinese = false;
          this.showLetter = true;
          this.showNumber = false;
        }
      } else {
        // 把选中的值 push 到 numArr 内
        this.numArr.push(this.numLetterList[index].name);
        // 如果 numArr 中的值超过 7 个（车牌号的最大位数），删除最后一个
        if (this.numArr.length > 6) {
          this.numArr.pop();
        }
      }
    },
    // OCR识别
    scanChange() {
      this.$bridge.callHandler("plateOCR", null, data => {
        const { PLATE_NUM: plateNum } = data;
        this.judgeCarNum(plateNum, true);
        this.$emit("input", plateNum);
        this.$emit("licensePlateNumChange", {
          value: plateNum,
          type: this.type
        });
      });
    },
    sub() {
      const first = this.first;
      const second = this.second;
      const numArr = this.numArr;
      const combinate = `${first}${second}${numArr.join("")}`;
      if (combinate.length === 7 || combinate.length === 8) {
        this.cacheFirst = first;
        this.cacheSecond = second;
        this.cacheNumArr = numArr;
        this.$emit("input", combinate);
        this.$emit("licensePlateNumChange", {
          value: combinate,
          type: this.type
        });
        this.clear();
      } else {
        Notify("请把车牌号选择完成");
      }
    },
    clear() {
      this.first = "";
      this.second = "";
      this.numArr = [];
      this.showChinese = false;
      this.showLetter = false;
      this.showNumber = false;
    },
    // 关闭虚拟键盘
    closeKeyboard() {
      this.clear();
    }
  }
};
</script>

<style scoped lang="scss">
.keyboard {
  width: 100%;
  position: relative;
  .show-list-wrap {
    padding: 0 1rem;
  }
}
.class-close-box {
  width: 2rem;
  height: 1.5rem;
  position: absolute;
  right: 0.5rem;
  top: -1.3rem;
}
.class-close-box-div {
  width: 1rem;
  height: 1rem;
  font-size: 0.8rem;
  line-height: 1rem;
  margin: auto;
  text-align: center;
  border: 1px solid #666;
  border-radius: 50%;
}
.class-close-box-li {
  width: 1px;
  height: 0.5rem;
  background: #666;
  margin: auto;
}
.overflow-y {
  overflow-y: inherit;
}
.class-van-button-small {
  min-width: 0;
  border-radius: 5px;
  margin: 5px 2px;
  box-shadow: 5px 5px 5px #aaa;
}
.class-plate-box {
  width: 100%;
  padding: 0.7rem 0.5rem;
  box-sizing: border-box;
  background: #fff;
  position: relative;
}
.plate_number {
  .van-popup {
    @extend .overflow-y;
  }
  .van-popup--bottom {
    background: #eee;
  }
  .plate_chinese_box {
    width: 100%;
    @extend .class-plate-box;
    .close-box {
      @extend .class-close-box;
      div {
        @extend .class-close-box-div;
      }
      li {
        @extend .class-close-box-li;
      }
    }
    .van-button--small {
      width: 11.3%;
      height: 3.5rem;
      @extend .class-van-button-small;
    }
  }
}
.allBoard {
  .van-popup {
    @extend .overflow-y;
  }
  .operate-btn {
  }
  .plate_number_box {
    width: 100%;
    @extend .class-plate-box;
    .close-box {
      @extend .class-close-box;
      div {
        @extend .class-close-box-div;
      }
      li {
        @extend .class-close-box-li;
      }
    }
    .van-button--small {
      width: 8.8%;
      height: 3rem;
      @extend .class-van-button-small;
    }
    .van-button--small:nth-child(1) {
      margin-bottom: 5px;
    }
    .van-button--small:nth-child(21) {
      margin-left: 5%;
    }
    .van-button--small:nth-child(30) {
      margin-left: 10%;
    }
    .van-button--small:last-child {
      width: 13%;
    }
  }
}
.pop-content {
  width: 100%;
  background-color: #fff;
  .operate-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 1rem;
    .cancel {
      font-size: 1rem;
      color: #1989fa;
    }
    .pop-title {
      font-size: 1.5rem;
      color: #323233;
    }
    .ok {
      font-size: 1rem;
      color: #1989fa;
    }
  }
}
</style>