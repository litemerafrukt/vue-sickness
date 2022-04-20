<script setup lang="ts">
import { RouterView } from "vue-router"
</script>

<template>
  <nav>
    <router-link to="/">The World</router-link>
    <router-link to="/an-inhabitant">An Inhabitant</router-link>
  </nav>
  <main>
    <router-view></router-view>
  </main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

main {
  text-align: center;
  padding: 1em;
  margin: 0 auto;
}

main > svg {
  border: 1px solid #aaa;
}

nav {
  display: flex;
  justify-content: space-evenly;
}
</style>
