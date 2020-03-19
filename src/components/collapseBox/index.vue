<template>
    <div>
        <van-collapse class="collapse is-always-shadow" v-for="(item,index) in 5" v-model="activeName" accordion @change="changeitem">
            <van-collapse-item :name="index">
                <div slot="title">
                    <div class="collapse__header">
                        <div>
                            <span class="collapse_label">{{label}}</span>
                            <van-tag class="collapse_tag" :color="signColor" :text-color="textColor" size="large" v-show="showSign">{{sign}}</van-tag>
                        </div>
                        <div v-show="showTime" class="collapse_time">
                            {{time}}
                        </div>
                    </div>
                </div>
                <div v-if="$slots.default">
                    <slot></slot>
                </div>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>

<script>
import Vue from "vue";
import { Tag, Collapse, CollapseItem } from "vant";
Vue.use(Tag, Collapse, CollapseItem);
  export default {
    name: "collapsBox",
    props: {
      bodyPadding: Boolean,
      label: {
        type: String,
        default: '我是标题'
      },
      sign:{
        type: String,
        default: '标记'
      },
      signColor:{
        type: String,
        default: '#00C67C'
      },
      textColor:{
        type: String,
        default: '#fff'
      },
      showSign:{
        type: Boolean,
        default: false
      },
      time:{
        type:String,
        default: '2020-03-11 10:30:30'
      },
      showTime:{
        type: Boolean,
        default: false
      },
      changeitem:{
        type: Function,
        default: false
      }
    },
    data(){
        return {
            activeName:0
        }
    },
  }
</script>

<style scoped lang="scss">
    .collapse.is-always-shadow {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }

    .collapse {
        border-radius: 5px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        color: #303133;
        transition: .3s;
        margin: 1rem;
        .collapse__header {
            // border-bottom: 1px solid #ebeef5;
            box-sizing: border-box;
            .collapse_label{
                font-size: 1.6rem;
                font-weight: Bold;
                color: #262626;
            }
            .collapse_tag{
                margin-left: 0.4rem;
            }
            .collapse_time{
                color: #A6A6A6;
                font-size: 1.2rem;
                margin-top:0.6rem;
            }
        }

        .collapse__footer {
            padding: 1rem;
            border-top: 1px solid #ebeef5;
            box-sizing: border-box;
        }
    }
    .collapse{
        .van-collapse-item__title.van-cell{
            display: flex;
            align-items: center;
        }
    }


</style>
