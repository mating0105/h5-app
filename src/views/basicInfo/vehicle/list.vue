<template>
  <div>
    
  </div>
</template>

<script>
import Vue from "vue";
import ViewPage from "@/layout/components/ViewPage";
import { Cell } from "vant";

Vue.use(Cell);
export default {
  data() {
    return {};
  },
  components: {
    ViewPage
  },
  methods: {
    pathHouse() {
      this.$router.push('/addHouseGuarantor');
    }
  }
};
</script>
