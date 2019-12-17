<template>
    <div class="xh-electronic-box">
        <div>
            <div class="xh-box-item">
                <svg-icon icon-class="user"/>
                <span>{{data.username}}</span>
                <span class="xh-electronic-tag" v-if="data.main">主借人</span>
                <span class="xh-electronic-tag" v-else>主借人配偶</span>
            </div>
            <div class="xh-box-item">
                <svg-icon icon-class="id-card"/>
                <span>{{data.idCard}}</span>
            </div>
            <div class="xh-box-item">
                <svg-icon icon-class="mobile-phone"/>
                <span>{{data.mobile}}</span>
            </div>
        </div>
        <div class="xh-contract-status">
            <div>
                <span v-if="data.contract"class="xh-contract-true">已签约</span>
                <span v-else class="xh-contract-false">未签约</span>
                <van-icon class="xh-contract-icon" name="arrow"/>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import { Icon } from 'vant';

  Vue.use(Icon);
  export default {
    name: "electronicContract",
    props: {
      data: {
        default: function () {
          return {
            username: '用户1',
            idCard: '5103031994022118888',
            mobile: '18381302203',
            main: true,
            contract: true,
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">

    .xh-electronic-box {
        background: rgb(242, 242, 242);
        margin: 1rem;
        padding: 1rem;
        display: flex;
        position: relative;

        .xh-box-item {
            margin-bottom: .5rem;

            &:last-child {
                margin-bottom: 0;
            }

            span {
                display: inline-block;
            }

            span:nth-of-type(1) {
                margin: 0 .5rem;
            }
        }

    }


    .xh-electronic-tag {
        background: #FDF1F0;
        border-radius: 4px;
        padding: .2rem;
        color: #C4252A;
    }

    .xh-contract-status {
        > div {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translate(0, -50%);
        }

        .xh-contract-true {
            color: rgb(7, 193, 96);
        }

        .xh-contract-false {
            color: rgb(238, 10, 36);
        }

        .xh-contract-icon {
            font-size: 2.4rem;
            font-weight: 600;
            display: inline-block;
            vertical-align: middle;
            color: #999;
        }
    }

</style>
