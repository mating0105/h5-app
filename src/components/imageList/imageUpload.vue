<template>
    <ViewPage class="xh-page" :backFn="backFn" title="全部照片">
        <Card>
            <template v-slot:header>
                照片
            </template>
            <div class="image-title">身份证正面</div>
            <van-uploader v-model="fileList" :before-delete="deleteImage"/>
        </Card>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import Vue from 'vue'
  import { Uploader, Image, Dialog } from 'vant';

  Vue.use(Uploader).use(Image);
  export default {
    name: "imageUpload",
    components: {
      ViewPage,
      Card
    },
    data () {
      return {
        fileList: [
          {url: 'https://img.yzcdn.cn/vant/leaf.jpg'}
        ]
      }
    },
    props: {
      visible: {}
    },
    methods: {
      backFn () {
        this.$emit('update:visible', false)
      },
      deleteImage () {
        return new Promise((resolve, reject) => {
          Dialog.confirm({
            title: '删除',
            message: '确定删除照片吗？'
          }).then(() => {
            resolve()
          }).catch(() => {
            reject()
          });
        })
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

    .image-title {
        margin-bottom: 5px;
    }

</style>
