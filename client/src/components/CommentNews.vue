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
      type: Number,
      required: true
    },
    dislikes: {
      type: Number,
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
      type: String,
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
    modifyComment: {
      type: Function,
      required: true
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

      à {{ datePublication }}

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

      <span v-if="memberId === userId">
        <button @click="modifyComment(idx)" class="btn-ico modif">
          <i class="fas fa-pencil-alt orange"></i>
        </button>

        <button @click="deleteComment(idx)" class="btn-ico">
          <i class="fas fa-trash-alt red"></i>
        </button>
      </span>
    </span>
  </div>
</template>

