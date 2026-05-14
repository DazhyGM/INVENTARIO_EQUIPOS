<template>
  <div class="login-background">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-content">
        <h2 class="navbar-title">Gestión de Equipos</h2>
        <button @click="cerrarSesion" class="logout-button">Cerrar sesión</button>
      </div>
    </nav>

    <div class="container">
      <h2>Ingrese el nombre del equipo</h2>

      <input v-model="hostname" type="text" placeholder="Nombre del equipo" class="input-box" />

      <div class="button-group">
        <button @click="buscarEquipo">Buscar</button>
        <button @click="registrarEquipoNuevo">Registrar</button>
      </div>

      <div v-if="mensajeExito" class="mensaje-exito">{{ mensajeExito }}</div>
      <div v-if="mensajeError" class="mensaje-error">{{ mensajeError }}</div>

      <div v-if="busquedaRealizada && datosEquipos.length === 0" class="no-result">
        No se encontró ningún equipo con ese nombre.
      </div>
      <table class="tabla-equipo" v-if="datosEquipos.length">
        <thead>
          <tr>
            <th>Hostname</th>
            <th>Estado</th>
            <th>Fecha de registro</th>
            <th>Fecha finalizado</th>
            <th>Campaña</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in datosEquipos" :key="index">
            <td>
              {{ item.hostname }}
              <button class="btn-eliminar" @click="confirmarEliminar(item.hostname)" title="Eliminar equipo">
                ❌
              </button>
            </td>
            <td>
              {{ item.nombre_estado || 'Desconocido' }}
              <button
                v-if="item.nombre_estado === 'En preparacion' && item.nombre_campaña && item.nombre_campaña !== 'Sin campaña'"
                @click="verTareas(item)" class="btn-tareas" title="Ver tareas">
                📋
              </button>
              <button v-else-if="item.nombre_estado === 'Completado'" @click="verTareas(item)"
                class="btn-tareas completado" title="Ver tareas">
                ✅
              </button>
            </td>
            <td>{{ formatDate(item.fecha_registro) }}</td>
            <td>{{ formatDate(item.fecha_finalizacion) }}</td>
            <td>{{ item.nombre_campaña || 'Sin campaña' }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="mostrarCampañaInput" class="asignar-campaña">
        <h3>Asignar campaña al equipo</h3>
        <select v-model="campañaSeleccionada" class="input-box">
          <option disabled value="">Selecciona una campaña</option>
          <option v-for="campaña in campañasDisponibles" :key="campaña.id_campaña" :value="campaña.id_campaña">
            {{ campaña.nombre_campaña }}
          </option>
        </select>
        <button @click="asignarCampaña" :disabled="!campañaSeleccionada">Guardar campaña</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import {
  searchEquipo,
  registerEquipo,
  asignarCampañaEquipo,
  getCampañas,
  deleteEquipo
} from '@/services/equipoAPI.js'

const router = useRouter()
const hostname = ref('')
const datosEquipos = ref([])
const busquedaRealizada = ref(false)
const mostrarCampañaInput = ref(false)
const campañasDisponibles = ref([])
const campañaSeleccionada = ref('')
const mensajeError = ref('')
const mensajeExito = ref('')
const cambiosPendientes = ref(false)

const buscarEquipo = async () => {
  mensajeError.value = ''
  mensajeExito.value = ''
  try {
    const resultado = await searchEquipo(hostname.value)
    datosEquipos.value = resultado
    busquedaRealizada.value = true
  } catch (error) {
    console.error('Error al buscar equipo:', error)
    mensajeError.value = 'Ocurrió un error al buscar el equipo.'
  }
}

const registrarEquipoNuevo = async () => {
  mensajeError.value = ''
  mensajeExito.value = ''
  try {
    await registerEquipo(hostname.value)
    await buscarEquipo()
    await cargarCampañas()
    mostrarCampañaInput.value = true
    cambiosPendientes.value = true
    mensajeExito.value = 'Equipo registrado correctamente.'
  } catch (error) {
    if (error.response?.data?.error) {
      mensajeError.value = error.response.data.error
    } else {
      mensajeError.value = 'Error al registrar equipo.'
    }
  }
}

const asignarCampaña = async () => {
  mensajeError.value = ''
  mensajeExito.value = ''
  try {
    await asignarCampañaEquipo(hostname.value, campañaSeleccionada.value)
    await buscarEquipo()
    mostrarCampañaInput.value = false
    campañaSeleccionada.value = ''
    cambiosPendientes.value = false
    mensajeExito.value = 'Campaña asignada correctamente.'
  } catch (error) {
    console.error('Error al asignar campaña:', error)
    mensajeError.value = 'Error al asignar campaña.'
  }
}

const cargarCampañas = async () => {
  try {
    campañasDisponibles.value = await getCampañas()
  } catch (error) {
    console.error('Error al cargar campañas:', error)
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  window.location.href = '/'
}

const verTareas = (equipo) => {
  router.push(`/tareas/hostname/${equipo.hostname}`)
}

onMounted(() => {
  cargarCampañas()

  const beforeUnloadHandler = (event) => {
    if (cambiosPendientes.value) {
      event.preventDefault()
      event.returnValue = ''
    }
  }
  window.addEventListener('beforeunload', beforeUnloadHandler)

  onUnmounted(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler)
  })
})

