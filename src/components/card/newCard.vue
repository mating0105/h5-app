<template>
    <div :class="isShowTitle?'card is-always-shadow':''">
        <div class="card__header">
            <div>
                <span class="card_label">{{label}}</span>
                <van-tag :color="signColor" :text-color="textColor" size="large" v-show="showSign">{{sign}}</van-tag>
            </div>
            <div v-show="showTime" class="card_time">
                {{time}}
            </div>
        </div>
        <!-- <div class="card__sub__title" v-if="$slots.subTitle">
            <slot name="subTitle"></slot>
        </div> -->
        <div :class="{card__body: bodyPadding}" v-if="$slots.default">
            <slot></slot>
        </div>
        <div class="card__footer" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { Tag } from "vant";
Vue.use(Tag);
  export default {
    name: "card",
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
      isShowTitle:{
          type: Boolean,
      }
    }
  }
</script>

<style scoped lang="scss">
    .card.is-always-shadow {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }

    .card {
        border-radius: 5px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        // overflow: hidden;
        color: #303133;
        transition: .3s;
        margin: 1rem;
        .card__header {
            padding: 1rem;
            border-bottom: 1px solid #ebeef5;
            box-sizing: border-box;
            .card_label{
                font-size: 1.6rem;
                font-weight: Bold;
                color: #262626;
            }
            .card_time{
                color: #A6A6A6;
                font-size: 1.2rem;
                margin-top:0.8rem;
            }
        }
        // .card__sub__title{
        //     padding: 1rem;
        //     font-size: 1.4rem;
        //     // margin-top:0.8rem;
        //     color:red;
        //     font-weight: Bold;
        // }

        .card__footer {
            padding: 1rem;
            border-top: 1px solid #ebeef5;
            box-sizing: border-box;
        }

        .card__body {
            padding: 1rem;
        }
    }


</style>
