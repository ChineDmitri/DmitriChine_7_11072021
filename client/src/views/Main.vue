<script>
import PostNews from "../components/PostNews";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";

export default {
  name: "main",
  components: {
    PostNews,
    HeadComponent,
    FooterComponent
  }
};
</script>


<template>
  <div id="main-layout">
    <HeadComponent></HeadComponent>

    <main>
      <div id="content">
        <PostNews></PostNews>
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
  .post {
    display: flex;
    flex-direction: column;
    margin: 15px auto 0 auto;
    padding: 10px 10px;
    width: 90%;
    // height: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 5px 2px #6b7689;
    &-title {
      display: flex;
      flex-wrap: wrap;
      font-weight: 600;
      width: 100%;
      a {
        width: 75%;
      }
      span {
        width: 25%;
        text-align: end;
      }
      hr {
        border: 0;
        clear: both;
        display: block;
        width: 100%;
        background-color: black;
        height: 1px;
        margin: 4px;
      }
    }
    &-body {
      margin: 0 0 10px;
      $nLine: 5;
      &-text {
        margin: 0 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-height: 16px; /* fallback */
        max-height: calc(16 * $nLine); /* fallback */
        -webkit-line-clamp: $nLine; /* number of lines to show */
        -webkit-box-orient: vertical;
      }
      &-photo {
        display: flex;
        width: 100%;
        max-height: 200px;
        &-one {
          width: 100%;
          max-height: 200px;
          img {
            width: 99%;
            max-height: 200px;
            object-fit: cover;
          }
        }
      }
    }
    &-author {
      font-size: 0.9rem;
      margin-bottom: 10px;
      a {
        font-weight: 600;
      }
    }
    &-status {
      display: flex;
      align-items: center;
      flex-direction: row;
      width: 100%;
      height: 30px;
      font-size: 1.2rem;
      .counterLike {
        // pour compteur
      }
      span {
        margin: 0 10px;
      }
    }
  }
}
// main - end
</style>