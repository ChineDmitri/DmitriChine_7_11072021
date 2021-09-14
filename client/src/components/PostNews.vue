<script>
export default {
  name: "PostNews",

  data() {
    return {
      showPhotoGalery: false
    };
  },

  props: {
    postId: {
      type: Number,
      required: true
    },
    memberId: {
      // qui est en session
      type: [Number, undefined],
      required: false
    },
    memberProfil: {
      type: [String, undefined],
      required: false
    },
    title: {
      type: String,
      required: true
    },
    discription: {
      type: String,
      required: true
    },
    likes: {
      type: [Number, null],
      required: true
    },
    dislikes: {
      type: [Number, null],
      required: true
    },
    comments: {
      type: Number,
      require: true
    },
    pseudo: {
      type: [String, null],
      required: true
    },
    datePublication: {
      type: String,
      required: true
    },
    dateModification: {
      type: [String, null],
      required: true
    },
    urlImg: {
      type: [String, null, undefined],
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    status: {
      type: [Number, null],
      required: true
    },
    idx: {
      type: Number,
      required: false
    },
    deletePost: {
      type: Function,
      required: true
    },
    changeBooleanConfirmation: {
      type: Function,
      required: true
    },
    modifyPost: {
      type: Function,
      required: true
    },
    votePost: {
      type: Function,
      required: true
    }
  },

  methods: {
    photoGalery(status) {
      return !status;
    }
    // test() {
    //   console.log("test")
    // }
  },

  computed: {
    dateFormated: function() {
      let date = new Date(this.datePublication);

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
    },
    dateModificationFormated: function() {
      let date = new Date(this.dateModification);

      let options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };

      return Intl.DateTimeFormat("fr-FR", options).format(date);
    }
  }
};
</script>


<template>
  <div class="post">
    <!-- PHOTO GALERY start -->
    <div
      id="grandImg"
      v-if="showPhotoGalery"
      v-on:click="showPhotoGalery = photoGalery(showPhotoGalery)"
    >
      <img :src="urlImg" :alt="title" />
    </div>
    <!-- PHOTO GALERY fin -->

    <!-- START BAR avec title et button manip -->
    <div class="post-title">
      <router-link :to="{ name: 'OnePostNews', params: { id: postId } }">
        {{ title }}
      </router-link>

      <span
        v-if="
          memberId === userId || memberProfil === 'm' || memberProfil === 'a'
        "
      >
        <button @click="modifyPost(idx)" class="btn-ico modif">
          <i class="fas fa-pencil-alt orange"></i>
        </button>

        <button @click="changeBooleanConfirmation(idx)" class="btn-ico">
          <i class="fas fa-trash-alt red"></i>
        </button>
      </span>

      <hr />
    </div>
    <!-- FIN BAR -->

    <!-- START BLOCK BODY avec disciption et image -->
    <div class="post-body">
      <div class="post-body-text">
        {{ discription }}
      </div>

      <div
        v-on:click="showPhotoGalery = photoGalery(showPhotoGalery)"
        v-if="urlImg && urlImg !== 'null'"
        class="post-body-photo"
      >
        <!-- <a href="#" class="post-body-photo-one"> -->
        <img :src="urlImg" :alt="title" />
        <!-- </a> -->
      </div>
    </div>
    <!-- FIN BLOCK BODY -->

    <!-- START BLOCK avec pseudo auteur / date pub / date modif -->
    <span class="post-author">
      Ecrit par:
      <router-link
        v-if="memberId !== userId"
        :to="{ name: 'Compte', params: { id: userId } }"
      >
        <!-- pseudo à afficher -->
        {{ pseudo === null ? "Utilisateur Supprimé" : pseudo }}
      </router-link>

      <router-link v-else to="/moncompte">
        {{ pseudo }}
      </router-link>

      à {{ dateFormated }}

      <br />

      {{
        dateModification !== null
          ? `(dernier modification: ${dateModificationFormated})`
          : null
      }}
      <!-- (dernier modification: 26/05/2021 21h50) -->
    </span>
    <!-- FIN BLOCK -->

    <!-- START BAR avec likes / dilikes / comments -->
    <span class="post-status">
      <button @click="votePost(idx, 1)" class="btn-ico">
        <i class="far fa-thumbs-up" :class="{ green: status === 1 }"> </i>
      </button>

      <span class="counterLike">{{
        likes == null && dislikes == null ? 0 : likes + dislikes
      }}</span>

      <button @click="votePost(idx, -1)" class="btn-ico">
        <i class="far fa-thumbs-down" :class="{ red: status === -1 }"> </i>
      </button>

      <router-link
        class="btn-ico btn-comment"
        :to="{ name: 'OnePostNews', params: { id: postId } }"
      >
        <i class="far fa-comment"></i>
        {{ comments }}
      </router-link>
      <!-- <button class="btn-ico"><i class="far fa-comment">25</i></button> -->
    </span>
    <!-- FIN BAR -->
  </div>
</template>

<style lang="scss">
#grandImg {
  animation-name: slowPopUnder;
  animation-duration: 250ms;
  animation-timing-function: ease-out;
  @keyframes slowPopUnder {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  z-index: 99999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  widows: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  // opacity: 0.5;
  img {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 10px;
    box-shadow: 0 0 10px 4px #6b7689;
    max-width: 90vw;
    max-height: 90vh;
  }
  #close {
    position: absolute;
    top: 25px;
    bottom: 0;
    right: 20px;
  }
}
</style>