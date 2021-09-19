<script>
import UserInfo from "../components/UserInfo";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";
import SpinnerComponent from "../components/SpinnerComponent.vue";
import PostNews from "../components/PostNews";
import FormPost from "../components/FormPost";
import PopUnderConfirmationPost from "../components/PopUnderConfirmationPost";
import PopUnderConfirmationComment from "../components/PopUnderConfirmationComment";
import CommentNews from "../components/CommentNews";
import EmojiBar from "../components/EmojiBar";

import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "Account",
  //-----------

  //-----------
  components: {
    UserInfo,
    HeadComponent,
    FooterComponent,
    SpinnerComponent,
    PostNews,
    FormPost,
    PopUnderConfirmationPost,
    PopUnderConfirmationComment,
    CommentNews,
    EmojiBar
  },
  //-----------

  //-----------
  data() {
    return {
      memberId: undefined, // id de utilisateur
      memberProfil: undefined, // Profil d'un utilisateur
      pseudo: "",
      dateInscription: "",
      imgProfil: "",
      monCompte: false,
      ready: true,
      postNews: [],
      goModify: false,
      showConfirmation: false,
      deletProcess: false,
      message: "",
      idxDelete: NaN,
      commentsPostNew: [],
      idxDeleteComment: NaN,
      showConfirmationComment: false,
      goModifyComment: false,
      goComment: false,
      textCommentModify: "",
      oldTextComment: "",
      sendBtn: true,
      catNum: 0,
      emoji: false
    };
  },
  //-----------

  //-----------
  methods: {
    getInfoUser() {
      this.ready = false;
      sendRequest(
        `http://localhost:3000/api/user/${this.$route.params.id}`,
        "GET"
      )
        .then(data => {
          if (data.error !== 0) {
            // console.log(data);
            this.ready = true;
            this.pseudo = data.pseudo;
            this.dateInscription = data.date_inscription;
            this.imgProfil = data.profil_img_url;
          } else {
            this.$router.push("/");
          }
        })
        .catch(err => {
          this.ready = true;
          console.log(err);
        });
    },

    modifyPost(i) {
      this.goModify = !this.goModify;

      this.iPostNew = i;

      // console.log(this.iPostNew);
    },

    changeBooleanConfirmation(idx) {
      this.idxDelete = idx; // obtenir index de post

      this.message = `Voullez-vous supprimé post: ${this.postNews[idx].title}`; // formation du message

      return (this.showConfirmation = !this.showConfirmation);
    },

    deletePost(i) {
      this.showConfirmation = false;
      this.deletProcess = true;

      sendRequest(
        `http://localhost:3000/api/post/${this.postNews[i].id}`,
        "DELETE"
      )
        .then(() => {
          // this.postNews = [];
          this.postNews.splice(i, 1);

          // for (let k = 0; k <= this.counter; k++) {
          //   this.getAllPost(k); // formé en nouveau this.postNews
          // }

          this.deletProcess = false;
        })
        .catch(err => {
          this.deletProcess = false;

          console.log(err);
        });
    },

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

    deleteComment(i) {
      // caché les commentaire lorsque on travail
      this.deletProcess = true;

      this.showConfirmationComment = false; // detruir popUnder

      sendRequest(
        `http://localhost:3000/api/comment/${this.commentsPostNew[i].id}/post/${this.commentsPostNew[i].post_id}`,
        "DELETE"
      )
        .then(() => {
          // this.commentsPostNew = []; //nettoyer avant remplissage

          this.commentsPostNew.splice(i, 1);

          this.deletProcess = false;
        })
        .catch(err => {
          this.deletProcess = false;
          console.log(err);
        });
    },

    changeBooleanConfirmationComment(idx) {
      this.idxDeleteComment = idx; // obtenir index de post
      console.log(this.idxDeleteComment);

      this.message = `Voullez-vous supprimé commentaire: ${this.commentsPostNew[idx].commentaire}`; // formation du message

      return (this.showConfirmationComment = !this.showConfirmationComment);
    },

    modifyComment(i) {
      // console.log(this.commentsPostNew[i]);

      // passage vers mode de modification d'un commentaire
      this.goModifyComment = true;

      // si jamais forme pour rajuté commentaire deja ouvert, il faut fermer
      this.goComment = false;

      this.textCommentModify = this.commentsPostNew[i].commentaire;

      this.oldTextComment = this.textCommentModify;

      return (this.commentIdModify = this.commentsPostNew[i].id);
    },

    addModificationComment() {
      this.sendBtn = false;

      const body = {
        text: this.textCommentModify
      };

      let post_id = this.commentsPostNew.find(
        el => el.commentaire == this.oldTextComment
      ).post_id;

      console.log("cest I", post_id);

      sendRequest(
        `http://localhost:3000/api/comment/${this.commentIdModify}/post/${post_id}`,
        "PUT",
        body
      )
        .then(res => {
          if (res.modified) {
            //nettoyer avant remplissage
            // this.commentsPostNew = [];

            // formé en nouveau this.commentsPostNew
            // for (let k = 0; k <= this.counter; k++) {
            //   this.getAllComments(k);
            // }

            this.commentsPostNew.find(
              el => el.commentaire == this.oldTextComment
            ).commentaire = this.textCommentModify;

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

    changeCatNum(num) {
      console.log(num);

      this.goModifyComment = false;
      this.goModify = false;

      return (this.catNum = num);
    },

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
    }
  },
  //-----------

  //-----------
  beforeMount() {
    // verification user et distribution ID
    sendRequest(`http://localhost:3000/api/user/info`, "GET")
      .then(res => {
        if (res.error === 0 || res.length === 0) {
          // unauthorized direction page login
          this.$router.push("/");
        }
        this.memberId = res.user;
        this.memberProfil = res.profil;
      })
      .catch(err => {
        console.log(err);
      });

    this.getInfoUser();

    // obtenir tout les poste pour un utilisateur
    sendRequest(
      `http://localhost:3000/api/post/user/${parseInt(this.$route.params.id)}`,
      "POST"
    )
      .then(res => {
        this.postNews = res;
        // console.log(this.postNews);
      })
      .catch(err => {
        console.log(err);
      });

    // obtenir tout les commentaire pour un utilisateur
    sendRequest(
      `http://localhost:3000/api/comment/user/${parseInt(
        this.$route.params.id
      )}`,
      "GET"
    )
      .then(res => {
        this.commentsPostNew = res;
        console.log(this.commentsPostNew);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<template>
  <div id="main-layout">
    <HeadComponent :memberProfil="memberProfil"></HeadComponent>

    <main>
      <div class="content">
        <SpinnerComponent :ready="ready"></SpinnerComponent>

        <UserInfo
          :pseudo="pseudo"
          :dateInscription="dateInscription"
          :imgProfil="imgProfil"
          :monCompte="monCompte"
          :changeCatNum="changeCatNum"
          v-if="ready"
        ></UserInfo>
        <!-- main content -->
      </div>

      <div class="content">
        <FormPost
          v-if="goModify"
          :modifyPost="modifyPost"
          :goModify="goModify"
          :mImageUrl="postNews[iPostNew].url_img"
          :mTitle="postNews[iPostNew].title"
          :mTextPost="postNews[iPostNew].discription"
          :idPostNew="postNews[iPostNew].id"
        ></FormPost>

        <PopUnderConfirmationPost
          :deletePost="deletePost"
          :changeBooleanConfirmation="changeBooleanConfirmation"
          :showConfirmation="showConfirmation"
          :message="message"
          :idxDelete="idxDelete"
        ></PopUnderConfirmationPost>

        <SpinnerComponent :ready="!deletProcess"></SpinnerComponent>
      </div>

      <div class="content" v-if="!goModify && !deletProcess && catNum === 1">
        <h2>Posts:</h2>
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

      <div
        class="content"
        v-if="!goModifyComment && !deletProcess && catNum === 2"
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

      <div class="content">
        <PopUnderConfirmationComment
          :deleteComment="deleteComment"
          :changeBooleanConfirmationComment="changeBooleanConfirmationComment"
          :showConfirmationComment="showConfirmationComment"
          :message="message"
          :idxDeleteComment="idxDeleteComment"
        ></PopUnderConfirmationComment>

        <!-- START form pour modification d'un commentaire-->
        <div v-if="goModifyComment" class="container-comments">
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
              @click="addModificationComment"
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
      </div>
      <!-- END -->
    </main>

    <FooterComponent></FooterComponent>
  </div>
</template>


<style lang="scss">
// main - begin
main {
  h2 {
    margin: 15px 5% 0;
  }
  min-height: 70vh;
  .content {
    @media screen and (max-width: 426px) {
      width: 90%;
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
  #account {
    display: flex;
    margin: 15px auto 0 auto;
    padding: 10px 10px;
    width: 90%;
    // height: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 5px 2px #fd2d0f;
    #header {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      &-photo {
        @media screen and (max-width: 568px) {
          margin: auto;
        }
        border: 2px solid rgba(255, 215, 215, 0.5);
        border-radius: 50%;
        width: 200px;
        height: 200px;
        margin: 10px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          margin: 0;
          object-fit: cover;
        }
      }
      &-info {
        @media screen and (max-width: 568px) {
          width: 100%;
        }
        width: calc(100% - 224px);
        display: flex;
        flex-direction: column;
        &-pseudo {
          @media screen and (max-width: 568px) {
            text-align: center;
          }
          text-align: left;
          font-weight: 600;
          font-size: 1.2rem;
        }
        &-dateInsc {
          @media screen and (max-width: 568px) {
            text-align: center;
          }
          text-align: left;
          font-style: italic;
        }
        &-manipulation {
          @media screen and (max-width: 568px) {
            margin: 10px auto;
          }
          margin: 10px 0;
        }
        &-statistic {
          @media screen and (max-width: 568px) {
            justify-content: space-around;
          }
          display: flex;
          flex-wrap: wrap;
          button {
            // white-space: nowrap;
            margin: 10px;
          }
        }
      }
    }
  }

  .post {
    position: unset;
    display: flex;
    flex-direction: column;
    margin: 15px auto 0 auto;
    padding: 10px 10px;
    // height: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 5px 2px #fd2d0f;
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
      span {
        margin: 0 10px;
      }
    }
  }

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
    box-shadow: 0 0 5px 2px #fd2d0f;
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