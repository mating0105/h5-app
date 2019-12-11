<template>
    <div id="OrdinaryCard">
        <div class="container" ref="container">
            <div class="title">{{title}}</div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: "OrdinaryCard",
    props:['title'],
    methods: {
      
    }
  }
</script>

<style scoped>
    #OrdinaryCard {
        width: 100%;
        /* height: 300px; */
        border: 1px solid rgb(228, 228, 228);
        border-radius: 10px;
    }
    .title{
        height:40px;
        line-height: 40px;
        padding: 0 10px;
        color: rgb(204, 0, 0);
        border-bottom: 1px solid rgb(228, 228, 228);
    }
    .content{
        padding: 10px 10px;
    }
    
</style>
