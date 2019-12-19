<template>
  <div id="app">
    <transition name="page-move">

      <keep-alive v-if="$route.meta.keepAlive">
        <router-view />
      </keep-alive>

      <router-view v-else/>

    </transition>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "App",
  data() {
    return {
      loginForm: {
        username: "gz0119",
        password: "123"
      }
    };
  },
  methods: {
    login() {
      // this.$store.dispatch('user/login', this.loginForm)
      this.$store.dispatch("user/login", this.loginForm).then(() => {
        // this.$router.push({ path: this.redirect || '/' })
        this.$store.dispatch("user/getWordBook");
      });
    }
  },
  mounted() {
    const hasToken = getToken();
    if (!hasToken) {
      this.login();
    } else {
      this.$store.dispatch("user/getWordBook");
    }
  }
};
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}

#app {
  min-width: 100vw;
  overflow: auto;
  color: #323233;
  font-family: "PingFang SC", Helvetica, "STHeiti STXihei", "Microsoft YaHei",
    Tohoma, Arial, sans-serif;
  line-height: 1;
  background-color: #f7f8fa;
  -webkit-font-smoothing: antialiased;
}

* {
  font-size: 1.4rem;
}

.page-move-enter,
.page-move-leave-active {
  transform: translate(100%, 0);
}

.page-move-enter-active,
.page-move-leave-active {
  transition: transform 0.3s;
}
</style>
