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

</style>

