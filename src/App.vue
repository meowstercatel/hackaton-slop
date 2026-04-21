<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// @ts-ignore Root JS file has no TypeScript declaration.
import { readExcelFile, getTimeValues } from '../index.js'

const data = ref()
const error = ref<string | null>(null)
const loading = ref(true)
const selectedValue = ref()

const hoveredRow = ref(null)
const hoveredCol = ref(null)

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
  <main style="display: flex; flex-direction: column; justify-items: center; text-align: center">
    <p v-if="loading">Loading teachers...</p>
    <p v-else-if="error">{{ error }}</p>
    <section v-else>
      <select v-model="selectedValue" id="item-select">
        <option disabled value="">Please select one</option>
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
                    backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFBD33'][index],
                    width: '17.6%',
                    padding: '12px 5px',
                    border: '1px solid #444',
                    textTransform: 'uppercase',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    color: '#fff',
                  }"
                >
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(time, rowIndex) in getTimeValues()" :key="rowIndex">
                <td
                  style="
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: center;
                    background-color: #f9f9f9;
                    font-weight: 700;
                    font-size: 0.8rem;
                    color: #333;
                  "
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
                    style="
                      padding: 6px 10px;
                      background-color: #fff;
                      border: 2px solid #000;
                      border-left: 6px solid #002;
                      color: #000;
                      font-weight: 600;
                      font-size: 0.85rem;
                      min-height: 18px;
                    "
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
main {
  padding: 1rem;
}
</style>
