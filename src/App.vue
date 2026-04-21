<script setup lang="ts">
import { onMounted, ref } from 'vue'
// @ts-ignore Root JS file has no TypeScript declaration.
import { readExcelFile, getTimeValues } from '../index.js'

const data = ref()
const error = ref<string | null>(null)
const loading = ref(true)
const selectedValue = ref()

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
      background-color: #fcfaf8;
    "
  >
    <p v-if="loading">Loading teachers...</p>
    <p v-else-if="error">{{ error }}</p>
    <section v-else>
      <select
        v-model="selectedValue"
        id="item-select"
        style="padding: 8px; border: 2px solid #111111; border-radius: 4px; font-family: inherit"
      >
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
              border: 2px solid #111111;
              table-layout: fixed;
            "
          >
            <thead>
              <tr>
                <th
                  style="
                    width: 12%;
                    background-color: #111111;
                    color: #dccca1;
                    padding: 12px 5px;
                    border: 1px solid #46302a;
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
                    /* Highlight using 'Baked', otherwise use Wines, Grass, Berry, Coral, Chive */
                    backgroundColor:
                      hoveredCol === index
                        ? '#d68067'
                        : ['#703d41', '#264d39', '#2a2858', '#145c62', '#555f47'][index],
                    color: '#ffffff',
                    width: '17.6%',
                    padding: '12px 5px',
                    border: '1px solid #111111',
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
                    border: '1px solid #111111',
                    padding: '8px',
                    textAlign: 'center',
                    /* Highlight using 'Baked', otherwise use 'Royal' */
                    backgroundColor: hoveredRow === rowIndex ? '#d68067' : '#0e2d31',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    color: '#dccca1',
                  }"
                >
                  {{ time }}
                </td>

                <td
                  v-for="(column, colIndex) in value"
                  :key="colIndex"
                  style="
                    border: 1px solid #111111;
                    padding: 6px;
                    vertical-align: middle;
                    /* Using 'Plush' for the cell background */
                    background-color: #a2c9cb;
                  "
                >
                  <div
                    v-if="column[rowIndex]"
                    @mouseenter="((hoveredRow = rowIndex), (hoveredCol = colIndex))"
                    @mouseleave="((hoveredRow = null), (hoveredCol = null))"
                    style="
                      padding: 6px 10px;
                      /* Using 'Lotus' for lesson card and 'Candy' for accent */
                      background-color: #e0c1bf;
                      border: 2px solid #111111;
                      border-left: 6px solid #de2136;
                      color: #111111;
                      font-weight: 600;
                      font-size: 0.85rem;
                      min-height: 18px;
                      cursor: pointer;
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
              border: 2px solid #111111;
              /* Using 'Foamy' for info sections */
              background-color: #729a89;
              margin-top: -2px;
            "
          >
            <strong
              style="
                color: #111111;
                text-transform: uppercase;
                font-size: 0.8rem;
                letter-spacing: 0.5px;
              "
              >{{ key }}:</strong
            >
            <span style="margin-left: 10px; color: #111111; font-weight: 700">{{ value }}</span>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>
