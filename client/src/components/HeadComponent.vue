<script>
export default {
  name: "HeadComponent",
};
</script>

<template>
  <header>
      <div id="head"></div>
      <div id="menu">
        <nav class="large-screen">
          <ul>
            <li>
              <a href="/moncompte">Mon profil</a>
            </li>
            <li>
              <a href="#">Ecrire un post</a>
            </li>
            <li>
              <a href="/main">Accueil</a>
            </li>
          </ul>
        </nav>
        <nav class="tight-screen">
          <ul>
            <li>
              <a href="/moncompte"><i class="fas fa-user-circle"></i></a>
            </li>
            <li>
              <a href="#"><i class="fas fa-paper-plane"></i></a>
            </li>
            <li>
              <a href="/main"><i class="fas fa-home"></i></a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
</template>