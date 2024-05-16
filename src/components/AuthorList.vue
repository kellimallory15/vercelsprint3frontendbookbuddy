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
                <div class="alert alert-success"
                     v-if="showMsg === 'new'"
                     :value="true">
                    New Author has been added.
                </div>
                <div class="alert alert-success"
                     v-if="showMsg === 'update'"
                     :value="true">
                    Author information has been updated.
                </div>
                <div class="alert alert-success"
                     v-if="showMsg === 'deleted'"
                     :value="true">
                    Selected Author has been deleted.
                </div>
            </div>
        </div>
        <!--Mobile device view-->
        <div class="d-md-none" id="collapsable-card" style="width: 80%">
                <button type="button" class="btn btn-primary" @click="addNewAuthor">
                    <font-awesome-icon icon="plus"/>
                </button>
                <div class="card" v-for="author in authors" v-bind:key="author">
                    <div class="card-header" :id="'heading' + author.auth_id">
                        <img :src="author.photo" class="card-img-top" :alt="author.name">
                        <button class="btn btn-link collapsed" data-bs-toggle="collapse" :data-bs-target="'#collapse' + author.pk"
                        aria-expanded="true" :aria-controls="'collapse' + author.pk">
                            <h6 style="color: #0275d8; float: left">{{author.name}}</h6>
                        </button>
                    </div>

                    <div :id="'collapse' + author.pk" class="collapse" :aria-labelledby="'heading' + author.pk" data-bs-parent="#collapsable-card">
                        <div class="card-body">
                            <p><b>Name:</b> {{author.name}}</p>
                            <p><img :src="author.photo" class="card-img-top" :alt="author.name" :width="300" aspect-ratio="16/9"></p>
                            <p><b>Birthday:</b> {{author.birth_date}},</p>
                            <p><b>Death:</b> {{author.death_date}}</p>
                            <p><b>Author ID:</b> {{author.auth_id}}</p>
                            <!-- Again, if we want update/create dates, they would be input back here in listing -->
                            <div class="btn-group">
                            <button @click="updateAuthor(author)" style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="pencil"/></button>
                            <button @click="deleteAuthor(author)" style="background-color: transparent; padding: 5;">
                                <font-awesome-icon icon="trash"/></button>
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
                        <th scope="col">Name</th>
                        <th scope="col">Photo</th>
                        <th scope="col">Birthday</th>
                        <th scope="col">Death</th>
                        <th scope="col">Author ID</th>
                        <th scope="col">Update</th>
                        <th scope="col">Delete</th>
                        <!-- Commented out Delete button; unsure if needed for this section -->
                        <!--<th scope="col">Delete</th> -->
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for = "author in authors" v-bind:key="author">

                        <td>{{author.name}}</td>
                        <td><img :src="author.photo" class="card-img-top" :alt="author.name" :width="250" :height="150"></td>
                        <td>{{author.birth_date}}</td>
                        <td>{{author.death_date}}</td>
                        <td>{{author.auth_id}}</td>

                        <td v-if="this.authenticated === 'true'" @click="updateAuthor(author)"><button style="background-color: transparent; padding: 0;">
                            <font-awesome-icon icon="pencil"/></button>
                        </td>
                        <td v-if="this.authenticated === 'true'"  @click="deleteAuthor(author)"><button style="background-color: transparent; padding: 0;">
                            <font-awesome-icon icon="trash"/></button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <!-- Only allow add of authors for admins -->
                <div v-if="this.authenticated === 'true'">
                    <button type="button" class="btn btn-primary" @click="addNewAuthor">Add New Author</button>
                </div>
            </div>
        </div>
</template>
<script>
    import router from '../router';
    import {APIService} from '../http/APIService';
    const apiService = new APIService();

    export default {
        name: "AuthorList",
        data: () => ({
            authors: [],
            validUserName: "Guest",
            authorSize: 0,
            showMsg: '',
            isMobile: false,
            authenticated: false,
            headers: [
                {text: 'Name', sortable: false, align: 'left',},
                {text: 'Photo', sortable: false, align: 'left',},
                {text: 'Birthday', sortable: false, align: 'left',},
                {text: 'Death Date', sortable: false, align: 'left',},
                {text: 'Author ID', sortable: false, align: 'left',}
            ],
        }),
        mounted() {
            this.authenticated = localStorage.getItem("isAuthenticated")
            this.getAuthors();
            this.showMessages();
        },
        methods: {
            onResize() {
                if (window.innerWidth > 600)
                    this.isMobile = false;
                else
                    this.isMobile = true;
            },
            showMessages(){
                if (this.$route.params.msg) {
                    this.showMsg = this.$route.params.msg;
                }
            },
            getAuthors() {
                apiService.getAuthorList().then(response => {
                    this.authors = response.data.data;
                    this.AuthorSize = this.authors.length;
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
            addNewAuthor() {
                if (localStorage.getItem("isAuthenticated")
                    && JSON.parse(localStorage.getItem("isAuthenticated")) === true) {
                    router.push('/author-create');
                } else {
                    router.push("/auth");
                }
            },
            updateAuthor(author) {
                router.push('/author-create/' + author.auth_id);
            },
            deleteAuthor(author) {
                if(confirm("Do you really want to delete?")) {
                    apiService.deleteAuthor(author.auth_id).then(response => {
                        if (response.status === 204) {
                            router.push('/author-list/deleted/')
                            this.getAuthors()
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