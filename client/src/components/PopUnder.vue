<script>
export default {
  name: "PopUnder",
  props: ["modalBoolean", "showmodal", "messageErr", "changePseudo"]
};
</script>

<template>
  <div id="popUnder" v-if="showmodal">
    <div id="popUnder-body">
      <span id="popUnder-body-btnClose"
        ><button @click="modalBoolean" id="refuser">
          <i class="fas fa-times-circle"></i></button></span
      ><span id="popUnder-body-p">{{ messageErr }} <b>{{ changePseudo }}</b></span>
    </div>
  </div>
</template>


<style lang="scss">

$objet_color: #ffffff;
$negative_color: red;

#popUnder {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9;
  animation-name: slowPopUnder;
  animation-duration: 250ms;
  animation-timing-function: linear;
  animation-fill-mode: both;
  @keyframes slowPopUnder {
    from {
      background-color: rgba(255, 255, 255, 0);
    }
    to {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  #refuser {
    margin: 0 1rem;
    font-size: 1.5rem;
    padding: 0;
    border: 0;
    &:hover {
      transform: scale(1.2);
      cursor: pointer;
    }
    &:focus + #popUnder {
      background-color: black;
    }
  }
  #refuser {
    color: $negative_color;
    background-color: $objet_color;
  }
  &-body {
    display: flex;
    flex-direction: column;
    padding: 1%;
    background-color: $objet_color;
    position: absolute;
    top: 33%;
    left: 30%;
    width: 38%;
    z-index: 10;
    border-radius: 1rem;
    @media screen and (max-width: 769px) {
      padding: 3%;
      left: 7%;
      width: 80%;
    }
    &-p {
      padding: 0;
      margin: 1rem 2rem 2rem;
      text-align: center;
    }
    &-btnClose {
      text-align: right;
    }
  }
}
</style>