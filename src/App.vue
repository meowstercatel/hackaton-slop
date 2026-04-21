<script setup lang="ts">
import { onMounted, ref } from 'vue'
// @ts-ignore Root JS file has no TypeScript declaration.
import { readExcelFile, getTimeValues } from '../index.js'

const data = ref()
const error = ref<string | null>(null)
const loading = ref(true)
const selectedValue = ref()

// Used to track the current hover position
const hoveredRow = ref<number | null>(null)
const hoveredCol = ref<number | null>(null)

onMounted(async () => {
  try {
    data.value = await readExcelFile()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load teachers data.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main
    style="
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-items: center;
      text-align: center;
    "
  >
    <p v-if="loading">Loading teachers...</p>
    <p v-else-if="error">{{ error }}</p>
    <section v-else>
      <select v-model="selectedValue" id="item-select">
        <option disabled value="">Wybierz nauczyciela</option>
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
                    /* Highlight background if this column is hovered */
                    backgroundColor:
                      hoveredCol === index
                        ? '#dccca1'
                        : ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFBD33'][index],
                    /* Change text color to black when highlighted for contrast */
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
                    /* Highlight background if this row is hovered */
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
/* Keeping only the root padding as per your original file */
</style>
