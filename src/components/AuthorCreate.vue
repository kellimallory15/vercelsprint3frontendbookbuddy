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
                Please verify Author Information
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
                        <label class="col-4">Name</label>
                        <div class="col col-8">
                          <input v-model="author.name" type="text" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Photo</label>
                        <div class="col col-8">
                          <input type="file" class="form-control-sm form-control" @change="handleImageUpload">
                        </div>
                      </div>          
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Birthday</label>
                        <div class="col col-8">
                          <input v-model="author.birth_date" type="date" class="form-control-sm form-control">
                        </div>
                      </div>
                      <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Death</label>
                        <div class="col col-8">
                          <input v-model="author.death_date" type="date" class="form-control-sm form-control">
                        </div>
                      </div>
                      <!-- <div class="form-group row justify-content-around py-2">
                        <label class="col-4">Author ID</label>
                        <div class="col col-8">
                          <input v-model="author.auth_id" type="text" class="form-control-sm form-control">
                        </div>
                      </div> -->

                      <div class="row justify-content-around">
                        <div v-if="!isUpdate" type="button" class="btn btn-primary col-4" @click="createAuthor">Save</div>
                        <div v-if="isUpdate" type="button" class="btn btn-primary col-4" @click="updateAuthor">Update</div>
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
    import axios from 'axios';
    import router from '../router';
    import {APIService} from '../http/APIService';
    const apiService = new APIService();
  
    export default {
      name: 'AuthorCreate',
      authorId: null,
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
          author: {},
          pageTitle: "Add New Author",
          isUpdate: false,
          showMsg: '',
          authenticated: false
        };
      },
      methods: {
        createAuthor() {
          apiService.addNewAuthor(this.author).then(response => {
            if (response.status === 201) {
              this.author = response.data;
               this.showMsg = "";
              router.push('/author-list/new');
            }else{
                this.showMsg = "error";
            }
          })/* .catch(error => {
            if (error.response.status === 401) { // "not authorized"
              router.push("/auth");
            }else if (error.response.status === 400) { //"bad request"
              this.showMsg = "requestError";
            }else{
              this.showMsg = "error";
            }
          }); */
        },
        cancelOperation(){
           router.push("/author-list");
        },
        fetchAuthor() {
            if (this.authorId) {
              apiService.getAuthor(this.authorId)
                .then(response => {
                  this.author = response.data; // Make sure data is assigned correctly
                  console.log("Author data loaded:", this.author);
                })
                .catch(error => {
                  console.error('Error fetching author data:', error);
                  this.showMsg = "Failed to load author";
                });
            } else {
              console.error('Author ID is undefined');
              this.showMsg = 'Author ID is undefined'; // Provide feedback to the user
            }
          },
          updateAuthor() {
            if (this.authorId && this.author) {
              const API_URL = 'https://bookbuddy.pythonanywhere.com';
              let jwtToken = localStorage.getItem('access');
              const headers = { Authorization: `JWT ${jwtToken}` };

              axios.put(`${API_URL}/api/authors/${this.authorId}`, this.author, { headers: headers })
                .then(response => {
                  console.log('Update successful:', response.data);
                  this.$router.push('/author-list'); // Redirect to the author list page
                })
                .catch(error => {
                  console.error('Update failed:', error);
                  // Optionally, set an error message to display to the user
                  this.showMsg = 'Update failed. Please try again.';
                });
            } else {
              console.error('Author ID or author data is undefined');
              // Optionally, set an error message to display to the user
              this.showMsg = 'Author ID or data is undefined.';
            }
          },
        handleImageUpload(event) {
          const file = event.target.files[0];
          this.formData = new FormData();
          this.formData.append('photo', file);
        },
      },
      mounted() {
        console.log("Route parameter pk:", this.$route.params.pk);
        if (this.$route.params.pk) {
          this.authorId = this.$route.params.pk;
          this.pageTitle = "Edit Author";
          this.isUpdate = true;
          apiService.getAuthor(this.$route.params.pk).then(response => {
            this.author = response.data;
            console.log("Author data loaded:", this.author);
          }).catch(error => {
            console.error("Error fetching author data:", error);
            this.showMsg = "Failed to load author";
          });
        }
      },
    }
</script>
