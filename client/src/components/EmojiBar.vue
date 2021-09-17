<script>
export default {
  name: "EmojiBar",
  props: ["addEmodji"]
};
</script>


<template>
  <span class="emoji">
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128578;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128515;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128516;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128513;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128518;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128518;"
    /><input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128517;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#129315;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128514;"
    /><input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#129315;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128579;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128521;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128522;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128519;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#129392;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128525;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#129321;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128536;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128535;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128523;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128539;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128540;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#129322;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#128541;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#129297;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#129303;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#129325;"
    />
    <input
      @click="addEmodji"
      type="button"
      class="emoji-btn"
      value="&#129323;"
    />
  </span>
</template>

<style lang="scss">
.emoji {
  // position: absolute;
  // bottom: 20%;
  // left: 20px;
  // display: flex;
  // justify-content: flex-start;
  // flex-direction: row;
  // flex-wrap: wrap;
  font-size: 1rem;
  width: 50%;
  &-btn {
    width: auto !important;
    margin: 1px !important;
  }
}
</style>