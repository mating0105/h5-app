<!--
 * @Description: 重权管理 - 审批jil
 * @Author: shenah
 * @Date: 2019-12-18 16:16:56
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-20 18:36:50
 -->

<template>
  <div class="heavy-approval">
    <approvalRecord></approvalRecord>
  </div>
</template>

<script>
import ApprovalRecord from "@/views/basicInfo/approvalRecord/index";
export default {
  name: "HeavyApproval",
  components: { ApprovalRecord },
  data() {
    return {};
  },
  props: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.heavy-approval {
}
</style>