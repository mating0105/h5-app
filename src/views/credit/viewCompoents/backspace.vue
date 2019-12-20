<template>
    <ViewPage class="xh-page" :backFn="backFn" title="回退" :loading="loading">
        <Card>
            <template v-slot:header>
                意见描述
            </template>
            <van-field v-model="remarks" :border="false" type="textarea" placeholder="输入说明" rows="1"
                       :autosize='autosize' class="zh-textarea"/>
        </Card>

        <!-- 提交按钮 -->
        <div class="xh-submit-box">
            <van-button size="large" @click="$emit('submit', remarks)"
                        class="xh-btn"
            >提交
            </van-button>
        </div>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'

  export default {
    name: "backspace",
    components: {
      ViewPage,
      Card
    },
    data() {
      return {
        loading: false,
        remarks: '',
        autosize: {
          maxHeight: 100,
          minHeight: 80
        },
      }
    },
    props: {
      visible: {},
    },
    methods: {
      backFn () {
        this.$emit('update:visible', false)
      }
    }
  }
</script>

<style scoped>

    .xh-page {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #f7f8fa;
    }

</style>
