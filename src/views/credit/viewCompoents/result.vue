<template>
    <Card>
        <template v-slot:header>
            {{isBank ? '银行': '大数据'}}征信结果
        </template>
        <div class="xh-electronic-box" v-for="(item, index) in dataList" :key="index">
            <div>
                <div class="xh-box-item">
                    <svg-icon icon-class="user"/>
                    <span>{{item.creditPersonName}}</span>
                    <span class="xh-danger-tag">{{returnText(item.creditObjectType, 'credit_object_type')}}</span>
                </div>
                <div class="xh-box-item">
                    <svg-icon icon-class="id-card"/>
                    <span>{{item.cpCertificateNum}}</span>
                </div>
                <div class="xh-box-item">
                    <svg-icon icon-class="mobile-phone"/>
                    <span>{{item.telephone}}</span>
                </div>
            </div>
            <div class="xh-contract-status">
                <div @click="showPopup(item)">
                    <span v-if="item[type] === 'pass'" class="xh-contract-true">{{isBank ? '银行': '大数据'}}征信通过</span>
                    <span v-else-if="item[type] === 'not_pass'" class="xh-contract-false">{{isBank ? '银行': '大数据'}}征信未通过</span>
                    <span v-else>请选择征信结果</span>
                    <van-icon class="xh-contract-icon" name="arrow"/>
                </div>
            </div>
        </div>
        <van-popup v-model="show" position="bottom" get-container="#app">
            <van-picker
                    ref="picker"
                    show-toolbar
                    :columns="credit_result"
                    value-key="label"
                    @cancel="show = false"
                    @confirm="onSelect"
            />
        </van-popup>
    </Card>
</template>

<script>
  import Vue from 'vue';
  import { Icon, Popup, Picker } from 'vant';
  import Card from '@/components/card';

  Vue.use(Icon).use(Popup).use(Picker);
  export default {
    name: "electronicContract",
    components: {
      Card
    },
    data () {
      return {
        show: false,
        index: 0
      }
    },
    props: {
      isBank: Boolean,
      dataList: Array,
    },
    computed: {
      wordbook () {
        return this.$store.state.user.wordbook
      },
      credit_result () {
        return this.$store.state.user.wordbook.credit_result || []
      },
      type () {
        return this.isBank ? 'creditResult' : 'bigDataResult'
      }
    },
    methods: {
      // 字典转换
      returnText (val, key) {
        let name = '';
        if (this.wordbook[key]) {
          this.wordbook[key].forEach(e => {
            if (e.value === val) {
              name = e.label;
            }
          });
        }
        return name;
      },
      showPopup (item, index) {
        this.show = true
        this.currentData = item
        this.index = 0
        try {
          this.credit_result.forEach((result, index) => {
            if (item[this.type] === result.value) {
              this.index = index
              throw Error()
            }
          })
        } catch (e) {
        }
        this.$nextTick(() => {
          this.$refs['picker'].setIndexes([this.index])
        })
      },
      onSelect (item, index) {
        this.currentData[this.type] = item.value
        this.show = false
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
            margin-bottom: 1rem;

            /*&:last-child {*/
            /*    margin-bottom: 0;*/
            /*}*/

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
        color: #999;

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
            font-size: 1.8rem;
            font-weight: 600;
            display: inline-block;
            vertical-align: middle;
            color: #999;
        }
    }

</style>
