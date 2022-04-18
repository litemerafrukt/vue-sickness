import { createMachine, assign, spawn } from "xstate"
import { createPerson } from "./person"
import { worldProps, personProps, sicknessProps } from "./props"

interface WorldContext {
  height: number
  width: number
  numberOfInhabitants: number
  inhabitants: any[]
}

export const world = createMachine(
  {
    id: "world",
    context: worldProps as WorldContext,
    initial: "startup",
    states: {
      startup: {
        always: {
          target: "running",
          actions: ["spawnInhabitants", "infectFiveFirst"],
        },
      },
      running: {
        activities: "tick",
      },
    },
  },
  {
    actions: {
      spawnInhabitants: assign<WorldContext>({
        inhabitants: (context) =>
          Array.from({ length: context.numberOfInhabitants }, (_, i) =>
            spawn(
              createPerson(i).withContext({
                x: Math.random() * (context.width - personProps.width),
                y: Math.random() * (context.height - personProps.height),
                movement: Math.random() * 3,
              })
            )
          ),
      }),
      infectFiveFirst: ({ inhabitants }) => {
        for (let i = 0; i < 5; i++) {
          inhabitants[i].send("INFECT")
        }
      },
    },
    activities: {
      tick: ({ inhabitants }) => {
        let infectionAreas: { x: number; y: number }[] = []
        const tick = setInterval(() => {
          for (let person of inhabitants) {
            if (
              person.state.value === "infected" ||
              person.state.value === "sick"
            ) {
              const { x, y } = person.state.context
              infectionAreas.push({
                x: person.state.context.x,
                y: person.state.context.y,
              })
            }
          }

          for (let person of inhabitants) {
            const { x, y } = person.state.context
            const { width, height } = personProps
            const { spreadArea } = sicknessProps

            for (let ia of infectionAreas) {
              if (
                x < ia.x + width + spreadArea &&
                x + width > ia.x - spreadArea &&
                y < ia.y + height + spreadArea &&
                y + height > ia.y - spreadArea
              ) {
                person.send("INFECT")
              }
            }

            person.send("TICK")
          }

          infectionAreas.length = 0
        }, 50)

        return () => clearInterval(tick)
      },
    },
  }
)
