<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore Root JS file has no TypeScript declaration.
import { readExcelFile, getTimeValues } from '../index.js'

const data = ref()
const error = ref<string | null>(null)
const loading = ref(false)
const selectedValue = ref()
const isReady = ref(false) // Tracks if the file has been processed

// Used to track the current hover position
const hoveredRow = ref<number | null>(null)
const hoveredCol = ref<number | null>(null)

// Function to handle the file selection
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  loading.value = true
  error.value = null

  try {
    data.value = await readExcelFile(file)
    isReady.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Błąd podczas wczytywania pliku.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="!isReady" class="blocking-overlay">
    <div class="upload-card">
      <h2>Wczytaj plan lekcji (Excel)</h2>
      <p>Musisz wybrać plik, aby kontynuować.</p>

      <input
        type="file"
        id="file-input"
        accept=".xlsx, .xls"
        @change="handleFileChange"
        :disabled="loading"
      />

      <div v-if="loading" class="loader">Przetwarzanie pliku...</div>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>

  <main
    v-else
    style="
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-items: center;
      text-align: center;
    "
  >
    <section>
      Wybierz nauczyciela:
      <select v-model="selectedValue" id="item-select">
        <option v-for="(val, key) in data" :key="key" :value="val">
          {{ key }}
        </option>
      </select>
    </section>

    <section>
      <div
        v-for="(value, key) in selectedValue"
        :key="key"
        style="margin-bottom: 24px; margin-top: 18px; font-family: 'Segoe UI', Arial, sans-serif"
      >
        <template v-if="Array.isArray(value)">
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              border: 2px solid #000;
              table-layout: fixed;
            "
          >
            <thead>
              <tr>
                <th
                  style="
                    width: 12%;
                    background-color: #333;
                    color: #fff;
                    padding: 12px 5px;
                    border: 1px solid #444;
                    text-transform: uppercase;
                    font-weight: 800;
                    font-size: 0.9rem;
                  "
                >
                  Godz.
                </th>
                <th
                  v-for="(day, index) in ['Pn', 'Wt', 'Śr', 'Czw', 'Pt']"
                  :key="day"
                  :style="{
                    backgroundColor:
                      hoveredCol === index
                        ? '#dccca1'
                        : ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFBD33'][index],
                    color: hoveredCol === index ? '#000' : '#fff',
                    width: '17.6%',
                    padding: '12px 5px',
                    border: '1px solid #444',
                    textTransform: 'uppercase',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                  }"
                >
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(time, rowIndex) in getTimeValues()" :key="rowIndex">
                <td
                  :style="{
                    border: '1px solid #000',
                    padding: '8px',
                    textAlign: 'center',
                    backgroundColor: hoveredRow === rowIndex ? '#dccca1' : '#f9f9f9',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    color: '#333',
                  }"
                >
                  {{ time }}
                </td>

                <td
                  v-for="(column, colIndex) in value"
                  :key="colIndex"
                  style="
                    border: 1px solid #000;
                    padding: 6px;
                    vertical-align: middle;
                    background-color: #fff;
                  "
                >
                  <div
                    v-if="column[rowIndex]"
                    @mouseenter="((hoveredRow = rowIndex), (hoveredCol = colIndex))"
                    @mouseleave="((hoveredRow = null), (hoveredCol = null))"
                    :style="{
                      padding: '6px 10px',
                      backgroundColor:
                        hoveredRow === rowIndex && hoveredCol === colIndex ? '#e0e0e0' : '#fff',
                      border:
                        hoveredRow === rowIndex && hoveredCol === colIndex
                          ? '4px solid #000'
                          : '2px solid #000',
                      borderLeft: '6px solid #002',
                      color: '#000',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      minHeight: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease-in-out',
                    }"
                  >
                    {{ column[rowIndex] }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template v-else>
          <div
            style="
              padding: 12px;
              border: 2px solid #000;
              background-color: #f0f0f0;
              margin-top: -2px;
            "
          >
            <strong
              style="
                color: #000;
                text-transform: uppercase;
                font-size: 0.8rem;
                letter-spacing: 0.5px;
              "
              >{{ key }}:</strong
            >
            <span style="margin-left: 10px; color: #000; font-weight: 500">{{ value }}</span>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<style scoped>
.blocking-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.upload-card {
  background: white;
  padding: 2rem;
  border: 3px solid #000;
  box-shadow: 10px 10px 0px #000;
  text-align: center;
  max-width: 400px;
}

#file-input {
  margin-top: 20px;
  padding: 10px;
  border: 1px dashed #333;
  width: 100%;
}

.error-text {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}

.loader {
  margin-top: 15px;
  font-style: italic;
  color: #555;
}
</style>
