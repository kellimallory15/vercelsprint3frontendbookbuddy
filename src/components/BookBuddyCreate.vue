<template>
    <div class="container-fluid">
      <div class="row align-items-center justify-content-center">
        <div class=" col align-items-center">
          <div class="row align-items-center justify-content-center">
            <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
              <div class="alert alert-danger shadow" role="alert"
              v-if="showMsg === 'error'">
                Please verify BookBuddy selections!
              </div>
            </div>
          </div>
          <div class="row align-items-center justify-content-center">
            <div class="col col-12 col-sm-10 col-md-10 col-lg-6 align-items-center">
              <div class="card">
                <div class="card-header">{{pageTitle}}</div>
                <div class="card-body">
                  <form ref="form">
                    <div class="container-fluid">
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Book</label>
                        <select v-model="bookbuddy.book" class="form-select">
                            <option class ="form-select form-select-sm " v-for="book in books" :value="book.pk" :key="book.pk"> {{ book.title }} </option>
                        </select>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Favorite Status</label>
                        <div class="col col-8">
                          <select v-model="bookbuddy.fav_status" type="boolean" class="form-control-sm form-control">
                            <option :value=true>Yes</option>
                            <option :value=false>No</option>
                          </select>
                        </div>
                      </div>          
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Read Status</label>
                        <div class="col col-8">
                          <select v-model="bookbuddy.read_status" type="boolean" class="form-control-sm form-control">
                            <option :value=true>Yes</option>
                            <option :value=false>No</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Read Later Status</label>
                        <div class="col col-8">
                          <select v-model="bookbuddy.read_later_status" type="boolean" class="form-control-sm form-control">
                            <option :value=true>Yes</option>
                            <option :value=false>No</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Currently Reading</label>
                        <div class="col col-8">
                          <select v-model="bookbuddy.currently_reading" type="boolean" class="form-control-sm form-control">
                            <option :value=true>Yes</option>
                            <option :value=false>No</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Current Page</label>
                        <div class="col col-8">
                          <input v-model="bookbuddy.current_page" type="number" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Last Read</label>
                        <div class="col col-8">
                          <input v-model="bookbuddy.last_read" type="date" class="form-control-sm form-control">
                        </div>
                      </div>  

                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">User</label>
                        <div class="col col-8">
                          <input v-model="bookbuddy.user" type="text" class="form-control-sm form-control">
                        </div>
                      </div> 

                      <div class="row justify-content-around">
                        <div v-if="!isUpdate" type="button" class="btn btn-primary col-4" @click="createBookBuddy">Save</div>
                        <div v-if="isUpdate" type="button" class="btn btn-primary col-4" @click="updateBookBuddy">Update</div>
                        <div type="button" class="btn btn-secondary col-4" @click="cancelOperation">Cancel</div>   
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
    import router from '../router';
    import {APIService} from '../http/APIService';
    const apiService = new APIService();

    export default {
      name: 'BookBuddyCreate',
      components: {},
          //prevent user from accessing this page if not authorized
    beforeCreate() {
    if (localStorage.getItem("isAuthenticated") &&
        JSON.parse(localStorage.getItem("isAuthenticated")) === true ){
          this.authenticated = true
        }
        else {
          this.authenticated = false
        }
        if(this.authenticated===false){
            router.push("/auth");
          }
   },
      data() {
        return {
          showError: false,
          bookbuddy: {},
          books: [],
          pageTitle: "Create a BookBuddy",
          isUpdate: false,
          showMsg: '',
          authenticated: false
        };
      },
      methods: {
        fetchBooks() {
          apiService.getBookList().then(response => {
            this.books = response.data.data;
            console.log('Books loaded:', this.books);
          }).catch(error => {
            console.error("Failed to fetch books:", error);
            this.showMsg = "Failed to load books";
          });
        },
        createBookBuddy() {
            apiService.addNewBookBuddy(this.bookbuddy).then(response => {
            if (response.status === 201) {
              this.bookbuddy = response.data;
               this.showMsg = "";
              //await router.push('/bookbuddy-list/new');
              (async () => await router.push('/bookbuddy-list/new'))();
            }else{
                this.showMsg = "error";
            }
          }).catch(error => {
            if (error.response.status === 401) { // "not authorized"
              router.push("/auth");
            }else if (error.response.status === 400) { //"bad request"
              this.showMsg = "requestError";
            }else{
              this.showMsg = "error";
            }
          });
        },
        cancelOperation(){
           router.push("/bookbuddy-list");
        },
        updateBookBuddy() {
          apiService.updateBookBuddy(this.bookbuddy).then(response => {
            if (response.status === 200) {
              this.bookbuddy = response.data;
              router.push('/bookbuddy-list/update');
            }else{
                this.showMsg = "error";
            }
          }).catch(error => {
            if (error.response.status === 401) {
              router.push("/auth");
            }else if (error.response.status === 400) {
              this.showMsg = "error";
            }
          });
        }
      },
      mounted() {
        this.fetchBooks();
        if (this.$route.params.pk) {
          this.pageTitle = "Edit current BookBuddy";
          this.isUpdate = true;
          apiService.getBookBuddy(this.$route.params.pk).then(response => {
            this.bookbuddy = response.data;
          }).catch(error => {
            if (error.response.status === 401) { // "not authorized"
              router.push("/auth");
            }else{
              this.showMsg = "error";
              router.push("/auth");
            }
          });
        }
      },
    }
</script>
