<script>
import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "AdminPanel",

  components: {},

  data() {
    return {
      users: [],
      moderators: [],
      admins: [],
      bufferArr: [],
      item: NaN,
      loading: false
    };
  },

  methods: {
    // DRAG&DROP - start
    dragstart(event) {
      console.log("start", event.target);
      event.target.classList.add("hold");
      setTimeout(() => event.target.classList.add("hide"), 1);
    },
    dragend(event) {
      // console.log("DRAG end", event.target);
      // console.log("moder user", parseInt(event.target.id));

      this.item = event.target;

      // this.loading = false;

      console.log("classList", this.item.classList.value);
      if (this.item.classList.value.includes("admin")) {
        this.bufferArr = this.admins;
      }

      if (this.item.classList.value.includes("moderator")) {
        this.bufferArr = this.moderators;
      }

      if (this.item.classList.value.includes("user")) {
        this.bufferArr = this.users;
      }
    },
    dragover(event) {
      // console.log("drag over");
      event.preventDefault();
    },
    dragleave(event) {
      // console.log("leave");
      event.target.classList.remove("hovered");
    },
    dragenter(event) {
      // console.log("enter");
      event.target.classList.add("hovered");
    },
    dragdrop(event) {
      this.loading = true;

      setTimeout(() => {
        event.target.classList.remove("hovered");

        console.log("drag drop");
        if (
          event.target.classList.value == "admins" ||
          event.target.classList.value == "moderators" ||
          event.target.classList.value == "users"
        ) {
          event.target.append(this.item);

          // obtenir class ou on drag
          let stringClasses = event.target.classList.value;
          // couper S a la fin
          let stringClassAdd = stringClasses.substring(
            0,
            stringClasses.length - 1
          );

          const body = {
            memberIdChange: parseInt(this.item.id, 10),
            profilChange: "m"
          };

          if (event.target.classList.value == "admins") {
            console.log("admin switch", parseInt(this.item.id, 10));

            sendRequest("http://localhost:3000/api/admin/profil/", "PUT", body)
              .then(() => {
                // recherche index de element arrivé
                let i = this.bufferArr.findIndex(el => el.id == this.item.id);
                // console.log(i)

                this.changeProfil(this.bufferArr, i, "a");
                // console.log(this.bufferArr)
              })
              .catch(err => console.log(err));
          }

          if (event.target.classList.value == "moderators") {
            console.log("moderator switch", parseInt(this.item.id, 10));

            sendRequest("http://localhost:3000/api/admin/profil/", "PUT", body)
              .then(() => {
                // recherche index de element arrivé
                let i = this.bufferArr.findIndex(el => el.id == this.item.id);
                // console.log(i)

                this.changeProfil(this.bufferArr, i, "m");
                // console.log(this.bufferArr)
              })
              .catch(err => console.log(err));
          }

          if (event.target.classList.value == "users") {
            console.log("user switch", parseInt(this.item.id, 10));

            sendRequest("http://localhost:3000/api/admin/profil/", "PUT", body)
              .then(() => {
                // recherche index de element arrivé
                let i = this.bufferArr.findIndex(el => el.id == this.item.id);
                // console.log(i)

                this.changeProfil(this.bufferArr, i, "u");
                // console.log(this.bufferArr)
              })
              .catch(err => console.log(err));
          }

          // on garder seulement la classe ajoutée
          this.item.className = stringClassAdd;

          // this.getAllUsers();
        }
        // console.log("TARGET", event.target.classList.value);
      }, 100);
    },
    // DRAG&DROP - end

    // GET ALL USERS for hook and methods
    getAllUsers() {
      this.admins = [];
      this.moderators = [];
      this.users = [];

      sendRequest("http://localhost:3000/api/admin/users/", "GET")
        .then(members => {
          if (members.error === 0) {
            this.$router.push("/");
          } else {
            members.forEach(member => {
              switch (member.profil) {
                case "u":
                  this.users.push(member);
                  break;
                case "m":
                  this.moderators.push(member);
                  break;
                case "a":
                  this.admins.push(member);
                  break;
              }
            });
          }
        })
        .catch(err => console.log(err));
    },

    activationDesactivation(categorie, idx) {
      this.loading = true;

      const body = {
        memberIdChange: categorie[idx].id,
        activeChange: categorie[idx].active
      };

      sendRequest("http://localhost:3000/api/admin/status/", "PUT", body)
        .then(() => {
          // invertion du variable, si était active donc desactive
          categorie[idx].active = !categorie[idx].active;

          this.loading = false;
        })
        .catch(err => {
          console.log(err);

          this.loading = false;
        });
    },

    changeProfil(categorie, idx, newProfil) {
      this.loading = true;

      const body = {
        memberIdChange: categorie[idx].id,
        profilChange: newProfil
      };

      sendRequest("http://localhost:3000/api/admin/profil/", "PUT", body)
        .then(() => {
          switch (newProfil) {
            case "a":
              // insere dans le block admins
              this.admins.push(categorie[idx]);
              break;
            case "m":
              // insere dans le block moderators
              this.moderators.push(categorie[idx]);
              break;
            case "u":
              this.users.push(categorie[idx]);
              break;
          }

          // supprimé de la block actuelle
          categorie.splice(idx, 1);

          this.loading = false;
        })
        .catch(err => {
          console.log(err)
          this.loading = false;
        });
    }
  },

  // avant Mount tri massive par cetegorie
  beforeMount() {
    this.getAllUsers();
  }
};
</script>

