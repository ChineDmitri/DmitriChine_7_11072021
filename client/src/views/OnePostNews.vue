<script>
import SpinnerComponent from "../components/SpinnerComponent.vue";
import EmojiBar from "../components/EmojiBar";
import PostNews from "../components/PostNews";
import FormPost from "../components/FormPost";
import CommentNews from "../components/CommentNews";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";
import PopUnderConfirmationPost from "../components/PopUnderConfirmationPost";
import PopUnderConfirmationComment from "../components/PopUnderConfirmationComment";

import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "OnePostNews",
  //-----------

  //-----------
  components: {
    SpinnerComponent,
    EmojiBar,
    PostNews,
    FormPost,
    CommentNews,
    HeadComponent,
    FooterComponent,
    PopUnderConfirmationPost,
    PopUnderConfirmationComment
  },
  //-----------

  //-----------
  data() {
    return {
      memberId: undefined, // id de utilisateur
      memberProfil: undefined, // Profil d'un utilisateur
      counter: 0, //counter pour affiché en plus des commentaires
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
      goModifyComment: false, // mode de modification d'un commentaire
      emoji: false, // affiché emoji ou caché
      goModify: false, // pour modification d'un post
      showConfirmation: false,
      showConfirmationComment: false,
      message: "",
      messageComment: "",
      idxDelete: NaN,
      idxDeleteComment: NaN,
      vComment: false
    };
  },
  //-----------

  //-----------
  methods: {
    // ajout emodji dans textarea
    addEmodji(event) {
      // Index d'un symbol apres dernier symbol selectioné
      let cursorIndex = document.getElementById("inputTextField").selectionEnd;

      if (this.goModifyComment) {
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
          this.getMoreCommentsCtrl = res.length === 2 ? true : false;

          // chaque commentaire ajouté dans le array final this.commentsPostNew
          res.forEach(el => {
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
      if (!this.vComment) {
        console.log(this.vComment);
        this.message = "Veuillez remplire les champs correctement";
        return;
      }

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

      this.showConfirmationComment = false; // detruir popUnder

      sendRequest(
        `http://localhost:3000/api/comment/${this.commentsPostNew[i].id}/post/${this.$route.params.id}`,
        "DELETE"
      )
        .then(() => {
          this.commentsPostNew = []; //nettoyer avant remplissage

          this.postNew.comments--; // enlevé un commentaire sur le compteur de commentaire

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
      // console.log(this.commentsPostNew[i]);

      // passage vers mode de modification d'un commentaire
      this.goModifyComment = true;

      // si jamais form pour rajuté commentaire deja ouvert, il faut fermer
      this.goComment = false;

      this.textCommentModify = this.commentsPostNew[i].commentaire;

      return (this.commentIdModify = this.commentsPostNew[i].id);
    },

    // ajouté modification pour commentaire
    addModificationComment() {
      if (!this.vComment) {
        console.log(this.vComment);
        this.message = "Veuillez remplire les champs correctement";
        return;
      }

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
            this.goModifyComment = false;

            // // si jamais forme pour rajuté commentaire deja ouvert, il faut fermer
            this.goComment = false;

            this.sendBtn = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // modification d'un post
    modifyPost(i) {
      this.goModify = !this.goModify;

      this.iPostNew = i;

      // console.log(this.iPostNew);
    },

    // LIKE ou DISLIKE d'un post
    votePost(idx = null, status) {
      console.log(idx); // ES Linter conflict jamais utilisé

      const body = {
        postId: this.postNew.id,
        status: status
      };

      let oldStatus = this.postNew.status; // Status precedant avant de changement

      sendRequest(
        `http://localhost:3000/api/post/${this.postNew.id}/vote`,
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

    // LIKE ou DISLIKE d'un commentaire
    voteComment(idx, status) {
      const body = {
        status: status
      };

      let oldStatus = this.commentsPostNew[idx].status; // Status precedant avant de changement

      sendRequest(
        `http://localhost:3000/api/comment/${this.commentsPostNew[idx].id}/vote/`,
        "PATCH",
        body
      )
        .then(res => {
          this.commentsPostNew[idx].status = res.stat;

          // si response 1 (LIKE) et precedant n'est pas comme response 1 (LIKE)
          // OU
          // si reponse 0 (NEUTRE) et precedent n'est pas 1 (LIKE)
          if (
            (res.stat === 1 && oldStatus !== res.stat) ||
            (res.stat === 0 && oldStatus !== 1)
          ) {
            this.commentsPostNew[idx].likes++; // increment likes
          }

          // si response -1 (DISLIKE) et precedant n'est pas comme reponse -1 (DISLIKE)
          // OU
          // si reponse 0 (NEUTRE) et precedent n'est pas -1 (DISLIKE)
          if (
            (res.stat === -1 && oldStatus !== res.stat) ||
            (res.stat === 0 && oldStatus !== -1)
          ) {
            this.commentsPostNew[idx].dislikes--; // decriment dislike
          }

          // de LIKE vers DISLIKE
          if (this.commentsPostNew[idx].status === -1 && oldStatus === 1) {
            this.commentsPostNew[idx].likes++;
            this.commentsPostNew[idx].dislikes -= 2;
          }

          // de DISLIKE vers LIKE
          if (this.commentsPostNew[idx].status === 1 && oldStatus === -1) {
            this.commentsPostNew[idx].likes += 2;
            this.commentsPostNew[idx].dislikes--;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // methode pour DELETE d'un post et reformé this.postNews
    deletePost(i) {
      console.log(i); // ES Linter conflict jamais utilisé

      this.showConfirmation = false;
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
    },

    // affiché pop-under de confirmation
    changeBooleanConfirmation(idx = NaN) {
      this.idxDelete = idx; // obtenir index de post

      this.message = `Voullez-vous supprimé post: ${this.postNew.title}`; // formation du message

      return (this.showConfirmation = !this.showConfirmation);
    },

    // affiché pop-under de confirmation
    changeBooleanConfirmationComment(idx) {
      this.idxDeleteComment = idx; // obtenir index de post
      console.log(this.idxDeleteComment);

      this.message = `Voullez-vous supprimé commentaire: ${this.commentsPostNew[idx].commentaire}`; // formation du message

      return (this.showConfirmationComment = !this.showConfirmationComment);
    },

    validInput(event) {
      if (event.target.value.length !== 0) {
        console.log("true", event.target);
        event.target.classList.remove("invalid");
        event.target.classList.add("valid");
        this.message = "";
        return true;
      } else {
        console.log("false", event.target);
        event.target.classList.remove("valid");
        event.target.classList.add("invalid");
        return false;
      }
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
        this.memberProfil = res.profil;
      })
      .catch(err => {
        console.log(err);
      });

    //obtenir deux plus recent commentaire
    this.getAllComments(this.counter);

    //obtenir les post par numero (route.params.id)
    sendRequest(
      `http://localhost:3000/api/post/${this.$route.params.id}`,
      "GET"
    )
      .then(res => {
        this.postNew = res[0];

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
    <HeadComponent :memberProfil="memberProfil"></HeadComponent>

    <main>
      <SpinnerComponent :ready="ready"></SpinnerComponent>
      <div id="content" v-if="ready">
        <!-- main content -->
        <FormPost
          v-if="goModify"
          :modifyPost="modifyPost"
          :goModify="goModify"
          :mImageUrl="postNew.url_img"
          :mTitle="postNew.title"
          :mTextPost="postNew.discription"
          :idPostNew="postNew.id"
        ></FormPost>

        <PostNews
          v-if="!goModify"
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
          :deletePost="deletePost"
          :changeBooleanConfirmation="changeBooleanConfirmation"
          :modifyPost="modifyPost"
          :votePost="votePost"
        ></PostNews>

        <PopUnderConfirmationPost
          :deletePost="deletePost"
          :changeBooleanConfirmation="changeBooleanConfirmation"
          :showConfirmation="showConfirmation"
          :message="message"
          :idxDelete="idxDelete"
        ></PopUnderConfirmationPost>

        <PopUnderConfirmationComment
          :deleteComment="deleteComment"
          :changeBooleanConfirmationComment="changeBooleanConfirmationComment"
          :showConfirmationComment="showConfirmationComment"
          :message="message"
          :idxDeleteComment="idxDeleteComment"
        ></PopUnderConfirmationComment>

        <div
          class="container-comments"
          v-if="!goModify && !goModifyComment && deleteCommentBtn"
        >
          <h2>Commentaires:</h2>
          <CommentNews
            v-for="(comment, idx) in commentsPostNew"
            :key="comment.id"
            :commentId="comment.id"
            :memberId="memberId"
            :memberProfil="memberProfil"
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
            :changeBooleanConfirmationComment="changeBooleanConfirmationComment"
            :modifyComment="modifyComment"
            :voteComment="voteComment"
          ></CommentNews>
        </div>

        <button
          v-if="
            showMoreBtn &&
            getMoreCommentsCtrl &&
            !goModifyComment &&
            deleteCommentBtn
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
          v-if="
            showMoreBtn &&
            !goModifyComment &&
            !goComment &&
            deleteCommentBtn &&
            !goModify
          "
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
                @input="vComment = validInput($event)"
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

            <p id="message" v-if="message != ''">
              {{ message }}
            </p>

            <button v-if="sendBtn" @click="addComment" class="btn-classic">
              Envoyer!
            </button>
            <SpinnerComponent :ready="sendBtn"></SpinnerComponent>
          </div>
        </div>
        <!-- END form pour ajout des commentair -->

        <!-- START form pour modification d'un commentaire-->
        <div v-if="goModifyComment" class="container-comments">
          <div class="comments">
            <label for="inputTextField">
              Text de commentaire à modifier:
              <textarea
                @input="vComment = validInput($event)"
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

            <p id="message" v-if="message != ''">
              {{ message }}
            </p>

            <button
              v-if="sendBtn"
              @click="addModificationComment(textCommentModify)"
              class="btn-classic"
            >
              Envoyer!
            </button>

            <button
              v-if="sendBtn"
              @click="goModifyComment = false"
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
    position: relative;
    width: 70%;
    margin: 15px auto 0 auto;
    padding: 0;
    h2 {
      margin: 0 5%;
    }
  }
  
}
// main - end
</style>