<script>
export default {
  name: "CommentNews"
};
</script>


<template>
  <div class="comments">
    <p>
      COUC OYC Lorem ipsum dolor sit, amet consectetur adipisicing elit.
      Consequatur recusandae alias dicta molestias, reprehenderit est odit
      asperiores quas sequi itaque blanditiis? Libero ab quod et repellendus
      est, aliquid cupiditate ex!
    </p>

    <span class="post-author">
      Ecrit par:
      <!-- v-if="memberId !== userId" -->
      <router-link :to="{ name: 'Compte', params: { id: 1 } }">
        <!-- {{ pseudo }} -->
        Ddidid
      </router-link>

      <!-- <router-link v-else to="/moncompte"> -->
      <!-- {{ pseudo }}  DiDi -->
      <!-- </router-link> -->

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

      <!-- <span v-if="memberId === userId"> -->
      <button class="btn-ico modif">
        <i class="fas fa-pencil-alt orange"></i>
      </button>

      <button @click="deletePost(idx)" class="btn-ico">
        <i class="fas fa-trash-alt red"></i>
      </button>
    </span>
  </div>
</template>

