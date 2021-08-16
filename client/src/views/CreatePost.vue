<script>
import FormPost from "../components/FormPost";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";

export default {
  name: "CreatePost",

  components: {
    HeadComponent,
    FooterComponent,
    FormPost
  },

  data() {
    return {};
  }
};
</script>

<template>
  <div id="main-layout">
    <HeadComponent></HeadComponent>

    <main>
      <div id="content">
       <FormPost></FormPost>
        <!-- main content -->
      </div>
    </main>

    <FooterComponent></FooterComponent>
  </div>
</template>

<style lang="scss">
// main - begin
main {
  min-height: 70vh;
  background-color: #ffffff;
  #content {
    @media screen and (max-width: 426px) {
      width: 100%;
    }
    @media screen and (min-width: 1441px) {
      width: 900px;
    }
    display: flex;
    flex-direction: column;
    margin: 0 auto 0 auto;
    width: 70%;
    background-color: white;
  }
}
// main - end
</style>