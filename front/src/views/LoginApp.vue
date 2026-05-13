<template>
  <div class="login-background">
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="Ingresa tu correo"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="Ingresa tu contraseña"
          required
        />
      </div>
      <button type="submit" class="btn-login">Ingresar</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div class="form-footer">
      <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
      <p><router-link to="/forgot-password">¿Olvidaste tu contraseña?</router-link></p>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'


const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: email.value,
      password: password.value
    })
    const data = response.data
    localStorage.setItem('token', data.token) 
    router.push('/Home')
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Error al iniciar sesión. Intenta de nuevo.'
    }
  }
}
</script>
<style scoped>

body {
  margin: 0;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #f5f5f5;
}
.login-background {
  min-height: 100vh;
  display: flow-root;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #16213e, #ffffff, #16213e);
}

.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  background-color: #0f3460;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  text-align: center;
  
}

h2 {
  margin-bottom: 25px;
  font-size: 26px;
  color: #ffffff;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #f5f5f5;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f5f5f5;
  color: #333;
}

input:focus {
  outline: 2px solid #e94560;
}

.btn-login {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background-color: #e94560;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-login:hover {
  background-color: #072447;
}

.error {
  margin-top: 15px;
  color: #ff7675;
  font-weight: bold;
}

.form-footer {
  margin-top: 25px;
  font-size: 14px;
}

.form-footer p {
  margin: 6px 0;
}

.form-footer a {
  color: #00bcd4;
  text-decoration: none;
  transition: color 0.3s ease;
}

.form-footer a:hover {
  color: #ffffff;
}
</style>


