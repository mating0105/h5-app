<template>
    <div>
        <van-collapse class="collapse is-always-shadow" v-for="(item,index) in creditList" v-model="activeName" accordion @change="changeitem">
            <van-collapse-item :name="index">
                <div slot="title">
                    <div class="collapse__header">
                        <div>
                            <span class="collapse_label">{{item.label}}</span>
                            <van-tag class="collapse_tag" :color="item.signColor" :text-color="item.textColor" size="large" v-show="item.showSign">{{item.creditResult}}</van-tag>
                        </div>
                        <div v-show="item.showTime" class="collapse_time">
                            {{item.registerDate}}
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
      changeitem:{
        type: Function,
        default: false
      },
      creditList:{
        type: Array,
        default: []
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
