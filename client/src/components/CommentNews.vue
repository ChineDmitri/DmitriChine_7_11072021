<script>
export default {
  name: "CommentNews",

  props: {
    commentId: {
      type: Number,
      required: true
    },
    memberId: {
      type: Number,
      required: true
    },
    memberProfil: {
      type: String,
      required: true
    },
    commentaire: {
      type: String,
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
    likes: {
      type: [Number, null],
      required: true
    },
    dislikes: {
      type: [Number, null],
      required: true
    },
    status: {
      type: [Number, null],
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    pseudo: {
      type: [String, null],
      required: true
    },
    idx: {
      type: Number,
      required: true
    },
    deleteComment: {
      type: Function,
      required: true
    },
    changeBooleanConfirmationComment: {
      type: Function,
      required: true
    },
    modifyComment: {
      type: Function,
      required: true
    },
    voteComment: {
      type: Function,
      required: true
    }
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
  <div class="comments">
    <p>
      {{ commentaire }}
    </p>

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
          ? `(dernier modification: ${dateModification})`
          : null
      }}
      <!-- (dernier modification: 26/05/2021 21h50) -->
    </span>

    <span class="post-status">
      <button @click="voteComment(idx, 1)" class="btn-ico">
        <i class="far fa-thumbs-up" :class="{ green: status === 1 }"> </i>
      </button>

      <span class="counterLike">{{
        likes == null && dislikes == null ? 0 : likes + dislikes
      }}</span>

      <button @click="voteComment(idx, -1)" class="btn-ico">
        <i class="far fa-thumbs-down" :class="{ red: status === -1 }"> </i>
      </button>

      <span
        v-if="
          memberId === userId || memberProfil === 'm' || memberProfil === 'a'
        "
      >
        <button @click="modifyComment(idx)" class="btn-ico modif">
          <i class="fas fa-pencil-alt orange"></i>
        </button>

        <button @click="changeBooleanConfirmationComment(idx)" class="btn-ico">
          <i class="fas fa-trash-alt red"></i>
        </button>
      </span>
    </span>
  </div>
</template>

<style lang="scss">

main {
  #content {
    .container-comments {
      .comments {
    label {
      margin: 5px 0;
      position: relative;
    }
    input,
    textarea {
      outline: none;
      width: calc(100% - 12px);
      text-align: left;
      // position: center;
      margin: auto;
      border: 1px solid #292829;
      border-radius: 3px 3px 3px 3px;
      padding: 5px;
      font-size: 1rem;
    }
    display: flex;
    flex-direction: column;
    margin: 15px auto 0 auto;
    padding: 10px 10px;
    width: 90%;
    // height: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 5px 2px #FD2D0F;
    &-title {
      display: flex;
      flex-wrap: wrap;
      font-weight: 600;
      width: 100%;
      a {
        width: 75%;
      }
      span {
        width: 25%;
        text-align: end;
      }
      hr {
        border: 0;
        clear: both;
        display: block;
        width: 100%;
        background-color: black;
        height: 1px;
        margin: 4px;
      }
    }
    &-body {
      margin: 0 0 10px;
      $nLine: 5;
      &-text {
        padding: 5px 0;
        margin: 0 0 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-height: 16px; /* fallback */
        -webkit-line-clamp: $nLine; /* number of lines to show */
        -webkit-box-orient: vertical;
      }
      &-photo {
        display: flex;
        width: 100%;
        max-height: 200px;
        width: 100%;
        max-height: 200px;
        img {
          width: 99%;
          max-height: 200px;
          object-fit: cover;
        }
      }
    }
    &-author {
      font-size: 0.9rem;
      margin-bottom: 10px;
      a {
        font-weight: 600;
      }
    }
    &-status {
      display: flex;
      align-items: center;
      flex-direction: row;
      width: 100%;
      height: 30px;
      font-size: 1.2rem;
      span {
        margin: 0 10px;
      }
    }
  }
    }
  }
}

</style>

