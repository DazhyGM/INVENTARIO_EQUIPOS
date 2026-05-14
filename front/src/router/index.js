import { createRouter, createWebHistory } from 'vue-router'
import AppIndex from '../views/home/AppIndex.vue'
import LoginApp from '../views/auth/LoginApp.vue'
import Home from '../views/home/HomeIndex.vue'
import Tareas from '../views/services/TareasEquipo.vue'

const routes = [
  {path: '/',component: AppIndex, meta: { title: 'Inicio' }},
  {path: '/Login',component: LoginApp, meta: { title: 'Inicio de sesion' }},
  {path: '/Home',component: Home, meta: { title: 'Home' }},
  {path: '/tareas/hostname/:hostname',component: Tareas, meta: { title: 'Tareas' }},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});


export default router
