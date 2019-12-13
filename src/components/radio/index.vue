<template>
    <div class="xh-radio-group">
        <slot></slot>
    </div>
</template>

<script>
  import Emitter from '@/utils/emitter';

  export default {
    name: "radio",
    componentName: "radio",
    mixins: [Emitter],
    props: {
      value: {},
      disabled: false
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    created () {
      this.$on('changeRadio', value => {
        this.$emit('change', value);
      });
    },
  }
</script>

<style lang="scss">

    .xh-radio-group {
        display: flex;
    }

    .xh-radio {
        padding: 10px 10px;
        flex: 1;
        line-height: 1;
        border: 1px solid #dcdfe6;
        border-left: 0;
        color: #323233;
        text-align: center;
        margin: 0;
        cursor: pointer;
        transition: all .3s cubic-bezier(.645, .045, .355, 1);
        font-size: 14px;
        white-space: nowrap;
        vertical-align: middle;

        &.active {
            background: #C4252A;
            color: white;
        }

        &:first-child {
            border-left: 1px solid #dcdfe6;
            border-radius: 6px 0 0 6px;
        }

        &:last-child {
            border-radius: 0 6px 6px 0;
        }
    }

</style>
