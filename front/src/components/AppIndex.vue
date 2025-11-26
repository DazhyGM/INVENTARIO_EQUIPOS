<template>
  <div class="landing-page">
    <header class="header">
      <h1>Gestión de Equipos de Cómputo</h1>
      <p>Optimiza y controla la preparación de equipos de forma eficiente.</p>
      <img src="../../src/assets/equipos-animado.gif" alt="Animación equipos" class="landing-gif" />
    </header>
    <button @click="goToLogin">Iniciar Sesión</button>
    <footer class="footer">
      <p>© 2025 Sistema de Gestión - Todos los derechos reservados</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goToLogin = () => {
  router.push('/login') 
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #16213e, #ffffff, #16213e);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.header {
  margin-top: 10vh;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #000000;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #000000;
}

button {
  background-color: #0f3460;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #e94560;
}

.footer {
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #aaa;
}
.landing-gif {
  width: 300px;
  max-width: 100%;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(233, 69, 96, 0.3);
}

</style>
