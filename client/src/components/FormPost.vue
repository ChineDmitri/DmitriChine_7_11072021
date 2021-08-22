<script>
import EmojiBar from "../components/EmojiBar";
import SpinnerComponent from "../components/SpinnerComponent.vue";

import { sendRequestFD } from "../helpers/sendRequest.js";

export default {
  name: "FormPost",

  components: {
    EmojiBar,
    SpinnerComponent
  },

  data() {
    return {
      emoji: false,
      imageUrl: null,
      title: undefined,
      textPost: "",
      ready: true
    };
  },

  methods: {
    addEmodji(event) {
      console.log(decodeURI(event.target.value));

      // Index d'un symbol apres dernier symbol selectioné
      let cursorIndex = document.getElementById("inputTextField").selectionEnd;

      this.textPost =
        this.textPost.substring(0, cursorIndex) +
        event.target.value +
        this.textPost.substring(cursorIndex);

      this.emoji = false;
    },
    // showEmoji() {
    //   // console.log(event.target.value);
    //   this.emoji = true;
    // },
    getImg() {
      this.imageUrl = event.target.files[0];

      console.log(event.target.files[0]);

      let img = document.getElementById("postPhoto"); // où inserer preview

      if (event.target.files[0] !== undefined) {
        // pour lire le contenu de fichiers
        let fReader = new FileReader();
        fReader.readAsDataURL(event.target.files[0]);
        fReader.onloadend = function(event) {
          img.src = event.target.result;
          // console.log(event.target.result);
        };
      } else {
        img.src = undefined;
      }
    },
    createPost() {
      this.ready = false;
      console.log(this.title, this.textPost, this.imageUrl);

      // const body = {
      //   title: this.title,
      //   discription: this.textPost,
      //   imageUrl: this.imageUrl
      // };

      const postData = new FormData();

      postData.append("title", this.title);
      postData.append("discription", this.textPost);
      postData.append("imageUrl", this.imageUrl);

      console.log(postData);

      sendRequestFD("http://localhost:3000/api/post/create", "POST", postData)
        .then(res => {
          this.ready = true;
          if (res.status) {
            this.$router.push("/main/");
          }
          console.log("create ", res);
        })
        .catch(err => {
          this.ready = true;
          console.log("error ", err);
        });
    }
  }
};
</script>


<template>
  <div class="post">
    <label for="title">
      Title de post:
      <input v-model="title" type="text" id="title" />
    </label>

    <label for="inputTextField">
      Text de post:
      <textarea v-model="textPost" rows="10" name="text" id="inputTextField">
      </textarea>
    </label>

    <div id="attachment">
      <span v-if="!emoji" class="emoji">
        <input
          @click="emoji = true"
          type="button"
          class="emoji-btn"
          value="&#128578;"
        />
      </span>

      <EmojiBar v-if="emoji" :addEmodji="addEmodji">
      </EmojiBar>

      <div class="fileDownload">
        <input
          type="file"
          id="inputFile"
          accept="image/png, image/jpg, image/gif, image/jpeg,"
          title=" "
          @change="getImg"
        />

        <img id="postPhoto" :src="imageUrl" alt="" />
      </div>
    </div>

    <button v-if="ready" @click="createPost" class="btn-classic">Publié</button>

    <SpinnerComponent :ready="ready"></SpinnerComponent>
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
    margin: auto;
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