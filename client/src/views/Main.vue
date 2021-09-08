<script>
import PostNews from "../components/PostNews";
import FormPost from "../components/FormPost";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";
import SpinnerComponent from "../components/SpinnerComponent.vue";
import PopUnderConfirmationPost from "../components/PopUnderConfirmationPost";

import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "Main",
  //-----------

  //-----------
  components: {
    PostNews,
    FormPost,
    HeadComponent,
    FooterComponent,
    SpinnerComponent,
    PopUnderConfirmationPost
  },
  //-----------

  //-----------
  data() {
    return {
      memberId: undefined, // id de utilisateur
      memberProfil: undefined, // Profil d'un utilisateur
      counter: 0, //counter pour affiché en plus des post
      postNews: [], // variable pour stockage des posts
      iPostNew: undefined, // index de post à modifié
      // showMore: true, // si il y a rien à affiché on passe en false
      ready: true, // Boolean pour SpinnerComponent qui en "Afficher en plus"
      readyShowMore: true, // Boolean pour button show more
      getMorePost: true, // Boolean pour button show more
      goModify: false,
      showConfirmation: false,
      message: "",
      idxDelete: NaN
    };
  },
  //-----------

  //-----------
  methods: {
    // Obtenir les 2 poste plus recents (this.counter = 0 NON counter)
    getAllPost(counter) {
      this.readyShowMore = false; // start spinner

      let body = {
        postCounter: counter
      };

      sendRequest("http://localhost:3000/api/post", "POST", body) // requete pour obtenir les deux post plus recents
        .then(res => {
          if (res.error !== 0) {
            this.getMorePost = res.length === 2 ? true : false; // si response n'as pas deux post donc plus besoin button "Affiche en plus"

            res.forEach(el => {
              this.postNews.push(el); // chaque post ajouté dans le array final this.commentsPostNew
            });

            this.readyShowMore = true; // fin de spinner pour button

            this.ready = true; // spinner general caché
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

      this.getAllPost(num); // appele cette function avec counter deja incrimenté

      return num; // return valeur incrémenté pour prochaine fois
    },

    // methode pour DELETE d'un post et reformé this.postNews
    deletePost(i) {
      this.showConfirmation = false;
      this.ready = false;

      sendRequest(
        `http://localhost:3000/api/post/${this.postNews[i].id}`,
        "DELETE"
      )
        .then(() => {
          this.postNews = [];

          for (let k = 0; k <= this.counter; k++) {
            this.getAllPost(k); // formé en nouveau this.postNews
          }

          this.ready = true;
        })
        .catch(err => {
          this.ready = true;

          console.log(err);
        });
    },

    // modification d'un post
    modifyPost(i) {
      this.goModify = !this.goModify;

      this.iPostNew = i;

      // console.log(this.iPostNew);
    },

    // LIKE ou DISLIKE :D
    votePost(idx, status) {
      const body = {
        postId: this.postNews[idx].id,
        status: status
      };

      let oldStatus = this.postNews[idx].status; // Status precedant avant de changement

      sendRequest(
        `http://localhost:3000/api/post/${this.postNews[idx].id}/vote`,
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
            this.postNews[idx].likes++; // increment likes
          }

          // si response -1 (DISLIKE) et precedant n'est pas comme reponse -1 (DISLIKE)
          // OU
          // si reponse 0 (NEUTRE) et precedent n'est pas -1 (DISLIKE)
          if (
            (res.stat === -1 && oldStatus !== res.stat) ||
            (res.stat === 0 && oldStatus !== -1)
          ) {
            this.postNews[idx].dislikes--; // decriment dislike
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
    },

    // affiché pop-under de confirmation
    changeBooleanConfirmation(idx) {
      this.idxDelete = idx; // obtenir index de post

      this.message = `Voullez-vous supprimé post: ${this.postNews[idx].title}`; // formation du message

      return (this.showConfirmation = !this.showConfirmation);
    }
  },
  //-----------

  //-----------
  beforeMount() {
    this.ready = false;

    sendRequest(`http://localhost:3000/api/user/info`, "GET") // verification user et distribution ID
      .then(res => {
        if (res.error === 0) {
          this.$router.push("/"); // unauthorized direction page login
        }
        this.memberId = res.user;
        this.memberProfil = res.profil;
      })
      .catch(err => {
        console.log(err);
      });

    this.getAllPost(this.counter);
  }
};
</script>


<template>
  <div id="main-layout">
    <HeadComponent :memberProfil="memberProfil"></HeadComponent>
    <main>
      <!-- spinner lorsqur on demande afficher encore des post -->
      <SpinnerComponent :ready="ready"></SpinnerComponent>

      <div id="content" v-if="ready">
        <!-- main content -->
        <FormPost
          v-if="goModify"
          :modifyPost="modifyPost"
          :goModify="goModify"
          :mImageUrl="postNews[iPostNew].url_img"
          :mTitle="postNews[iPostNew].title"
          :mTextPost="postNews[iPostNew].discription"
          :idPostNew="postNews[iPostNew].id"
        ></FormPost>

        <div v-if="!goModify">
          <PostNews
            v-for="(postNew, idx) in postNews"
            :key="postNew.id"
            :postId="postNew.id"
            :memberId="memberId"
            :memberProfil="memberProfil"
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
            :changeBooleanConfirmation="changeBooleanConfirmation"
            :modifyPost="modifyPost"
            :votePost="votePost"
          ></PostNews>
        </div>

        <PopUnderConfirmationPost
          :deletePost="deletePost"
          :changeBooleanConfirmation="changeBooleanConfirmation"
          :showConfirmation="showConfirmation"
          :message="message"
          :idxDelete="idxDelete"
        ></PopUnderConfirmationPost>

        <!-- spinner lorsque on supprim un post -->
        <!-- <SpinnerComponent :ready="readyDelet"></SpinnerComponent> -->

        <button
          v-if="readyShowMore && getMorePost && !goModify"
          @click="this.counter = showMorePost(this.counter)"
          class="btn-classic"
        >
          Afficher en plus
        </button>
        <SpinnerComponent :ready="readyShowMore"></SpinnerComponent>
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