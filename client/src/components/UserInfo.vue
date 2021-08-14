<script>
// sendRequest(url, method, body (null for GET!))
import { sendRequestFD } from "../api/index.js";

export default {
  name: "UserInfo",
  props: [
    "modeUpdateInfoUser",
    "pseudo",
    "dateInscriotion",
    "imgProfil",
    "monCompte",
    "modificationCompte",
  ],
  data() {
    return {
      changePseudo: "",
      imageUrl: undefined,
    };
  },
  methods: {
    updateInfoUser() {
      // console.log(this.imageUrl);

      const file = this.imageUrl ? this.imageUrl : this.imgProfil;

      const userData = new FormData();
      userData.append("pseudo", this.changePseudo);
      userData.append("imageUrl", file);

      console.log(userData);

      sendRequestFD("http://localhost:3000/api/auth/", "PUT", userData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    },
    getImg(event) {
      this.imageUrl = event.target.files[0];
      // console.log("this.imageUrl", this.imageUrl);

      let img = document.getElementById("userPhoto"); // où inserer preview photo

      // pour lire le contenu de fichiers
      let fReader = new FileReader();
      fReader.readAsDataURL(event.target.files[0]);
      fReader.onloadend = function (event) {
        img.src = event.target.result;
      };
    },
  },
};
</script>

<template>
  <div id="account">
    <div id="header">
      <div id="header-photo">
        <img id="userPhoto" :src="imgProfil" alt="" />
      </div>
      <div id="header-info">
        <span v-if="!modificationCompte" id="header-info-pseudo">{{
          pseudo
        }}</span>
        <label v-if="modificationCompte" for="newPseudo">
          Nouveau pseudo:
          <input id="newPseudo" v-model="changePseudo" type="text" />
        </label>
        <label v-if="modificationCompte" for="inputFile">
          Photo profil:
          <input
            id="inputFile"
            accept="image/png, image/gif, image/jpeg"
            type="file"
            @change="getImg"
          />
        </label>
        <button
          @click="updateInfoUser"
          v-if="modificationCompte"
          class="btn-classic"
          value="0"
        >
          Modifier
        </button>
        <span v-if="!modificationCompte" id="header-info-dateInsc"
          >Date d'inscription: {{ dateInscriotion }}</span
        >
        <div v-if="monCompte" id="header-info-manipulation">
          <button class="btn-ico">
            <i
              @click="modeUpdateInfoUser"
              v-if="!modificationCompte"
              class="fas fa-pencil-alt orange"
            ></i>
          </button>
          <button class="btn-ico">
            <i v-if="!modificationCompte" class="fas fa-trash-alt red"></i>
          </button>
        </div>
        <div id="header-info-statistic">
          <button v-if="!modificationCompte" class="btn-classic" value="0">
            Les posts publiés
          </button>
          <button v-if="!modificationCompte" class="btn-classic" value="0">
            Les commentaires publiés
          </button>
        </div>
      </div>
    </div>
  </div>
</template>