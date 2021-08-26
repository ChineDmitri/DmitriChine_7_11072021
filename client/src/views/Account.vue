<script>
import UserInfo from "../components/UserInfo";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";
import SpinnerComponent from "../components/SpinnerComponent.vue";

import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "Account",
  //-----------

  //-----------
  components: {
    UserInfo,
    HeadComponent,
    FooterComponent,
    SpinnerComponent
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
      ready: true
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
      .then(err => {
        console.log(err);
      });

    this.getInfoUser();
  }
};
</script>

<template>
  <div id="main-layout">
    <HeadComponent></HeadComponent>

    <main>
      <div id="content">
        <SpinnerComponent :ready="ready"></SpinnerComponent>

        <UserInfo
          :pseudo="pseudo"
          :dateInscription="dateInscription"
          :imgProfil="imgProfil"
          :monCompte="monCompte"
          v-if="ready"
        ></UserInfo>
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
    width: 90%;
    // height: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 5px 2px #6b7689;
    #header {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      &-photo {
        @media screen and (max-width: 568px) {
          margin: auto;
        }
        border: 2px solid rgba(14, 33, 63, 0.5);
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
}
// main - end
</style>