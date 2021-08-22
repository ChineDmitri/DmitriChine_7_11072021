<script>
import SpinnerComponent from "../components/SpinnerComponent.vue";
import EmojiBar from "../components/EmojiBar";
import PostNews from "../components/PostNews";
import CommentNews from "../components/CommentNews";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";

import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "OnePostNews",
  //-----------

  //-----------
  components: {
    SpinnerComponent,
    PostNews,
    HeadComponent,
    FooterComponent,
    CommentNews,
    EmojiBar
  },
  //-----------

  //-----------
  data() {
    return {
      counter: 0, //counter pour affiché en plus des commentaires
      memberId: undefined, // id de utilisateur
      postNew: "", // variable pour stockage des posts
      commentsPostNew: [], // array pour commentaires
      showMore: true, // si il y a rien à affiché on passe en false
      ready: true, // Boolean pour SpinnerComponent en general
      textComment: "", // variable pour text d'un commentaire à créer
      textCommentModify: "", // variable pour text d'un commentaire à modifié
      commentIdModify: 0, // object d'un commentaire à modifier
      sendBtn: true, // pour button Envoyer (commentaire)
      showMoreBtn: true, // pour button "Voir les commentaires en plus"
      deleteCommentBtn: true, // pour button ico (delete)
      getMoreCommentsCtrl: true, // affiche en plus ou non
      goComment: false, // pour ajout readyCommentsButton comments (mode Commentateur)
      goModify: false, // mode de modification
      emoji: false // affiché emoji ou caché
    };
  },
  //-----------

  //-----------
  methods: {
    // ajout emodji dans textarea
    addEmodji(event) {
      console.log(decodeURI(event.target.value));

      // Index d'un symbol apres dernier symbol selectioné
      let cursorIndex = document.getElementById("inputTextField").selectionEnd;

      if (this.goModify) {
        // Où on va inserer emoji
        this.textCommentModify =
          this.textCommentModify.substring(0, cursorIndex) +
          event.target.value +
          this.textCommentModify.substring(cursorIndex);

        // caché tableau des emoji
        this.emoji = false;
      } else {
        // Où on va inserer emoji
        this.textComment =
          this.textComment.substring(0, cursorIndex) +
          event.target.value +
          this.textComment.substring(cursorIndex);

        // caché tableau des emoji
        this.emoji = false;
      }
    },

    // obtenir commentaire (par deux plus recent)
    getAllComments(counter) {
      this.showMoreBtn = false;
      let body = {
        postCounter: counter
      };

      sendRequest(
        `http://localhost:3000/api/comment/all/post/${this.$route.params.id}`,
        "POST",
        body
      )
        .then(res => {
          // si on obtienne pas 2 post donc c'est terminé plus besoins affiché button
          this.getMoreCommentsCtrl = res[1].length === 2 ? true : false;

          // chaque commentaire ajouté dans le array final this.commentsPostNew
          res[1].forEach(el => {
            this.commentsPostNew.push(el);
          });

          // fin de spinner pour button
          this.showMoreBtn = true;
        })
        .catch(err => {
          this.readyComments = true;
          console.log(err);
        });
    },

    // Obtenir en plus de commentaires et mettre dans this.commentsPostNew
    showMoreComments(num) {
      num++;

      // appele cette function
      this.getAllComments(num);

      // return valeur incrémenté pour prochaine fois
      return num;
    },

    // ajouter commentaire pour post=route.params.id
    addComment() {
      this.sendBtn = false;

      const body = {
        text: this.textComment
      };

      sendRequest(
        `http://localhost:3000/api/comment/create/post/${this.$route.params.id}`,
        "POST",
        body
      )
        .then(res => {
          if (res.created) {
            this.commentsPostNew = [];

            this.postNew.comments++;

            this.goComment = false; // cache form pour envoyer un commentaire

            this.sendBtn = true; // affiche button pour envoyer un commentaire

            this.textComment = ""; // netoyage textarea

            for (let k = 0; k <= this.counter; k++) {
              this.getAllComments(k);
            }
          }
        })
        .catch(err => {
          this.sendBtn = false;

          console.log(err);
        });
    },

    // Delete un commentaire
    deleteComment(i) {
      // caché les commentaire lorsque on travail
      this.deleteCommentBtn = false;

      sendRequest(
        `http://localhost:3000/api/comment/${this.commentsPostNew[i].id}/post/${this.$route.params.id}`,
        "DELETE"
      )
        .then(() => {
          //nettoyer avant remplissage
          this.commentsPostNew = [];

          this.postNew.comments--;

          // formé en nouveau this.commentsPostNew
          for (let k = 0; k <= this.counter; k++) {
            this.getAllComments(k);
          }

          this.deleteCommentBtn = true;
        })
        .catch(err => {
          this.showMoreBtn = true;
          console.log(err);
        });
    },

    // vers modification
    modifyComment(i) {
      console.log(this.commentsPostNew[i]);

      // passage vers mode de modification d'un commentaire
      this.goModify = true;

      // si jamais forme pour rajuté commentaire deja ouvert, il faut fermer
      this.goComment = false;

      this.textCommentModify = this.commentsPostNew[i].commentaire;

      return (this.commentIdModify = this.commentsPostNew[i].id);
    },

    // ajouté modification pour commentaire
    addModificationComment() {
      this.sendBtn = false;

      const body = {
        text: this.textCommentModify
      };

      sendRequest(
        `http://localhost:3000/api/comment/${this.commentIdModify}/post/${this.$route.params.id}`,
        "PUT",
        body
      )
        .then(res => {
          if (res.modified) {
            //nettoyer avant remplissage
            this.commentsPostNew = [];

            // formé en nouveau this.commentsPostNew
            for (let k = 0; k <= this.counter; k++) {
              this.getAllComments(k);
            }

            // annulé mode de modification
            this.goModify = false;

            // // si jamais forme pour rajuté commentaire deja ouvert, il faut fermer
            this.goComment = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // LIKE ou DISLIKE :D
    votePost(idx = null, status) {
      console.log(idx); // ES Linter conflict jamais utilisé

      const body = {
        postId: this.postNew.id,
        status: status
      };

      let oldStatus = this.postNew.status; // Status precedant avant de changement

      sendRequest(
        `http://localhost:3000/api/post/${this.postNew.id}/like`,
        "PATCH",
        body
      )
        .then(res => {
          this.postNew.status = res.stat;

          // si response 1 (LIKE) et precedant n'est pas comme response 1 (LIKE)
          // OU
          // si reponse 0 (NEUTRE) et precedent n'est pas 1 (LIKE)
          if (
            (res.stat === 1 && oldStatus !== res.stat) ||
            (res.stat === 0 && oldStatus !== 1)
          ) {
            // increment likes
            this.postNew.likes++;
          }

          // si response -1 (DISLIKE) et precedant n'est pas comme reponse -1 (DISLIKE)
          // OU
          // si reponse 0 (NEUTRE) et precedent n'est pas -1 (DISLIKE)
          if (
            (res.stat === -1 && oldStatus !== res.stat) ||
            (res.stat === 0 && oldStatus !== -1)
          ) {
            // decriment dislike
            this.postNew.dislikes--;
          }

          // de LIKE vers DISLIKE
          if (this.postNew.status === -1 && oldStatus === 1) {
            this.postNew.likes++;
            this.postNew.dislikes -= 2;
          }

          // de DISLIKE vers LIKE
          if (this.postNew.status === 1 && oldStatus === -1) {
            this.postNew.likes += 2;
            this.postNew.dislikes--;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // methode pour DELETE d'un post et reformé this.postNews
    deletePost(i) {
      console.log(i);

      this.ready = false;

      sendRequest(
        `http://localhost:3000/api/post/${this.$route.params.id}`,
        "DELETE"
      )
        .then(() => {
          this.$router.push("/main/");
        })
        .catch(err => {
          this.ready = true;

          console.log(err);
        });
    }
  },
  //-----------

  //-----------
  beforeMount() {
    // non terminé requet - affiché spinner
    this.ready = false;

    // verification user et distribution ID
    sendRequest(`http://localhost:3000/api/user/info`, "GET")
      .then(res => {
        if (res.error === 0) {
          // unauthorized direction page login
          this.$router.push("/");
        }
        this.memberId = res.user;
      })
      .then(err => {
        console.log(err);
      });

    //obtenir deux plus recent commentaire
    this.getAllComments(this.counter);

    //obtenir les post numero route.params.id
    sendRequest(
      `http://localhost:3000/api/post/${this.$route.params.id}`,
      "GET"
    )
      .then(res => {
        this.postNew = res[1];

        // términé requet - cahché spinner
        this.ready = true;
      })
      .catch(err => {
        this.ready = true;
        console.log(err);
      });
  }
};
</script>


<template>
  <div id="main-layout">
    <HeadComponent></HeadComponent>
    <main>
      <SpinnerComponent :ready="ready"></SpinnerComponent>
      <div id="content" v-if="ready">
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
          :votePost="votePost"
          :deletePost="deletePost"
        ></PostNews>

        <div class="container-comments" v-if="!goModify">
          <h2>Commentaires:</h2>
          <CommentNews
            v-for="(comment, idx) in commentsPostNew"
            :key="comment.id"
            :commentId="comment.id"
            :memberId="memberId"
            :commentaire="comment.commentaire"
            :datePublication="comment.date_publication"
            :dateModification="comment.date_modification"
            :likes="comment.likes"
            :dislikes="comment.dislikes"
            :status="comment.status"
            :userId="comment.user_id"
            :pseudo="comment.pseudo"
            :idx="idx"
            :deleteComment="deleteComment"
            :modifyComment="modifyComment"
          ></CommentNews>
        </div>

        <button
          v-if="
            showMoreBtn && getMoreCommentsCtrl && !goModify && deleteCommentBtn
          "
          @click="this.counter = showMoreComments(this.counter)"
          class="btn-classic"
        >
          Voir les commentaire en plus
        </button>
        <SpinnerComponent
          :ready="showMoreBtn && deleteCommentBtn"
        ></SpinnerComponent>

        <button
          v-if="showMoreBtn && !goModify && !goComment && deleteCommentBtn"
          @click="goComment = true"
          class="btn-classic"
        >
          Ajouté commentaire
        </button>

        <!-- START form pour ajoute de commentaire -->
        <div v-if="goComment" class="container-comments">
          <div class="comments">
            <label for="inputTextField">
              Text de commentaire:
              <textarea
                v-model="textComment"
                rows="5"
                name="text"
                id="inputTextField"
              >
              </textarea>
            </label>

            <!-- START EMOJI -->
            <span v-if="!emoji" class="emoji">
              <input
                @click="emoji = true"
                type="button"
                class="emoji-btn"
                value="&#128578;"
              />
            </span>

            <EmojiBar v-if="emoji" :addEmodji="addEmodji"></EmojiBar>
            <!-- END EMOJIO -->

            <button v-if="sendBtn" @click="addComment" class="btn-classic">
              Envoyer!
            </button>
            <SpinnerComponent :ready="sendBtn"></SpinnerComponent>
          </div>
        </div>
        <!-- END form pour ajout des commentair -->

        <!-- START form pour modification d'un commentaire-->
        <div v-if="goModify" class="container-comments">
          <div class="comments">
            <label for="inputTextField">
              Text de commentaire à modifier:
              <textarea
                v-model="textCommentModify"
                rows="5"
                name="text"
                id="inputTextField"
              >
              </textarea>
            </label>

            <!-- START EMOJI -->
            <span v-if="!emoji" class="emoji">
              <input
                @click="emoji = true"
                type="button"
                class="emoji-btn"
                value="&#128578;"
              />
            </span>

            <EmojiBar v-if="emoji" :addEmodji="addEmodji"></EmojiBar>
            <!-- END EMOJIO -->

            <button
              v-if="sendBtn"
              @click="addModificationComment()"
              class="btn-classic"
            >
              Envoyer!
            </button>

            <button
              v-if="sendBtn"
              @click="goModify = false"
              class="btn-classic btn-orange"
            >
              Retourner!
            </button>
            <SpinnerComponent :ready="sendBtn"></SpinnerComponent>
          </div>
        </div>
        <!-- END -->
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
  .container-comments {
    @media screen and (max-width: 426px) {
      width: 90%;
    }
    width: 70%;
    margin: 15px auto 0 auto;
    padding: 0;
    h2 {
      margin: 0 5%;
    }
  }
  .post,
  .comments {
    label {
      margin: 5px 0;
      position: relative;
    }
    input,
    textarea {
      outline: none;
      width: calc(100% - 12px);
      text-align: left;
      // position: center;
      margin: auto;
      border: 1px solid #292829;
      border-radius: 3px 3px 3px 3px;
      padding: 5px;
      font-size: 1rem;
    }
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