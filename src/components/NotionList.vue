<script setup lang="ts">
import { ref, onMounted } from 'vue'

const entries = ref<{ id: string; name: string }[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/entries') // à adapter si tu veux utiliser /list
    if (!res.ok) throw new Error('Erreur lors du chargement')
    const data = await res.json()
    entries.value = data.map((entry: any) => ({
      id: entry.id,
      name: entry.properties?.Nom?.title?.[0]?.plain_text || 'Sans titre',
    }))
  } catch (err: any) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <header>
      <img src="/logo.png" class="logo" alt="Logo" />
      <div class="wrapper">
        <h1>Liste Notion</h1>
      </div>
    </header>

    <div v-if="isLoading">Chargement...</div>
    <div v-else-if="error">Erreur : {{ error }}</div>
    <table v-else>
      <thead>
        <tr>
          <th>Nom / Prénom</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.id">
          <td>{{ entry.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

table {
  margin: 2rem auto;
  border-collapse: collapse;
  width: 80%;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
}
th {
  background-color: #f0f0f0;
}
</style>
