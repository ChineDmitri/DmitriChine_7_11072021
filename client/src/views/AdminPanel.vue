<script>
export default {
  name: "AdminPanel",

  components: {},

  data() {
    return {
      users: [
        { id: 1, name: "Dima" },
        { id: 2, name: "Dima" },
        { id: 3, name: "Dima" }
      ],
      item: NaN
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
      console.log("DRAG end", event.target);
      console.log("DRAG end2", event.target);

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

          switch (event.target.classList.value) {
            case "admins":
              console.log("admin", this.item.id);
              break;
            case "moderators":
              console.log("moderator", this.item.id);
              break;
            case "users":
              console.log("user", this.item.id);
              break;
          }

          // on garder seulement la classe ajoutée
          this.item.className = stringClassAdd;
        }
        // console.log("TARGET", event.target.classList.value);
      }, 100);
    },
    // DRAG&DROP - end

    eleve(idx) {
      console.log(idx);
    }
  }
};
</script>

<template>
  <div id="panel">
    <div
      class="admins"
      v-on:dragover="dragover"
      v-on:drop="dragdrop"
      v-on:dragleave="dragleave"
      v-on:dragenter="dragenter"
    >
      <h2>Administrateurs</h2>
      <div
        v-for="user of users"
        v-bind:key="user.id"
        v-bind:id="user.id"
        v-on:dragstart="dragstart"
        v-on:dragend="dragend"
        class="user"
        draggable="true"
      >
        <span class="data">id: {{ user.id }} | pseudo: tt </span>
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
    </div>

    <div
      class="users"
      v-on:dragover="dragover"
      v-on:drop="dragdrop"
      v-on:dragleave="dragleave"
      v-on:dragenter="dragenter"
    >
      <h2>Utilisateurs</h2>
    </div>
  </div>
</template>

<style lang="scss">
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
  width: 90%;
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