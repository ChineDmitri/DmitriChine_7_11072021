<script>
import PostNews from "../components/PostNews";
import HeadComponent from "../components/HeadComponent";
import FooterComponent from "../components/FooterComponent";

import { sendRequest } from "../helpers/sendRequest.js";

export default {
  name: "Main",
  components: {
    PostNews,
    HeadComponent,
    FooterComponent
  },
  data() {
    return {
      memberId: undefined,
      counter: 0,
      postNews: [],
      showMore: true
    };
  },
  methods: {
    getAllPost(num) {
      let body = {
        postCounter: num
      };

      // RESPONSE 1
      // [userId]
      // RESPONSE 2 [{
      // "id": Number (id du post),
      // "user_id": Number (id d'utilisateur qui a créé post)
      // "date_publication": Date de publication ex "2021-08-06T11:11:19.000Z",
      // "date_modification": Date de modification ex "2021-08-06T12:04:08.000Z" OR null,
      // "title": title de post (max 200 char) ,
      // "discription": text du post,
      // "likes": combien likes (+Number) ,
      // "dislikes": combien dislikes (-Nummber),
      // "url_img": url pour image,
      // "pseudo": ,
      // "status": 1
      // }]
      sendRequest("http://localhost:3000/api/post", "POST", body)
        .then(res => {
          if (res.error !== 0) {
            this.showMore = res[1].length === 0 ? false : true;

            this.memberId = res[0];

            res[1].forEach(el => this.postNews.push(el));

            // console.log(this.postNews);
          } else {
            this.$router.push("/");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    showMorePost(num) {
      num++;
      this.getAllPost(num);
      // console.log(this.counter);
      return num;
    },

    deletePost(i) {
      console.log("splice YES", i, "ID", this.postNews[i].id)
      // this.postNews.splice(i, 1);
    }
  },
  beforeMount() {
    this.getAllPost(this.counter);
  }
};
</script>


<template>
  <div id="main-layout">
    <HeadComponent></HeadComponent>

    <main>
      <div id="content">
        <!-- main content -->
        <PostNews
          v-for="(postNew, idx) in postNews"
          :key="postNew.id"
          :idx="idx"
          :deletePost="deletePost"
        ></PostNews>

        <button
          v-if="showMore"
          @click="this.counter = showMorePost(this.counter)"
          class="btn-classic"
          value="0"
        >
          Afficher en plus
        </button>
        <!-- <button
          v-else
          @click="this.counter = showMorePost(this.counter)"
          class="btn-classic"
          value="0"
        >
          FINISH
        </button> -->
      </div>
    </main>

    <FooterComponent></FooterComponent>
  </div>
</template>

<style lang="scss">
// main - begin
main {
  min-height: 70vh;
  background-color: #ffffff;
  #content {
    @media screen and (max-width: 426px) {
      width: 100%;
    }
    @media screen and (min-width: 1441px) {
      width: 900px;
    }
    display: flex;
    flex-direction: column;
    margin: 0 auto 0 auto;
    width: 70%;
    background-color: white;
  }
  .post {
    display: flex;
    flex-direction: column;
    margin: 15px auto 0 auto;
    padding: 10px 10px;
    width: 90%;
    // height: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 5px 2px #6b7689;
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
        margin: 0 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-height: 16px; /* fallback */
        max-height: calc(16 * $nLine); /* fallback */
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
        // &-one {
          
        // }
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
      .counterLike {
        // pour compteur
      }
      span {
        margin: 0 10px;
      }
    }
  }
}
// main - end
</style>