<template>
  <div id="panel">
    <div id="loading" v-if="loading"></div>

    <!-- BLOCK ADMINISTRATOR -->
    <div
      class="admins"
      v-on:dragover="dragover"
      v-on:drop="dragdrop"
      v-on:dragleave="dragleave"
      v-on:dragenter="dragenter"
    >
      <h2>Administrateurs</h2>
      <div
        v-for="(admin, idx) of admins"
        v-bind:key="admin.id"
        v-bind:id="admin.id"
        v-bind:value="idx"
        v-on:dragstart="dragstart"
        v-on:dragend="dragend"
        class="admin"
        draggable="true"
      >
        <span class="data">
          id: {{ admin.id }} | pseudo: {{ admin.pseudo }}
        </span>
        <span>
          <button
            v-on:click="activationDesactivation(admins, idx)"
            v-bind:class="{
              enabled: admin.active == true,
              desabled: admin.active == false,
            }"
          >
            <i class="fas fa-circle"></i>
          </button>
          <!-- <button v-if="admin.profil != 'a'">A</button> -->
          <button v-on:click="changeProfil(admins, idx, 'm')">M</button>
          <button v-on:click="changeProfil(admins, idx, 'u')">U</button>
          <button class="delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </span>
      </div>
    </div>

    <!-- BLOCK MODERATORS -->
    <div
      class="moderators"
      v-on:dragover="dragover"
      v-on:drop="dragdrop"
      v-on:dragleave="dragleave"
      v-on:dragenter="dragenter"
    >
      <h2>Moderateurs</h2>
      <div
        v-for="(moderator, idx) of moderators"
        v-bind:key="moderator.id"
        v-bind:id="moderator.id"
        v-bind:value="idx"
        v-on:dragstart="dragstart"
        v-on:dragend="dragend"
        class="moderator"
        draggable="true"
      >
        <span class="data">
          id: {{ moderator.id }} | pseudo: {{ moderator.pseudo }}
        </span>
        <span>
          <button
            v-on:click="activationDesactivation(moderators, idx)"
            :class="{
              enabled: moderator.active == true,
              desabled: moderator.active == false,
            }"
          >
            <i class="fas fa-circle"></i>
          </button>
          <button v-on:click="changeProfil(moderators, idx, 'a')">A</button>
          <!-- <button v-if="moderator.profil != 'm'">M</button> -->
          <button v-on:click="changeProfil(moderators, idx, 'u')">U</button>
          <button class="delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </span>
      </div>
    </div>

    <!-- BLOCK USERS -->
    <div
      class="users"
      v-on:dragover="dragover"
      v-on:drop="dragdrop"
      v-on:dragleave="dragleave"
      v-on:dragenter="dragenter"
    >
      <h2>Utulisateurs</h2>
      <div
        v-for="(user, idx) of users"
        v-bind:key="user.id"
        v-bind:id="user.id"
        v-bind:value="idx"
        v-on:dragstart="dragstart"
        v-on:dragend="dragend"
        class="user"
        draggable="true"
      >
        <span class="data">
          id: {{ user.id }} | pseudo: {{ user.pseudo }}
        </span>
        <span>
          <button
            v-on:click="activationDesactivation(users, idx)"
            :class="{
              enabled: user.active == true,
              desabled: user.active == false,
            }"
          >
            <i class="fas fa-circle"></i>
          </button>
          <button v-on:click="changeProfil(users, idx, 'a')">A</button>
          <button v-on:click="changeProfil(users, idx, 'm')">M</button>
          <!-- <button v-if="user.profil != 'u'">U</button> -->
          <button class="delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#loading {
  position: absolute;
  top: -20px;
  width: 100vw;
  height: calc(100% + 40px);
  background-color: #000000;
  opacity: 0.5;
}
h2 {
  margin: 1rem 1rem 0;
}
.hovered {
  opacity: 0.5 !important;
  box-shadow: 0 0 5px 2px red !important;
}
.hold {
  border: 1px solid #eee;
  overflow: hidden;
  // box-shadow: 0 0 5px 2px #6b7689;
}
.hide {
  opacity: 0.25;
  background: grey !important;
}
#panel {
  @media screen and (min-width: 1441px) {
    width: 1400px;
  }
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 95%;
  margin: 20px auto;
  flex-wrap: wrap;
  .admins,
  .moderators,
  .users {
    flex-basis: 400px;
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    background-color: #ffffff;
    opacity: 1;
    border-radius: 10px;
    box-shadow: 0 0 5px 2px #6b7689;
    .admin,
    .user,
    .moderator {
      &:active {
        cursor: grabbing;
      }
      cursor: grab;
      height: 50px;
      display: flex;
      flex-direction: row;
      border: 1px black solid;
      margin: 10px;
      padding: 5px;
      border-radius: 10px;
      background-color: white;
      .data {
        @media screen and (max-width: 376px) {
          width: 50%;
        }
        text-align: start;
        width: 65%;
        margin: 5px;
        margin: auto 0;
      }
      span {
        @media screen and (max-width: 376px) {
          width: 50%;
        }
        text-align: end;
        width: 35%;
        margin: auto 0;
        button {
          font-weight: 700;
          background: transparent;
          border: none;
          &:hover {
            transform: scale(1.25);
          }
        }
      }
      .enabled {
        color: green;
      }
      .desabled {
        color: orange;
      }
      .delete {
        color: red;
      }
    }
  }
}
</style>