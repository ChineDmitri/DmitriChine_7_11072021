<script>
// import SpinnerComponent from "../components/SpinnerComponent.vue";
import PostNews from "../components/PostNews";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";

import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "OnePostNews",

  components: {
    // SpinnerComponent,
    PostNews,
    HeadComponent,
    FooterComponent
  },

  data() {
    return {
      memberId: undefined, // id de utilisateur
      postNew: "", // variable pour stockage des posts
      showMore: true, // si il y a rien à affiché on passe en false
      ready: true, // Boolean pour SpinnerComponent qui en "Afficher en plus"
      readyDelet: true // Boolean pour SpinnerComponent lorsque on effectué DELET d'un post
    };
  },

  methods: {},

  beforeMount() {
    sendRequest(
      `http://localhost:3000/api/post/${this.$route.params.id}`,
      "GET"
    )
      .then(res => {
        this.postNew = res[1]
        // this.postNew = new Object(
        //   res[1]
        // )

        this.memberId = res[0]

        console.log('bf', this.postNew)
        // console.log('bf', res[1])
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>


<template>
  <div id="main-layout">
    <HeadComponent></HeadComponent>
    <main>
      <div id="content">
        <!-- main content -->
        <PostNews
          :postId="postNew.id"
          :memberId="memberId"
          :title="postNew.title"
          :discription="postNew.discription"
          :likes="postNew.likes"
          :dislikes="postNew.dislikes"
          :comments="postNew.comments"
          :pseudo="postNew.pseudo"
          :datePublication="postNew.date_publication"
          :dateModification="postNew.date_modification"
          :urlImg="postNew.url_img"
          :userId="postNew.user_id"
          :status="postNew.status"
          :ready="ready"
          :readyDelet="readyDelet"
        ></PostNews>

        <!-- spinner lorsque on supprim un post -->
        <!-- <SpinnerComponent :ready="readyDelet"></SpinnerComponent> -->

        <!-- spinner lorsqur on demande afficher encore des post -->
        <!-- <SpinnerComponent :ready="ready"></SpinnerComponent> -->

        <!-- <button
          v-if="showMore && ready && readyDelet"
          @click="this.counter = showMorePost(this.counter)"
          class="btn-classic"
          value="0"
        >
          Afficher en plus
        </button> -->
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
        padding: 5px 0;
        margin: 0 0 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-height: 16px; /* fallback */
        -webkit-line-clamp: $nLine; /* number of lines to show */
        -webkit-box-orient: vertical;
      }
      &-photo {
        display: flex;
        width: 100%;
        max-height: 200px;
        width: 100%;
        max-height: 200px;
        img {
          width: 99%;
          max-height: 200px;
          object-fit: cover;
        }
        // &-one {

        // }
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