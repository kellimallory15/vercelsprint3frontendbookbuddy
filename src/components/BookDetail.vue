<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 align-items-center justify-content-center">
        <blockquote>
          Welcome {{ validUserName }}!
          <footer>
            <small>
              <em>-Your Book Buddy & You!</em>
            </small>
          </footer>
        </blockquote>
      </div>
    </div>
  <div class="card align-items-center justify-content-center">
    <div class="card-body align-items-center justify-content-center">
      <p><b>Title: </b> {{ book.title }}</p>
      <p><b>Author: </b>{{ book.author }}</p>
      <img :src = "this.photo" :alt="book.author">
      <p><b>Genre: </b> {{ book.genre }}</p>
      <p style = "max-width: 50ch; text-align: center; word-break: normal" ><b>Summary: </b> {{ book.summary }}</p>
      <p><b>Publisher: </b> {{ book.publisher }}</p>
      <p><b>Publisher Date: </b> {{ book.published_date }}</p>
      <p><b>Page Total: </b> {{ book.page_total }} pages</p>
      <p><b>Series Number: </b> {{ book.series_num }}</p>
    </div>
  </div>
  </div>
</template>
<script>
import router from '../router';
import {APIService} from '../http/APIService';
const apiService = new APIService();

export default {
  name: 'BookDetail',
  components:{},

  data() {
    return {
      validUserName: "Guest",
      showMsg: '',
      photo: '',
      book: {
      }
    };
  },
  mounted() {
    this.authenticated = localStorage.getItem("isAuthenticated")
    this.showMessages()
    this.getBookDetails()
  },
  methods: {
    getBookDetails(){
      apiService.getBook(this.$route.params.pk).then(response => {
        this.book = response.data;
        if (localStorage.getItem("isAuthenticated")
            && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
          this.validUserName = JSON.parse(localStorage.getItem("log_user"));
        }
      }).catch(error =>{
        if (error.response.status === 401) {
          localStorage.clear();
          router.push("/auth");
        }
      });
      apiService.getAuthor(this.$route.params.pk).then(response => {
        this.book.author = response.data.name;
        console.log(this.book.author);
        this.photo = response.data.photo;
        if (localStorage.getItem("isAuthenticated")
            && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
          this.validUserName = JSON.parse(localStorage.getItem("log_user"));
        }
      }).catch(error =>{
        if (error.response.status === 401) {
          localStorage.clear();
          router.push("/auth");
        }
      })
    },
    showMessages(){
                if (this.$route.params.msg) {
                    this.showMsg = this.$route.params.msg;
                }
            },
  }
}

</script>
<style>
button {
  padding: 1rem;
  border: 0;
  cursor: pointer;
}
</style>