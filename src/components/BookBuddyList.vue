<template>
    <div class="container-fluid">
        <div class="row align-items-center justify-content-center">
            <div class="col col-12 align-items-center justify-content-center">
                <blockquote>
                    Welcome {{ validUserName }}!
                    <footer>
                    </footer>
                </blockquote>
            </div>
            <div class="col-12 col-md-10 col-lg-10 col-12 align-items-center justify-content-center">
                <div class="alert alert-success"
                     v-if="showMsg === 'new'"
                     :value="true">
                    New BookBuddy created.
                </div>
                <div class="alert alert-success"
                     v-if="showMsg === 'update'"
                     :value="true">
                    BookBuddy updated.
                </div>
                <div class="alert alert-success"
                     v-if="showMsg === 'deleted'"
                     :value="true">
                    BookBuddy has been deleted.
                </div>
            </div>
        </div>
        <!--Mobile device view-->
        <div class="d-md-none" id="collapsable-card" style="width: 80%">
            <button type="button" class="btn btn-primary" @click="addNewBookBuddy">
                <font-awesome-icon icon="plus"/>
            </button>
            <div class="card" v-for="bookbuddy in bookbuddys" v-bind:key="bookbuddy">
                <div class="card-header" :id="'heading' + bookbuddy.pk">
                    <button class="btn btn-link collapsed" data-bs-toggle="collapse"
                            :data-bs-target="'#collapse' + bookbuddy.pk" aria-expanded="true"
                            :aria-controls="'collapse' + bookbuddy.pk">
                        <h6 style="color: #0275d8; float: left">{{ bookbuddy.book }}</h6> <!-- Need to import book (potentially user model) at bottom for book title-->
                    </button>
                </div>

                <div :id="'collapse' + bookbuddy.pk" class="collapse" :aria-labelledby="'heading' + bookbuddy.pk"
                     data-bs-parent="#collapsable-card">
                    <div class="card-body">
                        <p><b>Book:</b> {{ books[bookbuddy.book - 1].title }}</p>
                        <p><b>Favorited:</b> {{ bookbuddy.fav_status }}</p>
                        <p><b>Read:</b>{{ bookbuddy.read_status }}</p>
                        <p><b>Read Later:</b> {{ bookbuddy.read_later_status }}</p>
                        <p><b>Currently Reading:</b> {{ bookbuddy.currently_reading }}</p>
                        <p><b>Current Page:</b> {{ bookbuddy.current_page  }}</p>
                        <p><b>Last Read:</b> {{ bookbuddy.last_read }}</p>
                        <div v-if="(this.userID === bookbuddy.user || this.is_superuser === 'true')" class="btn-group">
                            <button @click="updateBookBuddy(bookbuddy)"
                                    style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="pencil"/>
                            </button>
                            <button @click="deleteBookBuddy(bookbuddy)"
                                    style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="trash"/>
                            </button>
                        </div>
                        <div v-else class="btn-group">
                            <button style="background-color: transparent; padding: 0;" disabled>
                                <font-awesome-icon icon="pencil"/>
                            </button>
                            <button style="background-color: transparent; padding: 0;" disabled>
                                <font-awesome-icon icon="trash"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--non-Mobile device view-->
        <div class="col col-12 col-md-10 d-none d-xl-block d-lg-block d-md-block">
            <table class="table table-hover" style="overflow-y: auto"
                   :headers="headers">
                <thead>
                <tr>
                    <th scope="col">Book</th>
                    <th scope="col">Favorited</th>
                    <th scope="col">Read</th>
                    <th scope="col">Read Later</th>
                    <th scope="col">Currently Reading</th>
                    <th scope="col">Current Page</th>
                    <th scope="col">Last Read</th>
                    <th scope="col">Update</th>
                    <th scope="col">Delete</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="bookbuddy in bookbuddys" v-bind:key="bookbuddy"> 
                    <!--<th scope="row">{{ bookbuddy.user }}</th>-->
                    <td> {{ books[bookbuddy.book - 1].title }} </td>
                    <td>{{ bookbuddy.fav_status }}</td>
                    <td>{{ bookbuddy.read_status }}</td>
                    <td>{{ bookbuddy.read_later_status }}</td>
                    <td>{{ bookbuddy.currently_reading }}</td>
                    <td>{{ bookbuddy.current_page }}</td>
                    <td>{{ bookbuddy.last_read }}</td>
                    <td v-if="(this.userID === bookbuddy.user || this.is_superuser === 'true')" @click="updateBookBuddy(bookbuddy)">
                        <button style="background-color: transparent; padding: 0;">
                            <font-awesome-icon icon="pencil"/>
                        </button>
                    </td>
                    <td v-else>
                        <button style="background-color: transparent; padding: 0;" disabled>
                            <font-awesome-icon icon="pencil"/>
                        </button>
                    </td>
                    <td v-if="(this.userID === bookbuddy.user || this.is_superuser === 'true')"
                        @click="deleteBookBuddy(bookbuddy)">
                        <button style="background-color: transparent; padding: 5;">
                            <font-awesome-icon icon="trash"/>
                        </button>
                    </td>
                    <td v-else>
                        <button style="background-color: transparent; padding: 5;" disabled>
                            <font-awesome-icon icon="trash"/>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
            
            <div v-if="this.authenticated === 'true'">
                <button type="button" class="btn btn-primary" @click="addNewBookBuddy">Create BookBuddy</button>
            </div>
        </div>
    </div>
