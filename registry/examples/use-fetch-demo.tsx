"use client"

import * as React from "react"
import Image from "next/image"
import { useFetch } from "registry/use-fetch/use-fetch"

import { Button } from "@/components/ui/button"

type Pokemon = {
  name: string
  sprites: {
    other: {
      home: {
        front_shiny: string
      }
    }
  }
}

export default function UseFetchDemo() {
  const [count, setCount] = React.useState(1)

  const { error, data, loading } = useFetch<Pokemon>(
    `https://pokeapi.co/api/v2/pokemon/${count}`
  )

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="flex flex-col items-center justify-center gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : data ? (
          <div className="flex flex-col items-center justify-center gap-2">
            {data.sprites.other.home.front_shiny ? (
              <Image
                src={data?.sprites?.other?.home?.front_shiny || ""}
                alt={data.name}
                width={200}
                height={200}
                placeholder="blur"
                blurDataURL={data?.sprites?.other?.home?.front_shiny}
                className="border border-primary rounded-xl"
              />
            ) : (
              <p>No image</p>
            )}
            <p>{data.name}</p>
          </div>
        ) : (
          <p className="text-destructive">No data</p>
        )}
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button disabled={count < 2} onClick={() => setCount((c) => c - 1)}>
          Prev
        </Button>
        <Button className="link" onClick={() => setCount((c) => c + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}
