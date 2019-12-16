<template>
    <div>
        <div style="margin-bottom: 10px;"><span v-if="data.isRequire" class="xh-is-require">*</span>{{data.declare}}</div>
        <van-uploader :after-read="afterRead" :deletable="data.deletable" :class="{'xh-image-active': data.deletable}" :disabled="!data.deletable"
                      v-model="fileList" :before-delete="deleteImage"/>
    </div>
    <!--    ff6034-->
</template>

<script>
  import { Uploader, Image, Dialog } from 'vant';
  import Vue from 'vue'

  Vue.use(Uploader).use(Image);

  export default {
    name: "item",
    props: {
      data: {
        default: function () {
          return {
            isRequire: true,
            imageDir: '照片名称',
            deletable: false,
            fileList: []
          }
        }
      }
    },
    data () {
      return {
        fileList: []
      }
    },
    methods: {
      /**
       * 删除照片
       * @return {Promise<any>}
       */
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
      },
      /**
       * 上传文件
       * @return {Promise<any>}
       */
      afterRead (file) {
        console.log(file)
      }
    },
    mounted () {
      if (this.data && this.data.url) {
        this.fileList = [
          {
            url: this.data.url
          }
        ]
      }
      if (this.data && this.data.fileList) {
        this.fileList = this.data.fileList
      }
      this.data.fileList = this.fileList
    }
  }
</script>

<style lang="scss">
    $upload-color: #ff6034;
    .van-uploader.xh-image-active {
        .van-uploader__upload {
            border-color: $upload-color;
        }

        .van-uploader__upload-icon {
            color: $upload-color;
        }
    }

    .xh-is-require {
        color: red;
    }
</style>
