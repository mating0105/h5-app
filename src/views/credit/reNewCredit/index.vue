<template>
    <ViewPage>
        <Card>
            <template v-slot:header>
                头部
            </template>
             <div>
                 内容
             </div>
        </Card>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  export default {
    name: "reNewCredit",
    components: {
      ViewPage,
      Card
    },
  }
</script>

<style scoped>

</style>
