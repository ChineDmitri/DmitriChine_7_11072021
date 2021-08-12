<script>
import { signup } from "../api/auth.js";

export default {
  data() {
    return {
      regexEmail:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      regexPseudo: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,30}$/,
      email: "",
      pseudo: "",
      firstPassValue: "",
      secondPassValue: "",
      placeholderDoublePass: "Repetez mot de passe",
      placeholderRules: "Minimum 8 caractères",
      message: "",
      vEmail: false,
      vPseudo: false,
      vPassword: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    validInput(regex, value) {
      if (regex.test(value)) {
        console.log("true", event.target);
        event.target.classList.remove("invlide");
        event.target.classList.add("valide");
        return true;
      } else {
        console.log("false", event.target);
        event.target.classList.remove("valide");
        event.target.classList.add("invalide");
        return false;
      }
    },

    validFirstPassword() {
      if (this.firstPassValue.length > 7) {
        event.target.classList.remove("invlide");
        event.target.classList.add("valide");
        return true;
      } else {
        event.target.classList.remove("valide");
        event.target.classList.add("invalide");
        return false;
      }
    },

    validSecondPassword() {
      if (
        this.secondPassValue.length > 7 &&
        this.secondPassValue.length === this.firstPassValue.length
      ) {
        event.target.classList.remove("invlide");
        event.target.classList.add("valide");
        return true;
      } else {
        event.target.classList.remove("valide");
        event.target.classList.add("invalide");
        return false;
      }
    },

    signUp(event) {
      event.preventDefault();

      let user = {
        email: this.email,
        pseudo: this.pseudo,
        password: this.secondPassValue,
      };

      if (this.vEmail && this.vPseudo && this.vPassword) {
        signup(user)
          .then((data) => {
            if (data.created) { // si utilisateur créé
              this.$router.push("/");
            } else {
              this.message = data.message;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.message = "Veuillez remplire les champs correctement";
      }
    },
  },
};
</script>

<template>
  <div id="auth-form">
    <h1><router-link to="/">Connexion</router-link> / Enregistré</h1>
    <div>
      <form>
        <label for="email">
          Email:
          <input
            type="email"
            id="email"
            v-model="email"
            class=""
            @input="vEmail = validInput(regexEmail, email)"
            placeholder="ex: dimitri42@groupomania.fr"
          />
        </label>

        <label for="pseudo">
          Pseudo:
          <input
            type="text"
            id="pseudo"
            v-model="pseudo"
            @input="vPseudo = validInput(regexPseudo, pseudo)"
            placeholder="ex: Dimitri42 (max: 30 symbole)"
          />
        </label>

        <label for="password">
          Mot de pass:
          <input
            type="password"
            id="password"
            placeholder="Minimum 8 caractères"
            v-model="firstPassValue"
            @input="validFirstPassword"
          />
        </label>

        <label for="password">
          <input
            type="password"
            id="passwordDouble"
            :placeholder="
              firstPassValue.length > 7
                ? placeholderDoublePass
                : placeholderRules
            "
            v-model="secondPassValue"
            @input="vPassword = validSecondPassword()"
          />
        </label>

        <!-- es-que mot de pass sont identique  -->
        <p
          v-if="firstPassValue.length > 7 && firstPassValue != secondPassValue"
        >
          Mot de passe ne sont pas identique
        </p>
        <p>
          {{ message }}
        </p>

        <input type="submit" @click="signUp" value="Créer" />
      </form>
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
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.3);
  h1 {
    width: 100%;
    background-color: rgba(14, 33, 63, 0.616);
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
      .invalide {
        border: 1px solid red;
      }
      .valide {
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
          background-color: #0dc378;
          border: none;
          border-radius: 3px;
          color: #404040;
          cursor: pointer;
          float: none;
          font-weight: bold;
          margin: 20px 25%;
          padding: 12px 12px;
        }
        &[type="submit"]:hover {
          background-color: #37e69d;
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