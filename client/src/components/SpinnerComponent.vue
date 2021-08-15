<script>
export default {
  name: "SpinnerComponent",
  props: {
    ready: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<template>
  <div v-if="!ready" class="spinner-border" role="status">
    <span class="sr-only"></span>
  </div>
</template>

<style lang="scss">
.spinner-border {
  margin: 20px auto 10px;
  width: 5rem;
  height: 5rem;
  vertical-align: text-bottom;
  border: 0.25em solid #6b7689;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: spinner-border 0.75s linear infinite;
  animation: spinner-border 0.75s linear infinite;
  @keyframes spinner-border {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
}
</style>