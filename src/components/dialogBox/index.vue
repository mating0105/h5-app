<template>
    <div class="dialogBox">
        <van-dialog
            use-slot
            :title="title"
            :show-confirm-button="showConfirmButton"
            :show-cancel-button="showCancelButton"
            :confirm-button-text='confirmButtonText'
            :confirm-button-color='confirmButtonColor'
            :cancel-button-text='cancelButtonText'
            :cancel-button-color='cancelButtonColor'
            v-model="show"
            message-align='center'
            @cancel="onCancel()"
            @confirm="onConfirm()"
            >
            <div class="dialog__body" v-if="$slots.default">
                <slot></slot>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import Vue from "vue";
import { Dialog } from "vant";
Vue.use(Dialog);
export default {
    name: "dialogBox",
    props: {
      title: {
        type: String,
        default: '标题'
      },
      //显示确认按钮
      showConfirmButton:{
        type: Boolean,
        default: true
      },
      //显示取消按钮
      showCancelButton:{
        type: Boolean,
        default: true
      },
      //确认按钮-文字
      confirmButtonText:{
        type: String,
        default: '确认'
      },
      //确认按钮-颜色
      confirmButtonColor:{
        type: String,
        default: '#000'
      },
      //取消按钮-文字
      cancelButtonText:{
        type: String,
        default: '再想想'
      },
      //取消按钮-颜色
      cancelButtonColor:{
        type: String,
        default: 'red'
      },
      //是否显示弹框
      showDialog:{
        type:Boolean,
        default:false
      },
      //方法-取消
      onCancel:{
        type:Function,
        default:false
      },
      //方法-确认
      onConfirm:{
        type:Function,
        default:false
      },
    },
    data(){
        return {
            show:false
        }
    },
    watch: {
        showDialog(val) {
            this.show = val;
        }
    },
  }
</script>

<style scoped lang="scss">
    .dialog__body {
        padding: 1rem;
    }
</style>
