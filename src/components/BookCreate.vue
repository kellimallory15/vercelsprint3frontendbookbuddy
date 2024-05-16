import { APIService } from '../http/APIService';

const apiService = new APIService();

<template>
    <div class="container-fluid">
      <div class="row align-items-center justify-content-center">
        <div class=" col align-items-center">
          <div class="row align-items-center justify-content-center">
            <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
              <div class="alert alert-danger shadow" role="alert"
              v-if="showMsg === 'error'">
                Please verify Book Information
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
                        <label class="col-4">Title</label>
                        <div class="col col-8">
                          <input v-model="book.title" type="text" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Author</label>
                        <div class="col col-8">
                          <select v-model="book.author" class="form-select">
                            <option class ="form-select form-select-sm " v-for="author in authors" :value="author.auth_id" :key="author.auth_id"> {{ author.name }} </option>
                          </select>
                        </div>
                      </div>           
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Genre</label>
                        <div class="col col-8">
                          <input v-model="book.genre" type="text" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Summary</label>
                        <div class="col col-8">
                          <input v-model="book.summary" type="text" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Publisher</label>
                        <div class="col col-8">
                          <input v-model="book.publisher" type="text" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Published Date</label>
                        <div class="col col-8">
                          <input v-model="book.published_date" type="date" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Page Total</label>
                        <div class="col col-8">
                          <input v-model="book.page_total" type="number" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Series Number</label>
                        <div class="col col-8">
                          <input v-model="book.series_num" type="number" class="form-control-sm form-control">
                        </div>
                      </div>

                      <div class="row justify-content-around">
                        <div v-if="!isUpdate" type="button" class="btn btn-primary col-4" @click="createBook">Save</div>
                        <div v-if="isUpdate" type="button" class="btn btn-primary col-4" @click="updateBook">Update</div>
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
    import AuthorList from './AuthorList.vue';
    const apiService = new APIService();
  
    export default {
      name: 'BookCreate',
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
          /* showError: false,
          book: {},
          authors: [],
          pageTitle: "Add New Book",
          isUpdate: false,
          showMsg: '',
          authenticated: false */
          book: {
            title: '',
            author: null,  // Make sure this is appropriately initialized if needed
            genre: '',
            summary: '',
            publisher: '',
            published_date: '',
            page_total: null,
            series_num: null
          },
          authors: [],
          pageTitle: "Add New Book",
          isUpdate: false,
          showMsg: '',
          authenticated: false
          };
      },
      methods: {
        fetchAuthors() {
          apiService.getAuthorList().then(response => {
            this.authors = response.data.data;  
            console.log('Authors loaded:', this.authors);
          }).catch(error => {
            console.error("Failed to fetch authors:", error);
            this.showMsg = "Failed to load authors";
          });
        },
        createBook() {
          apiService.addNewBook(this.book).then(response => {
            if (response.status === 201) {
              this.book = response.data;
               this.showMsg = "";
              router.push('/book-list/new');
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
           router.push("/book-list");
        },
        updateBook() {
          apiService.updateBook(this.book).then(response => {
            if (response.status === 200) {
              this.book = response.data;
              router.push('/book-list/update');
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
        this.fetchAuthors();  // Fetch authors when component mounts
        if (this.$route.params.pk) {
          this.pageTitle = "Edit Book";
          this.isUpdate = true;
          apiService.getBook(this.$route.params.pk).then(response => {
            this.book = response.data;
          }).catch(error => {
            if (error.response.status === 401) { // "not authorized"
              router.push("/auth");
            }else{
              this.showMsg = "error";
              router.push("/auth");
            }
          });
        }
      }
    };
</script>
