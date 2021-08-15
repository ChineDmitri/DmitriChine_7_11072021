<script>
// sendRequest(url, method, body (null for GET!))
import { sendRequestFD } from "../helpers/sendRequest.js";
import PopUnderInfo from "../components/PopUnderInfo";

export default {
  name: "UserInfo",
  components: {
    PopUnderInfo
  },
  props: {
    modeUpdateInfoUser: {
      type: Function,
    },
    pseudo: {
      type: String,
      required: true
    },
    dateInscription: {
      type: String,
      required: true
    },
    imgProfil: {
      type: String,
      required: true
    },
    monCompte: {
      type: Boolean,
      required: true,
    },
    modificationCompte: {
      type: Boolean,
    }
  },
  data() {
    return {
      regexPseudo: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,30}$/,
      vPseudo: false,
      changePseudo: undefined,
      imageUrl: undefined,
      showmodal: false,
      messageErr: "Ce pseudo deja existe, veuillez choisir different que"
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
      let newPseudo = document.getElementById("newPseudo")
      this.changePseudo = newPseudo.value;

      if (this.vPseudo || this.changePseudo === this.pseudo) {
        const file = this.imageUrl ? this.imageUrl : this.imgProfil;

        const userData = new FormData();
        userData.append("pseudo", newPseudo.value);
        userData.append("imageUrl", file);

        // console.log(userData);

        sendRequestFD("http://localhost:3000/api/auth/", "PUT", userData)
          .then(res => {
            if (res.status) {
              // console.log(res);
              window.location.reload();
            } else {
              if (res.error.errno === 1062) {
                document.getElementById("newPseudo").classList.add("invalid");
                document.getElementById("newPseudo").classList.remove("valid");
                this.modalBoolean();
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
    },

    modalBoolean() {
      return (this.showmodal = !this.showmodal);
    }
  }
};
</script>

<template>
  <div id="account">
    <transition name="fade">
      <PopUnderInfo
        :showmodal="showmodal"
        :modalBoolean="modalBoolean"
        :messageErr="messageErr"
      ></PopUnderInfo>
    </transition>
    <div id="header">
      <div id="header-photo">
        <img id="userPhoto" :src="imgProfil" alt="" />
      </div>
      <div id="header-info">
        <span v-if="!modificationCompte" id="header-info-pseudo">
          {{ pseudo }}
        </span>
        <label v-if="modificationCompte" for="newPseudo">
          Nouveau pseudo:
          <input
            id="newPseudo"
            v-bind:value="pseudo"
            class=""
            type="text"
            @input="
              vPseudo = validInput(this.regexPseudo, $event.target.value, $event)
            "
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
          >Date d'inscription: {{ dateInscription }}</span
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