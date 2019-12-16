<template>
    <ViewPage :loading="loading">
        <Card>
            <template v-slot:header>
                电子签约
            </template>


        </Card>
        <Card style="margin-top: 10px;">
            <template v-slot:header>
                征信查询照片
            </template>


        </Card>
        <Card style="margin-top: 10px;">
            <template v-slot:header>
                意见描述
            </template>
            <van-field v-model="remarks" :border="false" type="textarea" placeholder="输入说明" rows="1"
                       :autosize='autosize' class="zh-textarea"/>
        </Card>

        <!-- 提交按钮 -->
        <div style="margin: 45px 10px 30px 10px; display: flex; flex-direction: row;">
            <van-button size="large"
                        style="background-color: #C4252A; color: white;margin-left: 3px;border-radius: 8px;flex:1;"
            >下一步
            </van-button>
        </div>
    </ViewPage>
</template>

<script>

  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card';
  import { Field, Button } from 'vant'
  import Vue from 'vue'

  Vue.use(Field).use(Button)

  export default {
    name: "creditNextStep",
    components: {
      ViewPage,
      Card
    },
    data () {
      return {
        loading: false,
        remarks: "",
        autosize: {
          maxHeight: 100,
          minHeight: 80
        }
      }
    }
  }
</script>

<style scoped>

</style>
