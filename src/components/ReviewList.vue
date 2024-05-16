<template>
    <div class="container-fluid">
        <div class="row align-items-center justify-content-center">
            <div class="col col-12 align-items-center justify-content-center">
                <blockquote>
                    Welcome {{ validUserName }}!
                    <footer>
                        <small>
                            <em>&mdash;Your Book Buddy & You!</em>
                        </small>
                    </footer>
                </blockquote>
            </div>
            <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
                <div class="alert alert-success" v-if="showMsg === 'new'" :value="true">
                    New Review has been added.
                </div>
                <div class="alert alert-success" v-if="showMsg === 'update'" :value="true">
                    Review has been updated.
                </div>
                <div class="alert alert-success" v-if="showMsg === 'deleted'" :value="true">
                    Selected Review has been deleted.
                </div>
            </div>
        </div>
        <!--Mobile device view-->
        <div class="d-md-none" id="collapsable-card" style="width: 80%">
            <button type="button" class="btn btn-primary" @click="addNewReview">
                <font-awesome-icon icon="plus" />
            </button>
            <div class="card" v-for="review in reviews" v-bind:key="review">
                <div class="card-header" :id="'heading' + review.title">
                    <button class="btn btn-link collapsed" data-bs-toggle="collapse"
                        :data-bs-target="'#collapse' + review.pk" aria-expanded="true"
                        :aria-controls="'collapse' + review.pk">
                        <h6 style="color: #0275d8; float: left">{{ review.title }}</h6>
                    </button>
                </div>

                <div :id="'collapse' + review.pk" class="collapse" :aria-labelledby="'heading' + review.pk"
                    data-bs-parent="#collapsable-card">
                    <div class="card-body">
                        <p><b>Book:</b> {{ review.book }}</p>
                        <p><b>Title:</b> {{ review.user }}</p>
                        <p><b>Title:</b> {{ review.title }}</p>
                        <p><b>Review:</b> {{ review.text }}</p>
                        <p><b>Rating:</b> {{ review.rating }}</p>
                        <!-- Again, if we want update/create dates, they would be input back here in listing -->
                        <div class="btn-group">
                            <button @click="updateReview(review)" style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="pencil" /></button>
                            <button @click="deleteReview(review)" style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="trash" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--non-Mobile device view-->

        <div class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-block">
            <table class="table table-hover" style="overflow-y: auto" :headers="headers">
                <thead>
                    <tr>
                        <th scope="col">Book</th>
                        <th scope="col">Reader</th>
                        <th scope="col">Title</th>
                        <th scope="col">Review</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Update</th>
                        <th scope="col">Delete</th> <!-- Potentially remove? Find the purpose of this-->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="review in reviews" v-bind:key="review">

                        <td>{{ review.book }}</td>
                        <td>{{ review.user }}</td>
                        <td>{{ review.title }}</td>
                        <td>{{ review.text }}</td>
                        <td>{{ review.rating }}</td>
                        <td v-if="this.authenticated === 'true'" @click="updateReview(review)"><button
                                style="background-color: transparent; padding: 0;">
                                <font-awesome-icon icon="pencil" /></button>
                        </td>
                        <td v-if="this.authenticated === 'true'" @click="deleteReview(review)"><button
                                style="background-color: transparent; padding: 0;">
                                <font-awesome-icon icon="trash" /></button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- Only allow add of reviews when authenticated user -->
            <div v-if="this.authenticated === 'true'">
                <button type="button" class="btn btn-primary" @click="addNewReview">Add New Review</button>
            </div>
        </div>
    </div>
</template>
<script>
import router from '../router';
import { APIService } from '../http/APIService';
const apiService = new APIService();

export default {
    name: "ReviewList",
    book: {},
    data: () => ({
        reviews: [],
        validUserName: "Guest",
        reviewSize: 0,
        showMsg: '',
        isMobile: false,
        authenticated: false,
        headers: [
        ],
    }),
    mounted() {
        this.authenticated = localStorage.getItem("isAuthenticated")
        this.getReviews();
        this.showMessages();
    },
    methods: {
        getBookDetails() {
            apiService.getBook(this.$route.params.pk).then(response => {
                this.book = response.data;
                if (localStorage.getItem("isAuthenticated")
                    && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                    this.validUserName = JSON.parse(localStorage.getItem("log_user"));
                }
            }).catch(error => {
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
            }).catch(error => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    router.push("/auth");
                }
            })
        },
        onResize() {
            if (window.innerWidth > 600)
                this.isMobile = false;
            else
                this.isMobile = true;
        },
        showMessages() {
            if (this.$route.params.msg) {
                this.showMsg = this.$route.params.msg;
            }
        },
        getReviews() {
            apiService.getReviewList().then(response => {
                this.reviews = response.data.data;
                this.ReviewSize = this.reviews.length;
                if (localStorage.getItem("isAuthenticated")
                    && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                    this.validUserName = JSON.parse(localStorage.getItem("log_user"));
                }
            }).catch(error => {
                if (error.response.status === 401) {
                    localStorage.clear();
                    router.push("/auth");
                }
            });
        },
        addNewReview() {
            if (localStorage.getItem("isAuthenticated")
                && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                router.push('/review-create');
            } else {
                router.push("/auth");
            }
        },
        updateReview(review) {
            router.push('/review-create/' + review.pk);
        },
        deleteReview(review) {
            if (confirm("Do you really want to delete?")) {
                apiService.deleteReview(review.pk).then(response => {
                    if (response.status === 204) {
                        router.push('/review-list/deleted/')
                        this.getReviews()
                    }
                }).catch(error => {
                    if (error.response.status === 401) {
                        localStorage.clear();
                        router.push("/auth");
                    }
                });
            }
        }
    }
};
</script>
<style>
button {
    padding: 1rem;
    border: 0;
    cursor: pointer;
}
</style>