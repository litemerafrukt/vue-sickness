<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue"
import Person from "../components/Person.vue"
import { personProps, worldProps } from "../machines/props"
import { useInterpret } from "@xstate/vue"
import { createPerson } from "../machines/person"
import { StateValue } from "xstate"

const state = ref<StateValue | null>(null)
const { width, height } = worldProps

const inhabitantMachine = createPerson(1).withContext({
  x: worldProps.width / 2 - personProps.width / 2,
  y: worldProps.height / 2 - personProps.height / 2,
  movement: Math.random() * 3,
})
const inhabitant = useInterpret(inhabitantMachine)
  .start()
  .onTransition((machineState) => {
    state.value = machineState.value
  })

const tickInterval = setInterval(() => {
  inhabitant.send("TICK")
}, 50)

onBeforeUnmount(() => {
  clearInterval(tickInterval)
})
</script>

<template>
  <section>
    <button @click="inhabitant.send('INFECT')">Infect the subject</button>
    <p>Subjects state: {{ state }}</p>
  </section>
  <section>
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#777"
      fill="#aaa"
    >
      <Person
        :inhabitant="inhabitant"
        :width="personProps.width * 10"
        :height="personProps.height * 10"
      />
    </svg>
  </section>
</template>

<style scoped></style>
