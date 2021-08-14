<script>
import UserInfo from "../components/UserInfo";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";

// sendRequest(url, method, body (null for GET!))
import { sendRequest } from "../api/index.js";

export default {
  name: "main",
  components: {
    UserInfo,
    HeadComponent,
    FooterComponent,
  },
  data() {
    return {
      pseudo: "",
      dateInscriotion: "",
      imgProfil: "",
      monCompte: true,
      modificationCompte: false,
    };
  },
  methods: {
    getInfoUser() {
      sendRequest(`http://localhost:3000/api/auth/`, "GET")
        .then((data) => {
          if (data.error !== 0) {
            // console.log(data);
            this.pseudo = data.pseudo;
            this.dateInscriotion = data.date_inscription;
            this.imgProfil = data.profil_img_url;
          } else {
            this.$router.push("/");
          }
        })
        .catch((err) => console.log(err));
    },
    modeUpdateInfoUser() {
      this.modificationCompte = true;
    },
  },
  beforeMount() {
    this.getInfoUser();
  },
};
</script>

<template>
  <div id="main-layout">
    <HeadComponent></HeadComponent>

    <main>
      <div id="content">
        <UserInfo
          :modeUpdateInfoUser="modeUpdateInfoUser"
          :pseudo="pseudo"
          :dateInscriotion="dateInscriotion"
          :imgProfil="imgProfil"
          :monCompte="monCompte"
          :modificationCompte="modificationCompte"
        ></UserInfo>
        <!-- main content -->
      </div>
    </main>

    <FooterComponent></FooterComponent>
  </div>
</template>

<style lang="scss">
// header - begin
header {
  overflow: hidden;
  position: relative;
  #head {
    background-image: url(../assets/header_bg.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #000;

    display: flex;
    width: 100%;
    height: 25vh;
  }
  #menu {
    background-color: rgba(14, 33, 63, 0.5);
    display: flex;
    flex-direction: row;
    position: absolute;
    top: calc(100% - 8vh);
    width: 100%;
    height: 8vh;
    .large-screen,
    .tight-screen {
      @media screen and (max-width: 426px) {
        background-image: url(../assets/ico_white_a.png);
        background-size: 20vh;
        background-position: -5% 50%;
        margin: 0;
        flex-basis: 100%;
      }
      @media screen and (min-width: 1441px) {
        flex-basis: 900px;
      }
      background-image: url(../assets/icon-left-font-monochrome-white.png);
      background-size: 20vh;
      background-position: 10% 50%;
      background-repeat: no-repeat;
      // border-top-left-radius: 20px;
      // border-top-right-radius: 20px;
      position: relative;
      width: 70%;
      margin: 0 auto 0 auto;
      ul {
        @media screen and (max-width: 426px) {
          margin: 0 20px 0 0;
        }
        display: flex;
        flex-direction: row-reverse;
        padding: 0;
        margin: 0 40px 0 0;
        height: 100%;
        li {
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
          align-items: center;
          background-color: #ffffff;
          font-weight: 600;
          display: flex;
          list-style-type: none;
          margin: 0 5px;
          padding: 0 10px;
          height: calc(100% + 6px);
          &:hover {
            box-shadow: 0 0 10px 5px rgba(14, 33, 63, 0.5);
            transition-duration: 400ms;
            transform: translateY(-5px);
            transform-origin: bottom;
          }
        }
      }
    }
    .large-screen {
      @media screen and (max-width: 568px) {
        display: none;
      }
    }
    .tight-screen {
      font-size: 1.1rem;
      display: none;
      @media screen and (max-width: 568px) {
        display: block;
      }
    }
  }
}
// header - end

// main - begin
main {
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
    box-shadow: 0 0 5px 2px #ffd7d7;
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
}
// main - end

// footer - start
footer {
  display: flex;
  background-color: rgba(14, 33, 63, 0.8);
  width: 100%;
  padding: 10px 0;
  margin: 25px 0 0;
  ul {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 0;
    li {
      margin: 0 auto;
      font-weight: 600;
      a {
        &:hover {
          color: #ffffff;
        }
      }
      list-style-type: none;
    }
  }
}
// footer - end
</style>