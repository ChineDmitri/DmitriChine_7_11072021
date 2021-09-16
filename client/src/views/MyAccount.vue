<script>
import UserInfo from "../components/UserInfo";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";
import SpinnerComponent from "../components/SpinnerComponent.vue";
import PostNews from "../components/PostNews";
import FormPost from "../components/FormPost";
import PopUnderConfirmationPost from "../components/PopUnderConfirmationPost";

// sendRequest(url, method, body (null for GET!))
import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "MyAccount",
  //-----------

  //-----------
  components: {
    UserInfo,
    HeadComponent,
    FooterComponent,
    SpinnerComponent,
    PostNews,
    FormPost,
    PopUnderConfirmationPost
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
      monCompte: true,
      modificationCompte: false,
      ready: true,
      postNews: [],
      goModify: false,
      showConfirmation: false,
      deletProcess: false,
      message: "",
      idxDelete: NaN,
      comments: []
    };
  },
  //-----------

  //-----------
  methods: {
    getInfoUser() {
      this.ready = false;
      sendRequest(`http://localhost:3000/api/user/`, "GET")
        .then(data => {
          if (data.error !== 0) {
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
    modeUpdateInfoUser() {
      this.modificationCompte = !this.modificationCompte;
      let img = document.getElementById("userPhoto");
      img.src = this.imgProfil;
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
    }
  },
  //-----------

  //-----------
  beforeMount() {
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

    this.getInfoUser();

    sendRequest(`http://localhost:3000/api/post/user/`, "POST")
      .then(res => {
        this.postNews = res;
        console.log(this.postNews);
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
      <div id="content">
        <SpinnerComponent :ready="ready"></SpinnerComponent>

        <UserInfo
          :modeUpdateInfoUser="modeUpdateInfoUser"
          :pseudo="pseudo"
          :dateInscription="dateInscription"
          :imgProfil="imgProfil"
          :monCompte="monCompte"
          :modificationCompte="modificationCompte"
          v-if="ready"
        ></UserInfo>
        <!-- main content -->
      </div>

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

      <div v-if="!goModify && !deletProcess">
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
    </main>

    <FooterComponent></FooterComponent>
  </div>
</template>


<style lang="scss">
// main - begin
main {
  min-height: 70vh;
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
  #account {
    display: flex;
    margin: 15px auto 0 auto;
    padding: 10px 10px;
    width: 100%;
    // height: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 5px 2px #6b7689;
    #header {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      #inputFile {
        color: transparent;
      }
      &-photo {
        @media screen and (max-width: 568px) {
          margin: auto;
        }
        border: 2px solid #6b7689;
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
        #newPseudo {
          outline: none;
        }
        #btn-confirmation {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-wrap: wrap;
          .orange {
            background-color: orange;
          }
        }
        input {
          font-size: 1rem;
          margin: 5px auto;
          width: 50%;
        }
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