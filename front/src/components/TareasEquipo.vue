<template>
    <div class="login-background">
        <div class="tareas-container">
            <h2>Tareas del equipo: {{ hostname }}</h2>

            <table v-if="tareas.length" class="tareas-table">
                <thead>
                    <tr>
                        <th v-for="tarea in tareas" :key="'titulo-' + tarea.id_equipo_tarea">
                            {{ tarea.nombre_tarea }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td v-for="tarea in tareas" :key="'editar-' + tarea.id_equipo_tarea" class="center-cell">
                            <button @click="editarTarea(tarea)">Editar</button>
                        </td>
                    </tr>

                    <tr>
                        <td v-for="tarea in tareas" :key="'check-' + tarea.id_equipo_tarea" class="center-cell">
                            <label class="switch">
                                <input type="checkbox" :checked="tarea.completada"
                                    :disabled="editingTaskId !== tarea.id_tarea" @change="toggleCompletada(tarea)" />
                                <span class="slider"
                                    :class="{ 'slider-checked': tarea.completada, 'slider-pending': !tarea.completada }"></span>
                            </label>
                        </td>
                    </tr>

                    <tr>
                        <td v-for="(tarea, index) in tareas" :key="'comentario-' + tarea.id_equipo_tarea"
                            class="center-cell">
                            <div style="position: relative;">
                                <input class="comentario-input" type="text" v-model="comentariosEdit[index]"
                                    placeholder="Agregar comentario" style="width: 80%;"
                                    @focus="comentarioEditandoId = tarea.id_equipo_tarea" />

                                <button class="eye-button"
                                    @click.stop="toggleVerComentario(tarea.id_equipo_tarea, index)"
                                    title="Ver comentario" style="margin-left: 6px;">
                                    👁
                                </button>

                                <div v-if="comentarioEditandoId === tarea.id_equipo_tarea" style="margin-top: 6px;">
                                    <button class="comentario-action"
                                        @click="guardarComentario(tarea, index)">Guardar</button>
                                    <button class="comentario-action"
                                        @click="cancelarEdicionComentario(index, tarea.comentario)">Cancelar</button>
                                </div>

                                <div v-if="comentarioViendoId" class="popup-overlay" @click.self="cerrarPopup">
                                    <div class="popup-content">
                                        <h3>Comentario</h3>
                                        <p v-if="comentarioViendoContent">{{ comentarioViendoContent }}</p>
                                        <p v-else><em>Sin comentario</em></p>
                                        <button @click="cerrarPopup">Cerrar</button>
                                    </div>
                                </div>

                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p v-else>No hay tareas asignadas para este equipo.</p>

            <router-link to="/Home">⬅ Volver</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const hostname = route.params.hostname
const tareas = ref([])
const comentariosEdit = ref([])
const editingTaskId = ref(null)
const comentarioEditandoId = ref(null)
const comentarioViendoId = ref(null)
const comentarioViendoContent = ref('')

onMounted(async () => {
    try {
        const res = await axios.get(`http://localhost:5000/api/tareas/hostname/${hostname}`)

        tareas.value = res.data.map(t => ({
            ...t,
            comentario: t.comentario ?? '',
            completada: t.estado_tarea_fk === 1
        }))

        comentariosEdit.value = tareas.value.map(() => '')
    } catch (error) {
        console.error('Error al cargar tareas:', error)
    }

    document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick)
})

function handleDocumentClick(e) {
    if (
        e.target.closest('.comentario-popup') ||
        e.target.closest('.eye-button') ||
        e.target.closest('.comentario-input') ||
        e.target.closest('.comentario-action')
    ) {
        return
    }
    comentarioViendoId.value = null
    comentarioViendoContent.value = ''
}

const toggleCompletada = async (tarea) => {
    try {
        const nuevoEstado = !tarea.completada
        await axios.put(`http://localhost:5000/api/tareas/${tarea.id_equipo_tarea}`, {
            completada: nuevoEstado
        })
        tareas.value = tareas.value.map(t =>
            t.id_equipo_tarea === tarea.id_equipo_tarea ? { ...t, completada: nuevoEstado, estado_tarea_fk: nuevoEstado ? 1 : 2 } : t
        )
        editingTaskId.value = null
    } catch (error) {
        console.error('Error al actualizar tarea:', error)
    }
}

const editarTarea = (tarea) => {
    editingTaskId.value = tarea.id_tarea
}

const guardarComentario = async (tarea, index) => {
    try {
        const nuevoComentario = comentariosEdit.value[index] ?? ''
        await axios.put(`http://localhost:5000/api/tareas/${tarea.id_equipo_tarea}`, {
            comentario: nuevoComentario
        })
        tareas.value = tareas.value.map(t =>
            t.id_equipo_tarea === tarea.id_equipo_tarea ? { ...t, comentario: nuevoComentario } : t
        )
        comentariosEdit.value[index] = nuevoComentario
        if (comentarioViendoId.value === tarea.id_equipo_tarea) {
            comentarioViendoContent.value = nuevoComentario || ''
        }
        comentarioEditandoId.value = null
    } catch (error) {
        console.error('Error al guardar comentario:', error)
    }
}

const cancelarEdicionComentario = (index, originalComentario) => {
    comentariosEdit.value[index] = originalComentario ?? ''
    comentarioEditandoId.value = null
}

const toggleVerComentario = (id_equipo_tarea, index) => {
    if (comentarioViendoId.value === id_equipo_tarea) {
        comentarioViendoId.value = null
        comentarioViendoContent.value = ''
        return
    }
    const tarea = tareas.value[index]
    comentarioViendoContent.value = tarea.comentario?.trim() || ''
    comentarioViendoId.value = id_equipo_tarea
}

const cerrarPopup = () => {
  comentarioViendoId.value = null
  comentarioViendoContent.value = ''
}

</script>

<style scoped>
.login-background {
    min-height: 100vh;
    display: flow-root;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #16213e, #ffffff, #16213e);
}

.tareas-container {
    min-height: 50vh;
    padding: 50px 20px;
    max-width: 1000px;
    margin: 10% auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    background-color: #1b1f3b;
    color: #f5f5f5;
    border-radius: 16px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tareas-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #16213e;
    border-radius: 10px;
    overflow: hidden;
    font-size: 16px;
    table-layout: fixed;
}

.tareas-table th,
.tareas-table td {
    border: 1px solid #293b5f;
    padding: 12px;
    text-align: center;
    color: #fff;
    word-wrap: break-word;
}

.tareas-table th {
    background-color: #0f3460;
}

.tareas-table tr:nth-child(even) {
    background-color: #1a1a2e;
}

button,
.router-link-active {
    background-color: transparent;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s ease;
}

button:hover,
.router-link-active:hover {
    color: #e94560;
}

.center-cell {
    text-align: center;
}

.no-result {
    color: #ff7675;
    margin-top: 15px;
    font-weight: bold;
    font-size: 16px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f1c40f;
    border-radius: 24px;
    transition: 0.4s;
}

.slider::before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
}

.slider-checked {
    background-color: #2ecc71 !important;
}

input:checked+.slider::before {
    transform: translateX(22px);
}

.slider-pending {
    background-color: #f1c40f !important;
}

.comentario-popup {
    position: absolute;
    top: 36px;
    left: 0;
    background: white;
    color: black;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    z-index: 10;
    min-width: 180px;
    text-align: left;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.199);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.popup-content {
  background: rgb(71, 68, 68);
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  text-align: center;
}

</style>
