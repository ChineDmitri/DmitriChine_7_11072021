<script>
import EmojiBar from "../components/EmojiBar";
import SpinnerComponent from "../components/SpinnerComponent.vue";

import { sendRequestFD } from "../helpers/sendRequest.js";

export default {
  name: "FormPost",
  //-----------

  //-----------
  components: {
    EmojiBar,
    SpinnerComponent
  },
  //-----------

  //-----------
  props: {
    mImageUrl: {
      type: [String, null],
      required: false,
      default: null
    },
    mTitle: {
      type: String,
      required: false,
      default: undefined
    },
    mTextPost: {
      type: String,
      required: false,
      default: ""
    },
    modifyPost: {
      type: Function
    },
    goModify: {
      // si nous sommes en modification = true
      type: Boolean,
      required: false,
      default: false
    },
    idPostNew: {
      type: Number,
      required: false
    }
  },
  //-----------

  //-----------
  data() {
    return {
      emoji: false,
      imageUrl: null,
      title: undefined,
      textPost: "",
      ready: true,
      vTitle: false,
      vTextPost: false,
      message: undefined,
      placeholderTitle: "Ex: Qu-est ce que c'est « Hello world »",
      placeholderTextPost:
        "Ex: « Hello world » (traduit littéralement en français par « Bonjour le monde ») sont les mots traditionnellement écrits par un programme informatique simple dont le but est de faire la démonstration rapide de son exécution sans erreur."
    };
  },
  //-----------

  //-----------
  methods: {
    addEmodji(event) {
      console.log(decodeURI(event.target.value));

      let cursorIndex = document.getElementById("inputTextField").selectionEnd; // Index d'un symbol apres dernier symbol selectioné

      this.textPost =
        this.textPost.substring(0, cursorIndex) +
        event.target.value +
        this.textPost.substring(cursorIndex);

      this.emoji = false;
    },

    // preview d'une image
    getImg() {
      this.imageUrl = event.target.files[0];

      // console.log(event.target.files[0]);

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
        // this.imageUrl = this.mImageUrl; // si n'est pas besoin supprimé img precedant
        // console.log(this.mImageUrl)
        this.imageUrl = null;
      }
    },

    // creation du post
    createPost() {
      // this.title = this.mTitle;
      // this.textPost = this.mTextPost;
      // this.vTitle = this.mTitle.length > 0 ? true : false;
      // this.vTextPost = this.mTextPost.length > 0 ? true : false;
      // console.log("creat", this.vTitle, this.vTextPost)

      if (!this.vTextPost || !this.vTitle) {
        console.log(this.vTextPost, this.vTitle);
        this.message = "Veuillez remplire les champs correctement";
        return;
      }

      this.ready = false;
      // console.log(this.title, this.textPost, this.imageUrl);

      const postData = new FormData();

      postData.append("title", this.title);
      postData.append("discription", this.textPost);
      postData.append("imageUrl", this.imageUrl);

      console.log(postData);

      sendRequestFD("http://localhost:3000/api/post/create", "POST", postData)
        .then(res => {
          this.ready = true;
          if (res.status && res.error !== 0) {
            this.$router.push("/main/");
          } else {
            this.$router.push("/");
          }
          console.log("create ", res);
        })
        .catch(err => {
          this.ready = true;
          console.log("error ", err);
        });
    },

    // modification du post
    modificationPost() {
      this.title = this.mTitle;
      this.textPost = this.mTextPost;
      this.vTitle = this.mTitle.length > 0 ? true : false;
      this.vTextPost = this.mTextPost.length > 0 ? true : false;
      console.log("creat", this.vTitle, this.vTextPost)

      if (!this.vTextPost || !this.vTitle) {
        console.log(this.vTextPost, this.vTitle);
        this.message = "Veuillez remplire les champs correctement";
        return;
      }

      this.ready = false;

      const postData = new FormData(); // creation nouvelle instance FormData

      postData.append("title", this.title);
      postData.append("discription", this.textPost);
      postData.append("imageUrl", this.imageUrl);

      console.log(this.imageUrl);

      sendRequestFD(
        `http://localhost:3000/api/post/${this.idPostNew}`,
        "PUT",
        postData
      )
        .then(res => {
          this.ready = true;
          if (res.modified) {
            // this.$router.push(`/main/post/${this.idPostNew}`);
            if (this.$route.params.id == this.idPostNew) {
              // si changement depuis post il faut faire reload() pour fair mise à jour
              window.location.reload();
            } else {
              this.$router.push(`/main/post/${this.idPostNew}`);
              this.modifyPost();
            }
          } else {
            this.$router.push("/");
          }
          // console.log("create ", res);
        })
        .catch(err => {
          this.ready = true;
          console.log("error ", err);
        });
    },

    validInput(event) {
      if (event.target.value.length !== 0) {
        console.log("true", event.target);
        event.target.classList.remove("invalid");
        event.target.classList.add("valid");
        this.message = undefined;
        return true;
      } else {
        console.log("false", event.target);
        event.target.classList.remove("valid");
        event.target.classList.add("invalid");
        return false;
      }
    }
  },
  //-----------

  //-----------
  beforeMount() {
    (this.imageUrl = this.mImageUrl),
      (this.title = this.mTitle),
      (this.textPost = this.mTextPost);
    this.vTitle = this.title > 0 ? true : false;
    this.vTextPost = this.textPost > 0 ? true : false;
  }
};
</script>


<template>
  <div class="post">
    <label for="title">
      Title de post:
      <input
        :placeholder="placeholderTitle"
        v-model="title"
        type="text"
        id="title"
        @input="vTitle = validInput($event)"
      />
    </label>

    <label for="inputTextField">
      Text de post:
      <textarea
        :placeholder="placeholderTextPost"
        v-model="textPost"
        rows="10"
        name="text"
        id="inputTextField"
        @input="vTextPost = validInput($event)"
      >
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

      <EmojiBar v-if="emoji" :addEmodji="addEmodji"> </EmojiBar>

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

    <p id="message" v-if="message != undefined">
      {{ message }}
    </p>

    <button v-if="ready && !goModify" @click="createPost" class="btn-classic">
      Publié
    </button>

    <button
      v-if="goModify && ready"
      @click="modificationPost"
      class="btn-classic"
    >
      Modifier
    </button>

    <button
      v-if="goModify && ready"
      @click="modifyPost"
      class="btn-classic btn-orange"
    >
      Retourné
    </button>

    <SpinnerComponent :ready="ready"></SpinnerComponent>
  </div>
</template>


<style lang="scss">
$fontSize: 1rem;

#message {
  text-align: center;
  color: red;
}

.post {
  position: relative;
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