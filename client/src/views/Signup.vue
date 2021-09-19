<script>
import SpinnerComponent from "../components/SpinnerComponent.vue";
import { sendRequest } from "../helpers/sendRequest.js";

export default {
  components: {
    SpinnerComponent
  },
  //-----------

  //-----------
  data() {
    return {
      regexEmail: /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){3}\.[a-z]{2,3}$/,
      regexPseudo: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,30}$/,
      regexPassword: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      vEmail: false,
      vPseudo: false,
      vPassword: false,
      email: "",
      pseudo: "",
      firstPassValue: "",
      secondPassValue: "",
      placeholderDoublePass: "Repetez mot de passe",
      placeholderRules: "1 minuscule, 1 majuscule et 1 chiffre",
      message: undefined,
      ready: true
    };
  },
  //-----------

  //-----------
  methods: {
    validInput(regex, value, event) {
      this.message = undefined;

      if (regex.test(value)) {
        console.log("true", event.target);
        event.target.classList.remove("invalid");
        event.target.classList.add("valid");
        return true;
      } else {
        console.log("false", event.target);
        event.target.classList.remove("valid");
        event.target.classList.add("invalid");
        return false;
      }
    },

    validFirstPassword() {
      this.message = undefined;
      console.log("sec", this.secondPassValue);
      if (
        this.firstPassValue.length > 7 &&
        (this.firstPassValue == this.secondPassValue || this.secondPassValue === "") && 
        this.validInput(this.regexPassword, this.firstPassValue, event)
      ) {
        event.target.classList.remove("invalid");
        event.target.classList.add("valid");
        return true;
      } else {
        event.target.classList.remove("valid");
        event.target.classList.add("invalid");
        return false;
      }
    },

    validSecondPassword() {
      this.message = undefined;
      if (
        this.secondPassValue.length > 7 &&
        this.secondPassValue === this.firstPassValue &&
        this.validInput(this.regexPassword, this.secondPassValue, event)
      ) {
        console.log(this.vPassword);
        event.target.classList.remove("invalid");
        event.target.classList.add("valid");
        return true;
      } else {
        console.log(this.vPassword);
        event.target.classList.remove("valid");
        event.target.classList.add("invalid");
        return false;
      }
    },

    signUp(event) {
      event.preventDefault();

      let user = {
        email: this.email,
        pseudo: this.pseudo,
        password: this.secondPassValue
      };

      if (
        this.vEmail &&
        this.vPseudo &&
        this.vPassword &&
        this.secondPassValue === this.firstPassValue
      ) {
        this.ready = false;

        sendRequest("http://localhost:3000/api/user/signup", "POST", user)
          .then(data => {
            this.ready = true;
            if (data.created) {
              // si utilisateur créé
              this.$router.push("/");
            } else {
              this.ready = true;
              this.message = data.message;
              switch (this.message) {
                case "Pseudo deja exist":
                  {
                    document.getElementById("pseudo").classList.remove("valid");
                    document.getElementById("pseudo").classList.add("invalid");
                  }
                  break;
                case "Email deja exist":
                  {
                    document.getElementById("email").classList.remove("valid");
                    document.getElementById("email").classList.add("invalid");
                  }
                  break;
              }
            }
          })
          .catch(err => {
            this.ready = true;
            console.log(err);
          });
      } else {
        this.message = "Veuillez remplire les champs correctement";
      }
    }
  },
  //-----------

  //-----------
  beforeMount() {
    // verification user et distribution ID
    sendRequest(`http://localhost:3000/api/user/info`, "GET")
      .then(res => {
        if (res.error !== 0) {
          // authorized direction vers la page main
          this.$router.push("/main/");
        }
        this.memberId = res.user;
      })
      .then(err => {
        console.log(err);
      });
  }
};
</script>


<template>
  <div id="auth-form">
    <h1>
      <router-link to="/">Connexion</router-link>
      / Enregistré
    </h1>

    <div>
      <form>
        <label for="email">
          Email:
          <input
            type="email"
            id="email"
            class=""
            v-model="email"
            @input="vEmail = validInput(regexEmail, email, $event)"
            placeholder="ex: dimitri42@groupomania.fr"
          />
        </label>

        <label for="pseudo">
          Pseudo:
          <input
            type="text"
            id="pseudo"
            class=""
            v-model="pseudo"
            @input="vPseudo = validInput(regexPseudo, pseudo, $event)"
            placeholder="ex: Dimitri42 (max: 30 symbole)"
          />
        </label>

        <label for="password">
          Mot de pass <u>(min. 8 caractères)</u>:
          <input
            type="password"
            id="password"
            class=""
            placeholder="1 minuscule, 1 majuscule et 1 chiffre"
            v-model="firstPassValue"
            @input="validFirstPassword"
          />
        </label>

        <label for="password">
          <input
            type="password"
            id="passwordDouble"
            class=""
            :placeholder="
              firstPassValue.length > 7 && vPassword
                ? placeholderDoublePass
                : placeholderRules
            "
            v-model="secondPassValue"
            @input="vPassword = validSecondPassword()"
          />
        </label>

        <!-- es-que mot de pass sont identique  -->
        <p
          v-if="firstPassValue != secondPassValue && secondPassValue !== ''"
        >
          Mot de passe ne sont pas identique
        </p>

        <p v-if="message != undefined">
          {{ message }}
        </p>

        <input v-if="ready" type="submit" @click="signUp" value="Créer" />
      </form>
      <SpinnerComponent :ready="ready"></SpinnerComponent>
    </div>
  </div>
</template>


<style lang="scss">
$fontSize: 1rem;

#auth-form {
  font-family: "PT Sans", sans-serif;
  a {
    text-decoration: none;
    color: #000000;
    &:hover {
      color: #1d4380;
    }
  }
  @media screen and (max-width: 769px) {
    width: 90%;
  }
  @media screen and (min-width: 1440px) {
    width: 550px;
  }
  background-color: #fff;
  border-radius: 15px;
  margin: 5vh auto;
  width: 40%;
  font-size: $fontSize;
  box-shadow: 0px 10px 20px 0px rgba(253, 45, 15, 0.5);
  h1 {
    width: 100%;
    background-color: rgba(253, 45, 15, 0.616);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    color: #fff;
    padding: 20px 0;
    text-align: center;
    text-transform: uppercase;
    font-size: $fontSize;
  }
  div {
    border: none;
    padding: 5%;
    // position: relative;
    form {
      width: 100%;
      height: 80%;
      .invalid {
        border: 1px solid red;
      }
      .valid {
        border: 1px solid #0dc378;
      }
      input {
        font-size: $fontSize;
        outline: none;
        width: 50%;
        text-align: center;
        position: center;
        margin: 5px auto;
        border: 1px solid #292829;
        &[type="email"],
        &[type="password"],
        &[type="text"] {
          border-radius: 3px 3px 3px 3px;
          padding: 10px 0;
          width: 100%;
          font-size: $fontSize;
          &::placeholder {
            font-style: italic;
            color: gray;
          }
        }
        &[type="submit"] {
          background-color: #FD2D0F;
          border: none;
          border-radius: 3px;
          color: #000;
          cursor: pointer;
          float: none;
          font-weight: bold;
          margin: 20px 25%;
          padding: 12px 12px;
        }
        &[type="submit"]:hover {
          background-color: #FFD7D7;
        }
      }
      p {
        color: red;
        text-align: center;
      }
    }
  }
}
</style>