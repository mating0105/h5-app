//项目基本信息
<template>
  <ViewPage>
    <ProjectInfo></ProjectInfo>
  </ViewPage>  
</template>

<script>
import Vue from "vue";
// 自定义组件
import ViewPage from '@/layout/components/ViewPage';
import ProjectInfo from "@/views/basicInfo/projectInfo/info";

export default {
  components: {
    ViewPage,
    ProjectInfo
  }
}
</script>
