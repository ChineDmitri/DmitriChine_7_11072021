<script>
import EmojiBar from "../components/EmojiBar";
export default {
  name: "FormPost",

  components: {
    EmojiBar
  },

  data() {
    return {
      textPost: "",
      emoji: false
    };
  },
  methods: {
    addEmodji(event) {
      // this.textPost += event.taget.value
      // console.log(this.textPost);
      // console.log(event.target.value);

      let cursorIndex = document.getElementById("inputTextField").selectionEnd;
      this.textPost =
        this.textPost.substring(0, cursorIndex) +
        event.target.value +
        this.textPost.substring(cursorIndex);
      this.emoji = false;
    },
    showEmoji() {
      // console.log("coucou");
      this.emoji = true;
    }
  }
};
</script>


<template>
  <div class="post">
    <label for="title">
      Title de post:
      <input type="text" id="title" />
    </label>
    <label for="inputTextField">
      Text de post:
      <textarea
        v-model="textPost"
        rows="10"
        name="text"
        id="inputTextField"
      ></textarea>
    </label>
    <div id="attachment">
      <EmojiBar
        :emoji="emoji"
        :showEmoji="showEmoji"
        :addEmodji="addEmodji"
      ></EmojiBar>
      <div class="fileDownload">
        <input type="file" />
        <img src="../assets/avatar.jpg" alt="" />
      </div>
    </div>
  </div>
</template>


<style lang="scss">
$fontSize: 1rem;

.post {
  display: flex;
  flex-direction: column;
  margin: 15px auto 0 auto;
  padding: 10px 10px;
  width: 90%;
  // height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 5px 2px #6b7689;
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
    margin: 5px auto;
    border: 1px solid #292829;
    border-radius: 3px 3px 3px 3px;
    padding: 5px;
    font-size: $fontSize;
  }
  #attachment {
    display: flex;
    flex-direction: row;
    .fileDownload {
      width: 50%;
      img {
        width: 100%;
        max-height: 15vh;
        object-fit: contain;
      }
    }
  }
}
</style>