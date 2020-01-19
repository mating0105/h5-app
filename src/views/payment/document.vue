// 相关文档
<template>
    <ViewPage>
        <Document></Document>
    </ViewPage>
</template>
<script>
  import Vue from "vue";
  import Document from "@/views/relatedDocs/relatedDocs";
  import ViewPage from '@/layout/components/ViewPage';

  export default {
    components: {
      Document,
      ViewPage
    }
  }
</script>