onBeforeRouteLeave((to, from, next) => {
  if (cambiosPendientes.value) {
    if (confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir sin seleccionar campaña?')) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})

const formatDate = (fecha) => {
  if (
    !fecha ||
    fecha === "1899-11-30" ||
    fecha === "0000-00-00" ||
    new Date(fecha).getFullYear() < 2000
  ) {
    return "Sin finalizar";
  }
  return new Date(fecha).toLocaleDateString("es-CO");
}

const confirmarEliminar = async (hostnameEquipo) => {
  if (confirm(`¿Seguro que quieres eliminar el equipo "${hostnameEquipo}"?`)) {
    try {
      await deleteEquipo(hostnameEquipo);
      mensajeExito.value = 'Equipo eliminado correctamente.';
      await buscarEquipo();
    } catch (error) {
      console.error('Error al eliminar:', error);
      mensajeError.value = 'Error al eliminar el equipo.';
    }
  }
};

</script>

<style scoped>
.login-background {
  min-height: 100vh;
  display: flow-root;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #16213e, #ffffff, #16213e);
}

.container {
  max-width: 1000px;
  margin: 60px auto;
  padding: 50px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #1b1f3b;
  color: #f5f5f5;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  font-size: 18px;
}

.input-box {
  width: 100%;
  padding: 16px;
  margin-bottom: 25px;
  font-size: 18px;
  border: 1px solid #0f3460;
  border-radius: 10px;
  background-color: #fff;
  color: #333;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-bottom: 25px;
}

.button-group button,
.asignar-campaña button {
  padding: 14px 24px;
  font-size: 17px;
  background-color: #0f3460;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.button-group button:hover,
.asignar-campaña button:hover {
  background-color: #e94560;
}

.navbar {
  background-color: #0f3460;
  padding: 14px 24px;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.navbar-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-title {
  color: #f5f5f5;
  font-size: 24px;
  margin: 0;
}

.logout-button {
  background-color: #e94560;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-button:hover {
  background-color: #c0392b;
}

.tabla-equipo {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #16213e;
  border-radius: 10px;
  overflow-y: auto;
  font-size: 16px;
}

.tabla-equipo th,
.tabla-equipo td {
  border: 1px solid #293b5f;
  padding: 12px;
  text-align: left;
  color: #fff;
}

.tabla-equipo th {
  background-color: #0f3460;
}

.tabla-equipo tr:nth-child(even) {
  background-color: #1a1a2e;
}

.btn-tareas {
  margin-left: 8px;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.btn-tareas:hover {
  color: #e94560;
}

.mensaje-error {
  color: #ff4d4d;
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 16px;
}

.mensaje-exito {
  color: #2ecc71;
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 16px;
}

.no-result {
  color: #ff7675;
  margin-top: 15px;
  font-weight: bold;
  font-size: 16px;
}

.asignar-campaña {
  margin-top: 30px;
  background-color: #16213e;
  padding: 24px;
  border-radius: 10px;
  border: 1px solid #0f3460;
}

.asignar-campaña h3 {
  margin-bottom: 20px;
  font-size: 20px;
}

.completado {
  color: #22c55e;
}

.completado:hover {
  color: #16a34a;
}
.btn-eliminar {
  margin-left: 8px;
  background-color: transparent;
  border: none;
  color: #ff4d4d;
  font-size: 16px;
  cursor: pointer;
}

.btn-eliminar:hover {
  color: #e94560;
}

</style>
