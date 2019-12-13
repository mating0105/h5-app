<template>
    <div class="xh-radio" :class="[{active: value === label}, { 'is-disabled': isDisabled }]" @click="changeRadio">
        <slot></slot>
        <template v-if="!$slots.default">{{label}}</template>
    </div>
</template>

<script>
  import Emitter from '@/utils/emitter';

  export default {
    name: "radioItem",
    mixins: [Emitter],
    props: {
      label: {},
      disabled: Boolean
    },
    data () {
      return {
        focus: false
      }
    },
    computed: {
      value: {
        get () {
          return this._radioGroup.value;
        },
        set (value) {
          this._radioGroup.$emit('input', value);
        }
      },
      _radioGroup () {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'radio') {
            parent = parent.$parent;
          } else {
            return parent;
          }
        }
        return false;
      },
      isDisabled () {
        return this.disabled || this._radioGroup.disabled;
      },
    },
    methods: {
      changeRadio () {
        this.$nextTick(() => {
          this.dispatch('radio', 'changeRadio', this.label);
        });
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="scss">

</style>
