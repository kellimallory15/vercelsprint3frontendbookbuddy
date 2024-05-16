<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col col-12 align-items-center justify-content-center">
                <blockquote>
                    &#8220;Welcome {{validUserName}}!&#8221;
                    <footer>
                    <small>
                        <em>&mdash;BookBuddy & Your favorite books!</em>
                    </small>
                    </footer>
                </blockquote>
            </div>
        </div>
    </div>
    <div class="container-fluid">
        <div class="row align-items-center justify-content-center">
            <div class="col col-12 col-sm-10 col-md-10">
                <div class="card-group">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">Books</h5>
                    <a @click="viewBooks" class="btn btn-primary">Show Books</a>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">Authors</h5>
                    <a @click="viewAuthors" class="btn btn-primary">Show Authors</a>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import router from '../router'
export default {
    name: 'Home',
    beforeCreate() {
    if (localStorage.getItem("isAuthenticated") &&
        JSON.parse(localStorage.getItem("isAuthenticated")) === true ){
          this.authenticated = true
        }
        else {
          this.authenticated = false
        }
   },
    data: () => ({
      validUserName: "Guest",
      authenticated: false
    }),
    mounted() {
      this.getUser();
    },
    methods: {
      viewBookBuddys() {
        router.push('/bookbuddy-list');
      },
      viewBooks() {
        router.push('/book-list');
      },
      viewAuthors() {
        router.push('/author-list');
      },
      getUser() {
        if (localStorage.getItem("isAuthenticated")
          && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
          this.validUserName = JSON.parse(localStorage.getItem("log_user"));
          this.authenticated = true;
        }
      }
    }
  }
</script>
