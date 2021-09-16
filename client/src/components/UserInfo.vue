<script>
// sendRequest(url, method, body (null for GET!))
import { sendRequestFD, sendRequest } from "../helpers/sendRequest.js";
import PopUnderInfo from "../components/PopUnderInfo";
import PopUnderConfirmation from "../components/PopUnderConfirmation";
import SpinnerComponent from "../components/SpinnerComponent.vue";

export default {
  name: "UserInfo",

  components: {
    PopUnderInfo,
    PopUnderConfirmation,
    SpinnerComponent
  },

  props: {
    modeUpdateInfoUser: {
      type: Function,
      required: false
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
      required: true
    },
    modificationCompte: {
      type: Boolean,
      required: false
    },
    changeCatNum: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      regexPseudo: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,30}$/,
      vPseudo: false,
      changePseudo: undefined,
      imageUrl: undefined,
      showInfo: false,
      showConfirmation: false,
      ready: true,
      messageErr: "Ce pseudo deja existe, veuillez choisir different que",
      message: "Voulez-vous vraiment supprimer votre compte?"
    };
  },

  methods: {
    // validation d'input et attribution le classe correspendant
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

    // mis a jour nouveau donné d'un utilisateur
    updateInfoUser() {
      let newPseudo = document.getElementById("newPseudo");
      this.changePseudo = newPseudo.value;

      if (this.vPseudo || this.changePseudo === this.pseudo) {
        this.ready = false;
        const file = this.imageUrl ? this.imageUrl : this.imgProfil;

        const userData = new FormData(); // creation nouvalle instance FormData
        userData.append("pseudo", newPseudo.value);
        userData.append("imageUrl", file);

        // console.log(userData);

        sendRequestFD("http://localhost:3000/api/user/", "PUT", userData)
          .then(res => {
            if (res.status) {
              // console.log(res);
              window.location.reload();
            } else {
              this.ready = true;
              if (res.error.errno === 1062) {
                document.getElementById("newPseudo").classList.add("invalid");
                document.getElementById("newPseudo").classList.remove("valid");
                this.changeBooleanInfo();
              }
            }
          })
          .catch(err => {
            this.ready = true;
            console.log(err);
          });
      }
    },

    // supprimé compte
    deleteUser() {
      sendRequest("http://localhost:3000/api/user/", "DELETE")
        .then(res => {
          if (res.deleted) {
            this.$router.push("/");
          }
        })
        .catch(err => console.log(err));
    },

    // obtenir preview d'un image pour photo de compte
    getImg(event) {
      this.imageUrl = event.target.files[0];
      // console.log("this.imageUrl", this.imageUrl);

      let img = document.getElementById("userPhoto"); // où inserer preview photo

      if (event.target.files[0] !== undefined) {
        // pour lire le contenu de fichiers
        let fReader = new FileReader();
        fReader.readAsDataURL(event.target.files[0]);
        fReader.onloadend = function(event) {
          img.src = event.target.result;
        };
      } else {
        img.src = this.imgProfil;
      }
    },

    changeBooleanInfo() {
      return (this.showInfo = !this.showInfo);
    },

    changeBooleanConfirmation() {
      return (this.showConfirmation = !this.showConfirmation);
    }
  },
  // --------

  // --------
  computed: {
    dateFormated: function() {
      let date = new Date(this.dateInscription);

      let options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };

      // console.log(Intl.DateTimeFormat('fr-FR', options).format(date));
      return Intl.DateTimeFormat("fr-FR", options).format(date);
    }
  }
};
</script>


<template>
  <div id="account">
    <transition name="fade">
      <PopUnderInfo
        :changeBooleanInfo="changeBooleanInfo"
        :showInfo="showInfo"
        :messageErr="messageErr"
        :changePseudo="changePseudo"
      ></PopUnderInfo>
    </transition>

    <transition name="fade">
      <PopUnderConfirmation
        :deleteUser="deleteUser"
        :changeBooleanConfirmation="changeBooleanConfirmation"
        :showConfirmation="showConfirmation"
        :message="message"
      ></PopUnderConfirmation>
    </transition>

    <div id="header">
      <div id="header-photo">
        <img id="userPhoto" :src="imgProfil" alt="" />
      </div>

      <div id="header-info">
        <span v-if="!modificationCompte" id="header-info-pseudo">
          <!-- pseudo à afficher -->
          {{ pseudo === null ? "Utilisateur Supprimé" : pseudo }}
        </span>

        <label v-if="modificationCompte" for="newPseudo">
          Nouveau pseudo:
          <input
            id="newPseudo"
            v-bind:value="pseudo"
            class=""
            type="text"
            @input="
              vPseudo = validInput(
                this.regexPseudo,
                $event.target.value,
                $event
              )
            "
          />
        </label>

        <label v-if="modificationCompte" for="inputFile">
          Photo profil:
          <input
            id="inputFile"
            accept="image/png, image/jpg, image/jpeg,"
            type="file"
            title=" "
            @change="getImg"
          />
        </label>

        <span v-if="modificationCompte">
          <router-link to="/newpass">
            Changer mot de pass
          </router-link>
        </span>

        <SpinnerComponent :ready="ready"></SpinnerComponent>

        <div v-if="ready" id="btn-confirmation">
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
            class="btn-classic btn-orange"
          >
            Retourner
          </button>
        </div>

        <span v-if="!modificationCompte" id="header-info-dateInsc">
          Date d'inscription: {{ dateFormated }}
        </span>

        <div v-if="monCompte" id="header-info-manipulation">
          <button class="btn-ico">
            <i
              @click="modeUpdateInfoUser"
              v-if="!modificationCompte"
              class="fas fa-pencil-alt orange"
            >
            </i>
          </button>

          <button class="btn-ico">
            <i
              @click="changeBooleanConfirmation"
              v-if="!modificationCompte"
              class="fas fa-trash-alt red"
            >
            </i>
          </button>
        </div>

        <div id="header-info-statistic">
          <button v-if="!modificationCompte" @click="changeCatNum(1)"  class="btn-classic" value="0">
            Les posts publiés
          </button>

          <button v-if="!modificationCompte" @click="changeCatNum(2)" class="btn-classic" value="0">
            Les commentaires publiés
          </button>
        </div>
      </div>
    </div>
  </div>
</template>