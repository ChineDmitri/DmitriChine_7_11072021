<script>
import PostNews from "../components/PostNews";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";
import SpinnerComponent from "../components/SpinnerComponent.vue";

import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "Main",

  components: {
    SpinnerComponent,
    PostNews,
    HeadComponent,
    FooterComponent
  },

  data() {
    return {
      memberId: undefined, // id de utilisateur
      counter: 0, //counter pour affiché en plus des post
      postNews: [], // variable pour stockage des posts
      showMore: true, // si il y a rien à affiché on passe en false
      ready: true, // Boolean pour SpinnerComponent qui en "Afficher en plus"
      readyDelet: true // Boolean pour SpinnerComponent lorsque on effectué DELET d'un post
    };
  },

  methods: {
    // Obtenir tout les poste counter 0 = plus recent
    getAllPost(counter) {
      this.ready = false; // start spinner

      let body = {
        postCounter: counter
      };

      // RESPONSE 1
      // [userId]
      // RESPONSE 2 [{
      // "id": Number (id du post),
      // "user_id": Number (id d'utilisateur qui a créé post)
      // "date_publication": Date de publication ex "2021-08-06T11:11:19.000Z",
      // "date_modification": Date de modification ex "2021-08-06T12:04:08.000Z" OR null,
      // "title": title de post (max 200 char) ,
      // "discription": text du post,
      // "likes": combien likes (+Number) ,
      // "dislikes": combien dislikes (-Number),
      // "comments": combien commentaires (Number unsigned)
      // "url_img": url pour image,
      // "pseudo": ,
      // "status": -1 / 0 / 1
      // }]
      sendRequest("http://localhost:3000/api/post", "POST", body)
        .then(res => {
          if (res.error !== 0) {
            this.showMore = res[1].length === 2 ? true : false; //

            this.memberId = res[0]; // attribution member ID (userId)

            res[1].forEach(el => {
              this.postNews.push(el);
            });

            this.ready = true;
          } else {
            this.$router.push("/");
          }
        })
        .catch(err => {
          this.ready = true;
          console.log(err);
        });
    },
    // Obtenir en plus de posté et mettre dans this.postNews
    showMorePost(num) {
      num++;

      this.getAllPost(num);

      return num;
    },
    // methode pour DELETE d'un post et reformé this.postNews
    deletePost(i) {
      this.readyDelet = false;

      sendRequest(
        `http://localhost:3000/api/post/${this.postNews[i].id}`,
        "DELETE"
      )
        .then(() => {
          // this.postNews.splice(i, 1); // ce la n'est function pas comme il faut

          this.postNews = [];

          // formé en nouveau this.postNews
          for (let k = 0; k <= this.counter; k++) {
            this.getAllPost(k);
          }

          this.readyDelet = true;
        })
        .catch(err => {
          this.readyDelet = true;

          console.log(err);
        });
    },
    // LIKE ou DISLIKE :D
    votePost(idx, status) {
      const body = {
        postId: this.postNews[idx].id,
        status: status
      };

      let oldStatus = this.postNews[idx].status; // Status precedant avant de changement

      sendRequest(
        `http://localhost:3000/api/post/${this.postNews[idx].id}/like`,
        "PATCH",
        body
      )
        .then(res => {
          this.postNews[idx].status = res.stat;

          // si response 1 (LIKE) et precedant n'est pas comme response 1 (LIKE)
          // OU
          // si reponse 0 (NEUTRE) et precedent n'est pas 1 (LIKE)
          if (
            (res.stat === 1 && oldStatus !== res.stat) ||
            (res.stat === 0 && oldStatus !== 1)
          ) {
            // increment likes
            this.postNews[idx].likes++;
          }

          // si response -1 (DISLIKE) et precedant n'est pas comme reponse -1 (DISLIKE)
          // OU
          // si reponse 0 (NEUTRE) et precedent n'est pas -1 (DISLIKE)
          if (
            (res.stat === -1 && oldStatus !== res.stat) ||
            (res.stat === 0 && oldStatus !== -1)
          ) {
            // decriment dislike
            this.postNews[idx].dislikes--;
          }

          // de LIKE vers DISLIKE
          if (this.postNews[idx].status === -1 && oldStatus === 1) {
            this.postNews[idx].likes++;
            this.postNews[idx].dislikes -= 2;
          }

          // de DISLIKE vers LIKE
          if (this.postNews[idx].status === 1 && oldStatus === -1) {
            this.postNews[idx].likes += 2;
            this.postNews[idx].dislikes--;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  beforeMount() {
    this.ready = false;
    this.getAllPost(this.counter);
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
          v-for="(postNew, idx) in postNews"
          :key="postNew.id"
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
          :idx="idx"
          :deletePost="deletePost"
          :votePost="votePost"
          :ready="ready"
          :readyDelet="readyDelet"
        ></PostNews>

        <!-- spinner lorsque on supprim un post -->
        <SpinnerComponent :ready="readyDelet"></SpinnerComponent>

        <!-- spinner lorsqur on demande afficher encore des post -->
        <SpinnerComponent :ready="ready"></SpinnerComponent>

        <button
          v-if="showMore && ready && readyDelet"
          @click="this.counter = showMorePost(this.counter)"
          class="btn-classic"
          value="0"
        >
          Afficher en plus
        </button>
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