<script>
export default {
  name: "UserInfo",
};
</script>

<template>
  <div id="account">
    <div id="header">
      <div id="header-photo">
        <img src="../assets/custom_photo_user.png" alt="" />
      </div>
      <div id="header-info">
        <span id="header-info-pseudo">Dimoto</span>
        <span id="header-info-dateInsc">Date d'inscription: 25/05/2021</span>
        <div id="header-info-manipulation">
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