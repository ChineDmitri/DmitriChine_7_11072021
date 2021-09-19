<script>
export default {
  name: "FooterComponent"
};
</script>


<template>
  <footer>
    <ul>
      <li><a href="#">Contacter admin</a></li>
      <li><a href="#">Evenement à venir</a></li>
    </ul>
  </footer>
</template>


<style lang="scss">
// footer - start
footer {
  display: flex;
  // position: absolute;
  // bottom: 0;
  background-color: #FD2D0F;
  width: 100%;
  padding: 10px 0;
  margin: 25px 0 0;
  ul {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 0;
    li {
      margin: 0 auto;
      font-weight: 600;
      a {
        &:hover {
          color: #ffffff;
        }
      }
      list-style-type: none;
    }
  }
}
// footer - end
</style>