</template>
<script>
    import router from '../router';
    import {APIService} from '../http/APIService';
    const apiService = new APIService();

    export default {
        name: "BookBuddyList",
        data: () => ({
            bookbuddys: [],
            validUserName: "Guest",
            bookbuddySize: 0,
            showMsg: '',
            isMobile: false,
            authenticated: false,
            is_superuser: false,
            books: [],
            headers: [
                {text: 'Book', sortable: false, align: 'left',},
                {text: 'Favorited', sortable: false, align: 'left',},
                {text: 'Read', sortable: false, align: 'left',},
                {text: 'Read Later', sortable: false, align: 'left',},
                {text: 'Currently Reading', sortable: false, align: 'left',},
                {text: 'Current Page', sortable: false, align: 'left',},
                {text: 'Last Read', sortable: false, align: 'left',},
                {text: 'Update', sortable: false, align: 'left',},
                {text: 'Delete', sortable: false, align: 'left',}
            ],
        }),

        mounted() {
            this.authenticated = localStorage.getItem("isAuthenticated")
            this.is_superuser = localStorage.getItem("is_superuser");
            this.validUserName = localStorage.getItem("username");
            this.userID = Number(localStorage.getItem("userID"));
            this.getBookBuddy();
            this.getBookList();
            this.showMessages();
        },
        methods: {
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
            getBookBuddy() {
                apiService.getBookBuddyList().then(response => {
                    this.bookbuddys = JSON.parse(JSON.stringify(response.data.data));
                    if (localStorage.getItem("isAuthenticated")
                        && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                        this.validUserName = localStorage.getItem("username");
                    }
                }).catch(error => {
                    if (error.response.status === 401) {
                        localStorage.clear();
                        router.push("/auth");
                    }
                });
            },
            getBookList() {
                apiService.getBookList().then(response => {
                    this.books = JSON.parse(JSON.stringify(response.data.data));
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

            },
            addNewBookBuddy() {
                if (localStorage.getItem("isAuthenticated")
                    && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                    router.push('/bookbuddy-create');
                } else {
                    router.push("/auth");
                }
            },
            updateBookBuddy(bookbuddy) {
                router.push('/bookbuddy-create/' + bookbuddy.pk);
            },
            deleteBookBuddy(bookbuddy) {
                if (confirm("Do you really want to delete?")) {
                    apiService.deleteBookBuddy(bookbuddy.pk).then(response => {
                        if (response.status === 204) {
                            router.push('/bookbuddy-list/deleted/')
                            this.getBookBuddy()
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

