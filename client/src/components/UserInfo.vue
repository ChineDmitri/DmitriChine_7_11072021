<script>
// sendRequest(url, method, body (null for GET!))
import { sendRequestFD } from "../api/index.js";

export default {
  name: "UserInfo",
  props:
    [
      "modeUpdateInfoUser",
      "pseudo",
      "dateInscriotion",
      "imgProfil",
      "monCompte",
      "modificationCompte",
      "getInfoUser"
    ],
  data() {
    return {
      regexPseudo: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,30}$/,
      vPseudo: false,
      changePseudo: null,
      imageUrl: undefined,
      labelPseudo: "Nouveau pseudo:"
    };
  },
  methods: {
    validInput(regex, value, event) {
      if (regex.test(value)) {
        // console.log("true", event.target);
        event.target.classList.remove("invalid");
        event.target.classList.add("valid");
        return true;
      } else {
        // console.log("false", event.target);
        event.target.classList.remove("valid");
        event.target.classList.add("invalid");
        return false;
      }
    },

    updateInfoUser() {
      if (this.vPseudo) {
        const file = this.imageUrl ? this.imageUrl : this.imgProfil;

        const userData = new FormData();
        userData.append("pseudo", this.changePseudo);
        userData.append("imageUrl", file);

        // console.log(userData);

        sendRequestFD("http://localhost:3000/api/auth/", "PUT", userData)
          .then(res => {
            if (res.status) {
              console.log(res);
              window.location.reload();
            } else {
              if (res.error.errno === 1062) {
                this.labelPseudo = " Pseudo deja occupé";
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    getImg(event) {
      this.imageUrl = event.target.files[0];
      // console.log("this.imageUrl", this.imageUrl);

      let img = document.getElementById("userPhoto"); // où inserer preview photo

      // pour lire le contenu de fichiers
      let fReader = new FileReader();
      fReader.readAsDataURL(event.target.files[0]);
      fReader.onloadend = function(event) {
        img.src = event.target.result;
      };
    }
  }
};
</script>

<template>
  <div id="account">
    <div id="header">
      <div id="header-photo">
        <img id="userPhoto" :src="imgProfil" alt="" />
      </div>
      <div id="header-info">
        <span v-if="!modificationCompte" id="header-info-pseudo">
          {{ pseudo }}
        </span>
        <label v-if="modificationCompte" for="newPseudo">
          {{ labelPseudo }}
          <input
            id="newPseudo"
            v-model="changePseudo"
            class=""
            type="text"
            @input="vPseudo = validInput(this.regexPseudo, this.changePseudo, $event)"
          />
        </label>
        <label v-if="modificationCompte" for="inputFile">
          Photo profil:
          <input
            id="inputFile"
            accept="image/png, image/gif, image/jpeg"
            type="file"
            title=" "
            @change="getImg"
          />
        </label>

        <div id="btn-confirmation">
          <button
            @click="updateInfoUser"
            v-if="modificationCompte"
            class="btn-classic"
          >
            Modifier
          </button>
          <button
            v-if="modificationCompte"
            @click="modeUpdateInfoUser"
            class="btn-classic orange"
          >
            Retourner
          </button>
        </div>

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