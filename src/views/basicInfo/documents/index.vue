<template>
  <div>
    <imageList :dataList="dataList"></imageList>
  </div>
</template>

<script>
import imageList from '@/components/imageList'

export default {
  components: {
    imageList
  },
  data() {
    return {
      dataList: [
        {
          url: 'https://img.yzcdn.cn/vant/cat.jpeg',
          declare: '身份证正面',
          deletable: false,
          isRequire: true
        },{
          url: 'https://img.yzcdn.cn/vant/cat.jpeg',
          declare: '身份证反面',
          deletable: false,
          isRequire: true
        },{
          url: 'https://img.yzcdn.cn/vant/cat.jpeg',
          declare: '银行征信查询授权书',
          deletable: true,
          isRequire: true
        },{
          url: 'https://img.yzcdn.cn/vant/cat.jpeg',
          declare: '大数据征信查询授权书',
          deletable: true,
          isRequire: true
        },{
          url: 'https://img.yzcdn.cn/vant/cat.jpeg',
          declare: '银行卡正反面',
          deletable: true,
          isRequire: true
        },
      ]
    }
  }
}
</script>

<style lang="scss">
  
</style>
