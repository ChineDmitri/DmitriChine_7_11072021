<script>
export default {
  name: "AdminPanel",

  components: {},

  data() {
    return {
      users: [
        { id: 1, name: "Dima" },
        { id: 2, name: "Dima2" },
        { id: 3, name: "Dima3" },
        { id: 4, name: "Dima4" },
        { id: 5, name: "Dima5" },
        { id: 6, name: "Dima6" }
      ],
      item: NaN
    };
  },

  methods: {
    dragstart(event) {
      console.log("start", event.target);
    },
    dragend(event) {
      console.log("DRAG end", event.target);
      this.item = event.target;
    },
    dragover(event) {
      // console.log("drag over");
      event.preventDefault();
    },
    dragdrop(event) {
      setTimeout(() => {
        // on prepare la classe pour un item

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

          // on garder seulement la classe ajoutée
          this.item.className = stringClassAdd;
        }

        // console.log("TARGET", event.target.classList.value);
      }, 100);
    }
  }
};
</script>

<template>
  <div id="panel">
    <div class="admins" v-on:dragover="dragover" v-on:drop="dragdrop">
      <div
        v-for="user of users"
        :key="user.id"
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

    <div class="moderators" v-on:dragover="dragover" v-on:drop="dragdrop"></div>

    <div class="users" v-on:dragover="dragover" v-on:drop="dragdrop"></div>
  </div>
</template>

<style lang="scss">
#panel {
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
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    background-color: blue;
    .admin,
    .user,
    .moderator {
      height: 50px;
      display: flex;
      flex-direction: row;
      border: 1px black solid;
      margin: 10px;
      padding: 5px;
      border-radius: 10px;
      background-color: white;
      .data {
        width: 65%;
        margin: 5px;
        margin: auto 0;
      }
      span {
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