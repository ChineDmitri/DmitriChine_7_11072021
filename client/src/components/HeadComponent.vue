<script>
import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "HeadComponent",

  props: {
    memberProfil: {
      type: [String, undefined],
      required: false
    }
  },

  methods: {
    logout() {
      sendRequest("http://localhost:3000/api/user/logout", "POST")
        .then(res => {
          if (res.logout) {
            this.$router.push("/");
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>


<template>
  <header>
    <div id="stat-bar">
      <button id="logout" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
      <router-link v-if="memberProfil === 'a'" to="/admin" class="admin"
        >Espace administrateur</router-link
      >
    </div>
    <div id="head"></div>
    <div id="menu">
      <nav class="large-screen">
        <ul>
          <li>
            <router-link to="/moncompte">Mon profil</router-link>
          </li>
          <li>
            <router-link to="/main/createpost">Ecrire un post</router-link>
          </li>
          <li>
            <router-link to="/main">Accueil</router-link>
          </li>
        </ul>
      </nav>
      <nav class="tight-screen">
        <ul>
          <li>
            <router-link to="/moncompte"
              ><i class="fas fa-user-circle"></i
            ></router-link>
          </li>
          <li>
            <router-link to="/main/createpost"
              ><i class="fas fa-paper-plane"></i
            ></router-link>
          </li>
          <li>
            <router-link to="/main"><i class="fas fa-home"></i></router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>


<style lang="scss">
// header - begin
header {
  background-color: #000000;
  overflow: hidden;
  position: relative;
  #stat-bar {
    font-size: 2vh;
    display: flex;
    flex-direction: row-reverse;
    position: sticky;
    background-color: #000000;
    height: 4vh;
    width: 70%;
    margin: 0 auto;
    a {
      margin: auto 0;
      color: #ffffff;
      &:hover {
        color: #37e69d;
      }
    }
    #logout {
      cursor: pointer;
      font-size: 3vh;
      color: red;
      background-color: transparent;
      border: 0px;
      margin: 0 20px;
      &:hover {
        transform: scale(1.25);
      }
    }
    @media screen and (max-width: 426px) {
      margin: 0 auto;
      width: 100%;
    }
    @media screen and (min-width: 1441px) {
      flex-basis: 900px;
    }
  }
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
    top: calc(100% - 9vh);
    width: 100%;
    height: 9vh;
    .large-screen,
    .tight-screen {
      @media screen and (max-width: 426px) {
        margin: 0;
        flex-basis: 100%;
      }
      @media screen and (max-width: 768px) {
        background-image: url(../assets/ico_white_a.png);
        background-size: 20vh;
        background-position: -10% 50%;
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
</style>