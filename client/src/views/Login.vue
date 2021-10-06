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
      vEmail: false,
      email: "",
      password: "",
      message: undefined,
      ready: true // Boolean pour SpinnerComponent
    };
  },
  //-----------

  //-----------
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
    logIn(event) {
      event.preventDefault();

      let user = {
        email: this.email,
        password: this.password
      };

      if (this.vEmail) {
        this.ready = false;
        sendRequest("http://localhost:3000/api/user/login", "POST", user)
          .then(data => {
            if (data.auth) {
              //si authentication reussit
              this.$router.push("/moncompte/");
            } else {
              this.ready = true;
              this.message = data.message;
            }
          })
          .catch(err => {
            this.ready = true;
            console.log(err);
          });
      } else {
        this.ready = true;
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
        if (res.error !== 0 && res.active !== 0) {
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
      Connexion /
      <router-link to="/signup"> Enregistré </router-link>
    </h1>

    <div>
      <form>
        <label for="email">
          Email:
          <input
            type="email"
            id="email"
            v-model="email"
            class=""
            @input="vEmail = validInput(regexEmail, email, $event)"
          />
        </label>

        <label for="password">
          Password:
          <input
            type="password"
            id="password"
            placeholder=""
            v-model="password"
          />
        </label>

        <p v-if="message !== undefined">
          {{ message }}
        </p>

        <input v-if="ready" type="submit" value="Entrer" v-on:click="logIn" />
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