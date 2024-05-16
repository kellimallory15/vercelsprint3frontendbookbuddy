<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-center">
      <div class="col col-12 col-sm-10 col-md-10 col-lg-6">
        <div class="alert alert-danger shadow" role="alert" v-if="showMsg === 'error'">
          Please verify Review
        </div>
        <div class="card">
          <div class="card-header">{{pageTitle}}</div>
          <div class="card-body">
            <form ref="form">
              <div class="container-fluid">
                <div class="form-group row justify-content-around py-2">
                  <label class="col-4">Book</label>
                  <div class="col col-8">
                    <select v-model="review.book" class="form-select">
                      <option v-for="book in books" :value="book.pk" :key="book.pk">
                        {{ book.title }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group row justify-content-around py-2">
                  <label class="col-4">Reader</label>
                  <div class="col col-8">
                    <input v-model="user.username" type="text" class="form-control-sm form-control" readonly>
                  </div>
                </div>
                <div class="form-group row justify-content-around py-2">
                  <label class="col-4">Title</label>
                  <div class="col col-8">
                    <input v-model="review.title" type="text" class="form-control-sm form-control">
                  </div>
                </div>
                <div class="form-group row justify-content-around py-2">
                  <label class="col-4">Review</label>
                  <div class="col col-8">
                    <input v-model="review.text" type="text" class="form-control-sm form-control">
                  </div>
                </div>
                <div class="form-group row justify-content-around py-2">
                  <label class="col-4">Rating</label>
                  <div class="col col-8">
                    <input v-model="review.rating" type="number" class="form-control-sm form-control">
                  </div>
                </div>
                <div class="row justify-content-around">
                  <div v-if="!isUpdate" type="button" class="btn btn-primary col-4" @click="createReview">Save</div>
                  <div v-if="isUpdate" type="button" class="btn btn-primary col-4" @click="updateReview">Update</div>
                  <div type="button" class="btn btn-secondary col-4" @click="cancelOperation">Cancel</div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router';
import { APIService } from '../http/APIService';

const apiService = new APIService();

export default {
  name: 'ReviewCreate',
  data() {
    return {
      review: {
        book: null,
        user: null,
        title: '',
        text: '',
        rating: 1
      },
      books: [],
      user: {},
      pageTitle: "Write New Review",
      isUpdate: false,
      showMsg: '',
      authenticated: false
    };
  },
  beforeCreate() {
    if (localStorage.getItem("isAuthenticated") && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
    if (this.authenticated === false) {
      router.push("/auth");
    }
  },
  methods: {
    createReview() {
      apiService.addNewReview(this.review).then(response => {
        if (response.status === 201) {
          this.review = response.data;
          this.showMsg = "";
          router.push('/review-list/new');
        } else {
          this.showMsg = "error";
        }
      });
    },
    getBooks() {
      apiService.getBookList().then(response => {
        this.books = response.data.data;
      }).catch(error => {
        if (error.response.status === 401) {
          localStorage.clear();
          router.push("/auth");
        }
      });
    },
    getUser() {
      apiService.getUser().then(response => {
        this.user = response.data;
        this.review.user = response.data.id;
      }).catch(error => {
        if (error.response.status === 401) {
          localStorage.clear();
          router.push("/auth");
        }
      });
    },
    cancelOperation() {
      router.push("/review-list");
    },
    updateReview() {
      apiService.updateReview(this.review).then(response => {
        if (response.status === 200) {
          this.review = response.data;
          router.push('/review-list/update');
        } else {
          this.showMsg = "error";
        }
      }).catch(error => {
        if (error.response.status === 401) {
          router.push("/auth");
        } else if (error.response.status === 400) {
          this.showMsg = "error";
        }
      });
    }
  },
  mounted() {
    this.getBooks();
    this.getUser();
    if (this.$route.params.pk) {
      this.pageTitle = "Edit Review";
      this.isUpdate = true;
      apiService.getReview(this.$route.params.pk).then(response => {
        this.review = response.data;
      }).catch(error => {
        if (error.response.status === 401) {
          router.push("/auth");
        }
      });
    }
  }
};
</script>

<style scoped>
.aform {
  margin-left: auto;
  width: 60%;
}
</style>
