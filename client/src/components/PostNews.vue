<script>
export default {
  name: "PostNews",

  data() {
    return {};
  },

  props: [
    "key",
    "postId",
    "memberId",
    "title",
    "discription",
    "likes",
    "dislikes",
    "comments",
    "pseudo",
    "datePublication",
    "dateModification",
    "urlImg",
    "userId",
    "status",
    "idx",
    "deletePost",
    "modifyPost",
    "votePost"
  ]
};
</script>


<template>
  <div class="post">
    <!-- START BAR avec title et button manip -->
    <div class="post-title">
      <router-link :to="{ name: 'OnePostNews', params: { id: postId } }">
        {{ title }}
      </router-link>

      <span v-if="memberId === userId">
        <button @click="modifyPost(idx)" class="btn-ico modif">
          <i class="fas fa-pencil-alt orange"></i>
        </button>

        <button @click="deletePost(idx)" class="btn-ico">
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

      <div class="post-body-photo">
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

      à {{ datePublication }}

      <br />

      {{
        dateModification !== null
          ? `(dernier modification: ${dateModification})`
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