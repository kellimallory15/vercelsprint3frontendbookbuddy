<template>
  <ul class="nav justify-content-end">
    <li class="nav-item">
         <img src="/images/book_buddy_logo.png" alt="Book Buddy Logo" class="nav-logo">
     </li>
     <div class="FS">Book Buddy</div>
     <li class="nav-item">
         <router-link to="/">Home</router-link>
    </li> |
     <li class="nav-item">
         <router-link :to="{name: 'AuthorList'}">Authors</router-link> |
     </li>
     <li class="nav-item">
         <router-link :to="{name: 'BookList'}">Books</router-link> |
     </li>
    <li class="nav-item" v-if="authenticated">
         <router-link :to="{name: 'BookBuddyList'}">Book Buddies</router-link> |
     </li>
    <li class="nav-item" v-if="authenticated">
         <router-link :to="{name: 'ReviewList'}">Reviews</router-link> |
     </li>
     <li class="nav-item" v-if="!authenticated" @click="register" >
         <router-link :to="{name: 'Register'}">Register</router-link> |
     </li>
     <li class="nav-item" v-if="!authenticated" @click="login" >
         <router-link :to="{name: 'Auth'}">Log in</router-link>
     </li>
     <li class="nav-item  .justify-content-end" v-if="authenticated" @click="logout" >
         <router-link :to="{name: 'Auth'}">Logout</router-link>
     </li>

 </ul>
 <router-view/>
</template>
<script>
 import router from './router';
 import {APIService} from './http/APIService';
 const apiService = new APIService();

 export default {
     name: 'App',
     data: () => ({
         authenticated: false,
         dialog: false,
         menu: [
             { title: 'Home', url:"/"},
             { title: 'AuthorList', url:"/author-list" },
             { title: 'BookList', url:"/book-list" },
             { title: 'BookBuddyList', url:"/bookbuddy-list" },
             { title: 'Register', url:"/register" },
         ]
     }),
     mounted() {
       if (localStorage.getItem("isAuthenticated") &&
           JSON.parse(localStorage.getItem("isAuthenticated")) === true ){
           this.authenticated = true
       }else {
           this.authenticated = false
       }
       if(this.authenticated === true) {
         apiService.getUser().then(response => {
             this.authenticated = true;
         }).catch(error => {
             if (error.response.status === 401) {
               localStorage.clear();
               localStorage.setItem("isAuthenticated", false);
               this.authenticated = false;
             }
         });
       } 
     },
     methods: {
       getUser() {
           if (localStorage.getItem("isAuthenticated") &&
            JSON.parse(localStorage.getItem("isAuthenticated")) === true
           ) {
            this.validUserName = JSON.parse(localStorage.getItem("log_user"));
            }
       },
         logout() {
           //clear local storage items and set authenticated to false
           localStorage.clear();
           localStorage.setItem("isAuthenticated", false);
           this.authenticated = false;
           window.location = "/";
         },
         login() {
             router.push("/auth");
         },
         home() {
           window.location = "/";
           },
       register() {
           router.push("/register");
        },
        
      getUser() {
        if (localStorage.getItem("isAuthenticated") &&
         JSON.parse(localStorage.getItem("isAuthenticated")) === true ) {
            apiService.getUser().then(response => {
                this.user = response.data;
                localStorage.setItem("username", this.user.username);
                localStorage.setItem("userID", this.user.pk);
                localStorage.setItem("is_superuser", this.user.is_superuser);
                localStorage.setItem("first_name", this.user.first_name);
                localStorage.setItem("last_name", this.user.last_name);
                localStorage.setItem("email", this.user.email);
                localStorage.setItem("userInfoDefined", true);
            }).catch(error => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    localStorage.setItem("isAuthenticated", false);
                    localStorage.setItem("username", "Guest");
                    this.authenticated = false;
                    router.push("/auth");
                }
            });
            } else {
              localStorage.setItem("isAuthenticated", false);
              localStorage.setItem("username", "Guest");
            }  
        }
    }
}

</script>
<style lang="scss">
 #app {
     font-family: Avenir, Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     text-align: center;
     color: #FF3131;
 }
 #nav {
     padding: 30px;
     background-color: rgb(255, 255, 255);
     a {
         font-weight: bold;
         color: #FF3131;
         &.router-link-exact-active {
             color: #8fb9db;
         }
     }
 }
 .nav {
    width: 100%;
    padding: 1em;
    background-color: rgb(0, 0, 0);
    margin: 0;
    list-style: none;
    display: flex;
    justify-content: space-between;
     
     li {
         font-weight: bold;
         color: #8fb9db;
     }
     a {
         color: rgb(255, 255, 255);
         padding: .5em;

         &.router-link-exact-active {
             color: #ffffff;
         }
     }
 }
</style>

