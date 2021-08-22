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
      readyShowMore: true, // Boolean pour SpinnerComponent qui en "Voir les commentaires en plus"
      getMorePost: true, // affiche en plus ou non
      textComment: "", // variable pour text d'un commentaire à créer
      textCommentModify: "", // variable pour text d'un commentaire à modifié
      commentIdModify: 0, // object d'un commentaire à modifier
      readyButtonComment: true, // pour button Envoyer (commentaire)
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
      this.readyShowMore = false;
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
          this.getMorePost = res[1].length === 2 ? true : false;

          // chaque commentaire ajouté dans le array final this.commentsPostNew
          res[1].forEach(el => {
            this.commentsPostNew.push(el);
          });

          // fin de spinner pour button
          this.readyShowMore = true;
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
      this.readyButtonComment = false;

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

            // cache form pour envoyer un commentaire
            this.goComment = false;

            // affiche button pour envoyer un commentaire
            this.readyButtonComment = true;

            // netoyer textarea
            this.textComment = "";

            for (let k = 0; k <= this.counter; k++) {
              this.getAllComments(k);
            }
          }
        })
        .catch(err => {
          this.readyButtonComment = true;

          console.log(err);
        });
    },

    // Delete un commentaire
    deleteComment(i) {
      // caché les commentaire lorsque on travail

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
        })
        .catch(err => {
          this.readyShowMore = true;
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
      console.log(this.commentIdModify);

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
            // this.goComment = false;
          }
        })
        .catch(err => {
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
          v-if="readyShowMore && getMorePost && !goModify"
          @click="this.counter = showMoreComments(this.counter)"
          class="btn-classic"
        >
          Voir les commentaire en plus
        </button>
        <SpinnerComponent :ready="readyShowMore"></SpinnerComponent>

        <button
          v-if="!goComment && ready && !goModify"
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

            <button
              v-if="readyButtonComment"
              @click="addComment"
              class="btn-classic"
            >
              Envoyer!
            </button>
            <SpinnerComponent :ready="readyButtonComment"></SpinnerComponent>
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
              v-if="readyButtonComment"
              @click="addModificationComment()"
              class="btn-classic"
            >
              Envoyer!
            </button>

            <button
              v-if="readyButtonComment"
              @click="goModify = false"
              class="btn-classic btn-orange"
            >
              Retourner!
            </button>
            <SpinnerComponent :ready="readyButtonComment"></SpinnerComponent>
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