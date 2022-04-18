import { assign, createMachine } from "xstate"
import { worldProps, personProps, sicknessProps } from "./props"

interface PersonContext {
  x: number
  y: number
  movement: number
}

export function createPerson(id: number) {
  return createMachine(
    {
      id: `person-${id}`,
      context: { x: 0, y: 0, movement: 1 } as PersonContext,
      initial: "notInfected",
      states: {
        notInfected: {
          on: {
            INFECT: {
              target: "infected",
            },
          },
        },
        infected: {
          after: {
            [sicknessProps.preContagious]: "contagious",
          },
        },
        contagious: {
          after: {
            [sicknessProps.contagious]: "sick",
          },
        },
        sick: {
          entry: "beStill",
          after: {
            [sicknessProps.sick]: "immune",
          },
        },
        immune: {
          entry: "startMoving",
          after: {
            [sicknessProps.immune]: "notInfected",
          },
        },
      },
      on: {
        TICK: {
          actions: ["idling"],
        },
      },
    },
    {
      actions: {
        idling: assign({
          x: ({ x, movement }) => {
            const newX =
              x + Math.random() * movement * (Math.random() < 0.5 ? -1 : 1)
            return Math.min(
              Math.max(newX, 0),
              worldProps.width - personProps.height
            )
          },
          y: ({ y, movement }) => {
            const newY =
              y + Math.random() * movement * (Math.random() < 0.5 ? -1 : 1)
            return Math.min(
              Math.max(newY, 0),
              worldProps.height - personProps.height
            )
          },
        }),
        beStill: assign<PersonContext>({
          movement: () => 0.3,
        }),
        startMoving: assign<PersonContext>({
          movement: () => Math.random() * 3,
        }),
      },
    }
  )
}
