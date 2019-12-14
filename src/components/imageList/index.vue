<template>
    <div class="xh-image">
        <div>
            <slot name="header"></slot>
        </div>
        <div class="xh-image-list">
            <div class="image-item" v-for="(item, index) in dataList" :key="index" v-if="index<=3">
                <van-image
                        lazy-load
                        height="7rem"
                        :src="item.url"
                />
                <div class="xh-image-sm" v-if="index === 3" @click="showImageUpload = true">
                    {{view ? '查看全部' : '上传更多'}}
                </div>
                <div class="xh-image-sm" v-else>
                    {{item.declare}}
                </div>
            </div>
        </div>
        <transition name="page-move">
            <imageUpload :visible.sync="showImageUpload" v-if="showImageUpload" :dataList="dataList"></imageUpload>
        </transition>
    </div>
</template>

<script>
  import Vue from 'vue';
  import imageUpload from './upload'
  import { Uploader, Image } from 'vant';

  Vue.use(Uploader).use(Image);
  export default {
    name: "imageList",
    props: {
      dataList: Array
    },
    components: {
      imageUpload
    },
    data () {
      return {
        showImageUpload: false,
        view: false
      }
    },
    methods: {
      // afterRead (file) {
      //   // 此时可以自行将文件上传至服务器
      //   console.log(file);
      // }
    }
  }
</script>

<style scoped lang="scss">

    .xh-image {
        background-color: #f7f8fa;
        padding: 15px 5px;
    }

    .xh-image-list {
        overflow: hidden;

        & > :nth-child(4) .xh-image-sm {
            position: absolute;
            top: 0;
            line-height: 7rem;
        }
    }

    .image-item {
        width: 25%;
        padding: 0 5px;
        position: relative;
        float: left;

        .xh-image-sm {
            background: rgba(0, 0, 0, 0.5);
            -webkit-backdrop-filter: blur(5px);
            backdrop-filter: blur(5px);
            color: white;
            position: absolute;
            bottom: 2px;
            left: 5px;
            right: 5px;
            white-space: nowrap;
            text-align: center;
            overflow: hidden;
            text-overflow:ellipsis;
        }
    }

</style>
