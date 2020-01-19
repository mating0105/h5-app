<template>
    <div class="xh-image">
        <div>
            <slot name="header"></slot>
        </div>
        <div class="xh-image-list">
            <div class="image-item" v-for="(item, index) in list" :key="index" v-if="index<=3">
                <van-image
                        lazy-load
                        height="75px"
                        :src="item.documentRoute"
                        @click="openImagePreview(index)"
                />
                <div class="xh-image-sm" v-if="index === 3" @click="showImageUpload = true">
                    {{view ? '查看全部' : '上传更多'}}
                </div>
                <div class="xh-image-sm" v-else>
                    {{item.declare}}
                </div>
            </div>
            <div class="image-item" v-if="list.length<=3 && !view">
                <div class="xh-no-image" @click="showImageUpload = true">
                    <van-icon class="xh-image-icon" name="plus"/>
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
  import { Uploader, Image, Icon, ImagePreview, Lazyload } from 'vant';
  import _ from 'lodash'

  Vue.use(Uploader).use(Image).use(Icon).use(ImagePreview).use(Lazyload);
  export default {
    name: "imageList",
    props: {
      dataList: Array,
      view: Boolean
    },
    components: {
      imageUpload
    },
    computed: {
      list () {
        const arr = this.dataList.map(item => item.fileList);
        return _.flatten(arr)
      }
    },
    data () {
      return {
        showImageUpload: false
      }
    },
    methods: {
      openImagePreview (index) {
        const list = this.list.map(item => item.documentRoute)
        ImagePreview({
          images: list,
          startPosition: index
        });
      }
    }
  }
</script>

<style lang="scss">

    .xh-image {
        /*background-color: #f7f8fa;*/
        padding: 15px 5px;
    }

    .xh-image-list {
        overflow: hidden;
        padding-bottom: 25px;

        & > :nth-child(4) .xh-image-sm {
            position: absolute;
            top: 0;
            line-height: 75px;
            background: rgba(0, 0, 0, 0.6);
            color: #FFFFFF;
            bottom: 2px;
        }
    }

    .image-item {
        width: 25%;
        padding: 0 4.5px;
        position: relative;
        float: left;

        .van-image, .xh-image-sm {
            border-radius: 6px;
            overflow: hidden;
        }

        .xh-image-sm {
            color: #999999;
            /*background: rgba(0, 0, 0, 0.6);*/
            /*-webkit-backdrop-filter: blur(5px);*/
            /*backdrop-filter: blur(5px);*/
            position: absolute;
            bottom: -25px;
            left: 5px;
            right: 5px;
            white-space: nowrap;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .xh-no-image {
        height: 75px;
        background: white;
        border: 1px dashed rgba(230, 230, 230, 1);
        border-radius: 6px;
    }

    .xh-image-icon {
        position: absolute;
        font-size: 2.5rem;
        color: #999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

</style>
