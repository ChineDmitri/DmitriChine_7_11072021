<script>
export default {
  name: "HeadComponent",
};
</script>

<template>
  <header>
      <div id="head"></div>
      <div id="menu">
        <nav class="large-screen">
          <ul>
            <li>
              <a href="/moncompte">Mon profil</a>
            </li>
            <li>
              <a href="#">Ecrire un post</a>
            </li>
            <li>
              <a href="/main">Accueil</a>
            </li>
          </ul>
        </nav>
        <nav class="tight-screen">
          <ul>
            <li>
              <a href="/moncompte"><i class="fas fa-user-circle"></i></a>
            </li>
            <li>
              <a href="#"><i class="fas fa-paper-plane"></i></a>
            </li>
            <li>
              <a href="/main"><i class="fas fa-home"></i></a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
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
</style>