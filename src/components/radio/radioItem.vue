<template>
    <div class="xh-radio" :class="{active: value === label}">
        <slot></slot>
        <input
                class="radio-button__orig-radio"
                :value="label"
                type="radio"
                v-model="value"
                @change="changeRadio"
                :disabled="isDisabled"
        >
        <template v-if="!$slots.default">{{label}}</template>
    </div>
</template>

<script>
  export default {
    name: "radioItem",
    props: {
      label: {},
      isDisabled: false
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
      _radioGroup() {
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
    },
    methods: {
      changeRadio () {
        this.$nextTick(() => {
          this.dispatch('radio', 'changeRadio', this.value);
        });
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>

    .radio-button__orig-radio {
        opacity: 0;
        outline: none;
        position: absolute;
        z-index: -1;
    }

</style>
