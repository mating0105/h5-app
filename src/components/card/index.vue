<template>
    <div class="card is-always-shadow">
        <div class="card__header" v-if="$slots.header">
            <slot name="header"></slot>
        </div>
        <div class="card__body" v-if="$slots.default">
            <slot></slot>
        </div>
        <div class="card__footer" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: "card"
  }
</script>

<style scoped lang="scss">
    .card.is-always-shadow {
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    }

    .card {
        border-radius: 5px;
        border: 1px solid #ebeef5;
        background-color: #fff;
        overflow: hidden;
        color: #303133;
        transition: .3s;
        margin: 1rem;

        .card__header {
            padding: 15px;
            border-bottom: 1px solid #ebeef5;
            box-sizing: border-box;
            color: #C4252A;
            font-weight: Bold;
        }

        .card__footer {
            padding: 15px;
            border-top: 1px solid #ebeef5;
            box-sizing: border-box;
        }

        .card__body {
            /*padding: 10px;*/
        }
    }


</style>
