"use client"

import * as React from "react"
import { useFetch } from "registry/use-fetch/use-fetch"

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
    <section
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          disabled={count < 2}
          onClick={() => setCount((c) => c - 1)}
          style={{
            backgroundColor: count < 2 ? "gray" : "#0ea5e9",
            color: "white",
            paddingRight: 10,
            paddingLeft: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: 5,
            border: "none",
            cursor: "pointer",
            marginRight: 10,
          }}
        >
          Prev
        </button>
        <button
          className="link"
          onClick={() => setCount((c) => c + 1)}
          style={{
            backgroundColor: "#0ea5e9",
            color: "white",
            paddingRight: 10,
            paddingLeft: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: 5,
            border: "none",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : data ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <img
              src={data?.sprites?.other?.home?.front_shiny}
              alt={data.name}
              style={{
                width: 200,
                height: 200,
                border: "1px solid #0ea5e9",
                borderRadius: 20,
                padding: 5,
              }}
            />
          </div>
        ) : (
          <p style={{ color: "red" }}>No data</p>
        )}
      </div>
    </section>
  )
}
