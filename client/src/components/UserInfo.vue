<script>
export default {
  name: "UserInfo",
  props: ["pseudo", "dateInscriotion", "imgProfil", "monCompte"],
};
</script>

<template>
  <div id="account">
    <div id="header">
      <div id="header-photo">
        <img :src="imgProfil" alt="" />
      </div>
      <div id="header-info">
        <span id="header-info-pseudo">{{ pseudo }}</span>
        <span id="header-info-dateInsc"
          >Date d'inscription: {{ dateInscriotion }}</span
        >
        <div v-if="monCompte" id="header-info-manipulation">
          <button class="btn-ico">
            <i class="fas fa-pencil-alt orange"></i>
          </button>
          <button class="btn-ico">
            <i class="fas fa-trash-alt red"></i>
          </button>
        </div>
        <div id="header-info-statistic">
          <button class="btn-classic" value="0">Les posts publiés</button>
          <button class="btn-classic" value="0">
            Les commentaires publiés
          </button>
        </div>
      </div>
    </div>
  </div>
</template>