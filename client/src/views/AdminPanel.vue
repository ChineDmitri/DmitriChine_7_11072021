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

          if (event.target.classList.value == "admins") {
            console.log("admin switch", parseInt(this.item.id, 10));

            const body = {
              memberIdChange: parseInt(this.item.id, 10),
              profilChange: "a"
            };

            sendRequest("http://localhost:3000/api/admin/profil/", "PUT", body);
            // .this(res => {
            //   console.log(res);
            // })
            // .catch(err => console.log(err));
          }

          if (event.target.classList.value == "moderators") {
            console.log("moderator switch", parseInt(this.item.id, 10));

            const body = {
              memberIdChange: parseInt(this.item.id, 10),
              profilChange: "m"
            };

            sendRequest("http://localhost:3000/api/admin/profil/", "PUT", body);
            // .this(res => {
            //   this.loading = false;
            //   console.log(res);
            // })
            // .catch(err => console.log(err));
          }

          if (event.target.classList.value == "users") {
            console.log("user switch", parseInt(this.item.id, 10));

            const body = {
              memberIdChange: parseInt(this.item.id, 10),
              profilChange: "u"
            };

            sendRequest("http://localhost:3000/api/admin/profil/", "PUT", body);
          }

          // on garder seulement la classe ajoutée
          this.item.className = stringClassAdd;
        }
        // console.log("TARGET", event.target.classList.value);
      }, 100);
    }
    // DRAG&DROP - end
  },

  // avant Mount tri massive par cetegorie
  beforeMount() {
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
  }
};
</script>

<template>
  <div id="panel">
    <div class="loading" v-if="loading"></div>

    <div
      class="admins"
      v-on:dragover="dragover"
      v-on:drop="dragdrop"
      v-on:dragleave="dragleave"
      v-on:dragenter="dragenter"
    >
      <h2>Administrateurs</h2>
      <div
        v-for="admin of admins"
        v-bind:key="admin.id"
        v-bind:id="admin.id"
        v-on:dragstart="dragstart"
        v-on:dragend="dragend"
        class="admin"
        draggable="true"
      >
        <span class="data">
          id: {{ admin.id }} | pseudo: {{ admin.pseudo }}
        </span>
        <span>
          <button class="desabled">
            <i class="fas fa-circle"></i>
          </button>
          <button>A</button>
          <button>M</button>
          <button>U</button>
          <button class="delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </span>
      </div>
    </div>

    <div
      class="moderators"
      v-on:dragover="dragover"
      v-on:drop="dragdrop"
      v-on:dragleave="dragleave"
      v-on:dragenter="dragenter"
    >
      <h2>Moderateurs</h2>
      <div
        v-for="moderator of moderators"
        v-bind:key="moderator.id"
        v-bind:id="moderator.id"
        v-on:dragstart="dragstart"
        v-on:dragend="dragend"
        class="moderator"
        draggable="true"
      >
        <span class="data">
          id: {{ moderator.id }} | pseudo: {{ moderator.pseudo }}
        </span>
        <span>
          <button class="desabled">
            <i class="fas fa-circle"></i>
          </button>
          <button>A</button>
          <button>M</button>
          <button>U</button>
          <button class="delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </span>
      </div>
    </div>

    <div
      class="users"
      v-on:dragover="dragover"
      v-on:drop="dragdrop"
      v-on:dragleave="dragleave"
      v-on:dragenter="dragenter"
    >
      <h2>Utulisateurs</h2>
      <div
        v-for="user of users"
        v-bind:key="user.id"
        v-bind:id="user.id"
        v-on:dragstart="dragstart"
        v-on:dragend="dragend"
        class="user"
        draggable="true"
      >
        <span class="data">
          id: {{ user.id }} | pseudo: {{ user.pseudo }}
        </span>
        <span>
          <button class="desabled">
            <i class="fas fa-circle"></i>
          </button>
          <button>A</button>
          <button>M</button>
          <button>U</button>
          <button class="delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.loading {
  opacity: 0.5;
  position: absolute;
  top: -20px;
  width: 100vw;
  height: calc(100% + 40px);
  background-color: black;
  z-index: 99;
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