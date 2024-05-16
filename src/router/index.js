import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Auth from '@/components/Auth.vue'
import Register from '@/components/Register'
import BookBuddyList from '@/components/BookBuddyList'
import BookBuddyCreate from '@/components/BookBuddyCreate'
import BookList from '@/components/BookList'
import BookCreate from '@/components/BookCreate'
import BookDetail from '@/components/BookDetail'
import AuthorCreate from '@/components/AuthorCreate'
import AuthorList from '@/components/AuthorList'
import ReviewList from '@/components/ReviewList'
import ReviewCreate from '@/components/ReviewCreate'

const routes = [
   {
     path: '/',
     name: 'Home',
     component: Home
  },
  {
    path: '/bookbuddy-list',
    name: 'BookBuddyList',
    component: BookBuddyList
  },
  {
    path: '/bookbuddy-list/:msg',
    name: 'BookBuddyUpdatedList',
    component: BookBuddyList
  },
  {
    path: '/bookbuddy-create',
    name: 'BookBuddyCreate',
    component: BookBuddyCreate
  },
  {
    path: '/bookbuddy-create/:pk',
    name: 'BookBuddyUpdate',
    component: BookBuddyCreate
  },
  {
    path: '/book-list',
    name: 'BookList',
    component: BookList
  },
  {
    path: '/book-list/:msg',
    name: 'BookUpdateList',
    component: BookList
  },
  {
    path: '/book-create',
    name: 'BookCreate',
    component: BookCreate
  },
  {
    path: '/book-create/:pk',
    name: 'BookUpdate',
    component: BookCreate
  },
  {
    path: '/book-detail/:pk',
    name: 'BookDetail',
    component: BookDetail,
  },
  {
    path: '/author-list',
    name: 'AuthorList',
    component: AuthorList
  },
  {
    path: '/author-list/:msg',
    name: 'AuthorUpdateList',
    component: AuthorList
  },
  {
    path: '/author-create',
    name: 'AuthorCreate',
    component: AuthorCreate
  },
  {
    path: '/author-create/:pk',
    name: 'AuthorUpdate',
    component: AuthorCreate
  },
  {
    path: '/review-list',
    name: 'ReviewList',
    component: ReviewList
  },
  {
    path: '/review-list/:msg',
    name: 'ReviewUpdateList',
    component: ReviewList
  },
  {
    path: '/review-create',
    name: 'ReviewCreate',
    component: ReviewCreate
  },
  {
    path: '/review-create/:pk',
    name: 'ReviewUpdate',
    component: ReviewCreate
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path:'/register',
    name: 'Register',
    component: Register
  } 
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

