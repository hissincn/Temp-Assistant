<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    home: defineAsyncComponent(() =>
      import('./home.vue')
    ),
    signin: defineAsyncComponent(() =>
      import('./signin.vue')
    ),
  },
  props: ['content']
}

</script>


<template>
  <div class="my-10 md:px-24 px-6">
    <component :is="content" @back-home="content='home'"></component>
  </div>
</template>
