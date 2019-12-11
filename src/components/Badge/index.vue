<template>
  <div>
    <div class="xh-badge" :style="{ top: toTop+'px', right: toRight+'px' }"><span :class="isNumber?`xh-badge-number`:`xh-badge-dot`">{{ toValue }}</span></div>
  </div>
</template>

<script>
export default {
  data() {},
  props: {
    isNumber: {
      type: Boolean,
      default: false
    },
    toValue: {
      type: [Number, String],
      default: () => {
        return '';
      }
    },
    toTop: {
      type: [Number, String],
      default: () => {
        return '10';
      }
    },
    toRight: {
      type: [Number, String],
      default: () => {
        return '10';
      }
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {},
}
</script>

<style lang="scss">
.xh-badge {
  position: absolute;
  transform: translateY(-50%) translateX(100%);
  .xh-badge-number{
    background-color: #f56c6c;
    border-radius: 10px;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
  }
  .xh-badge-dot {
    background-color: #f56c6c;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    line-height: 18px;
    padding: 0;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
    height: 10px;
    width: 10px;
    padding: 0;
    border-radius: 50%;
  }
}
</style>
