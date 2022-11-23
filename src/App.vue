<script>
import headerContainer from "./components/headerContainer.vue"
import bodyContainer from "./components/bodyContainer.vue"
import footerContainer from "./components/footerContainer.vue"

export default {
  data() {
    return {
      contentis:"check"
    }
  },
  components: {
    headerContainer,
    bodyContainer,
    footerContainer,
  }
}

</script>


<template>
  <div class="navbar bg-primary text-primary-content md:px-20">
    <div class="navbar-start">
      <a class="btn btn-ghost normal-case text-xl" @click="contentis='check'"><img src="./assert/logo.png" class="w-10 mr-2">体温助手</a>
    </div>
    <div class="navbar-end">
      <button class="btn btn-ghost" @click="contentis='check'">公告/查询</button>
      <button class="btn btn-accent text-white" @click="contentis='signin'">立即注册</button>
    </div>
  </div>
  <bodyContainer :content="contentis"/>
  <footerContainer />
</template>

