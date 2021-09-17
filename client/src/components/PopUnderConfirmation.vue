<script>
export default {
  name: "PopUnderConfirmation",

  props: {
    deleteUser: {
      type: Function,
      required: true
    },
    changeBooleanConfirmation: {
      type: Function,
      required: true
    },
    showConfirmation: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
};
</script>

<template>
  <div id="popUnder" v-if="showConfirmation">
    <div id="popUnder-body">
      <span id="popUnder-body-p"> {{ message }} </span>
      <span id="popUnder-body-btnVerification">
        <button @click="deleteUser" id="accepter" value="">
          <i class="fas fa-check-square"></i>
        </button>
        <button @click="changeBooleanConfirmation" id="refuser">
          <i class="fas fa-window-close"></i>
        </button>
      </span>
    </div>
  </div>
</template>


<style lang="scss">
$accepter_color: #0dc378;
$objet_color: #ffffff;
$refuser_color: red;

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
  #accepter,
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
  #accepter {
    background-color: $objet_color;
    color: $accepter_color;
  }
  #refuser {
    background-color: $objet_color;
    color: $refuser_color;
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
      margin: 0 0 1rem;
      text-align: center;
    }
    &-btnVerification {
      text-align: center;
    }
    &-btnClose {
      text-align: right;
    }
  }
}
</style>