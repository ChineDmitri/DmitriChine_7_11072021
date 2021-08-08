<script>
export default {
  name: "PostNews",
};
</script>

<template>
  <div class="post">
    <div class="post-title">
      <a href="#">Veni, vidi, vici... Veni, vidi, vici.ici... Veni</a>
      <span>
        <button class="btn-ico modif">
          <i class="fas fa-pencil-alt orange"></i>
        </button>
        <button class="btn-ico">
          <i class="fas fa-trash-alt red"></i>
        </button>
      </span>
      <hr />
    </div>

    <div class="post-body">
      <div class="post-body-text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio eos
        voluptatibus magnam. Quaerat, possimus voluptates, unde sit perferendis
        accusamus officiis mollitia, optio iure omnis rerum vero deserunt cum
        repellendus! Saepe. Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Veniam maxime doloremque, cumque cupiditate corrupti rem, nobis
        aspernatur voluptatibus ducimus ipsa similique corporis velit quos illo
        id consequuntur fuga repellendus! Minus!
      </div>
      <div class="post-body-photo">
        <a href="#" class="post-body-photo-one">
          <img src="../assets/img.jpg" alt="Exo title" />
        </a>
        <a href="#" class="post-body-photo-one">
          <img src="../assets/img.jpg" alt="Exo title" />
        </a>
        <!-- <a href="#" class="post-body-photo-one">
                                <img src="./images/IMG_1632.JPG" alt="Exo title">
                            </a> -->
      </div>
    </div>
    <span class="post-author">
      Ecrit par: <a href="#">Dimoto</a> à 25/05/2021 15h05
      <br />
      (dernier modification: 26/05/2021 21h50)
    </span>
    <span class="post-status">
      <button class="btn-ico"><i class="far fa-thumbs-up green"></i></button>
      <span class="counterLike">10</span>
      <button class="btn-ico"><i class="far fa-thumbs-down"></i></button>
      <button class="btn-ico"><i class="far fa-comment">25</i></button>
    </span>
  </div>
</template>