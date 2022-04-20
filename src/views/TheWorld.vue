<script setup lang="ts">
import { useMachine } from "@xstate/vue"
import { world } from "../machines/world"
import Person from "../components/Person.vue"
import { worldProps } from "../machines/props"

const { width, height } = worldProps

const { state } = useMachine(world)
</script>

<template>
  <main>
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#777"
      fill="#aaa"
    >
      <Person
        v-for="inhabitant in state.context.inhabitants"
        :key="inhabitant.id"
        :inhabitant="inhabitant"
      />
    </svg>
  </main>
</template>

<style scoped></style>
