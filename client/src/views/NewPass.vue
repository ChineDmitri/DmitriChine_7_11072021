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
      firstPassValue: "",
      secondPassValue: "",
      vPassword: false,
      placeholderDoublePass: "Repetez mot de passe",
      placeholderRules: "Minimum 8 caractères",
      message: undefined,
      ready: true // Boolean pour SpinnerComponent
    };
  },
  //-----------

  //-----------
  methods: {
    validFirstPassword() {
      this.message = undefined;
      if (this.firstPassValue.length > 7) {
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
        this.secondPassValue === this.firstPassValue
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

    changePass(event) {
      event.preventDefault();

      if (!this.vPassword && this.firstPassValue !== this.secondPassValue) {
        this.message = "Les mots de passe saisis ne sont pas identiques";
      } else {
        const body = {
          password: this.secondPassValue
        };

        sendRequest("http://localhost:3000/api/user/newpass", "PUT", body)
          .then(data => {
            if (data.modified) {
              this.$router.push("/");
            } else {
              this.ready = true;
              this.message = data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }

      if (this.secondPassValue === this.firstPassValue) {
        this.ready = false;
      }
    }
  }
};
</script>


<template>
  <div id="auth-form">
    <h1>Creation nouveau mot de pass / <a href="javascript:history.back();">Retourner</a></h1>

    <div>
      <form>
        <label for="password">
          Mot de pass:
          <input
            type="password"
            id="password"
            class=""
            placeholder="Minimum 8 caractères"
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
              firstPassValue.length > 7
                ? placeholderDoublePass
                : placeholderRules
            "
            v-model="secondPassValue"
            @input="vPassword = validSecondPassword()"
          />
        </label>

        <p v-if="message !== undefined">
          {{ message }}
        </p>

        <input type="submit" value="Changer" @click="changePass" />
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