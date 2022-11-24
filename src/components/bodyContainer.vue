<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    check: defineAsyncComponent(() =>
      import('./check.vue')
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
    <component :is="content" @back-home="content='check'"></component>
  </div>
</template>
