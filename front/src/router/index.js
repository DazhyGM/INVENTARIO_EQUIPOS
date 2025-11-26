import { createRouter, createWebHistory } from 'vue-router'
import AppIndex from '../components/AppIndex.vue'
import LoginApp from '../components/LoginApp.vue'
import Home from '../components/HomeIndex.vue'
import Tareas from '../components/TareasEquipo.vue'

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
