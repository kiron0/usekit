"use client"

import * as React from "react"
import { Pencil, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useList } from "registry/hooks/use-list"

type List = string

export default function UseListDemo() {
  const [list, { set, push, removeAt, insertAt, updateAt, clear }] =
    useList<List>(["First", "Second", "Third"])

  return (
    <div className="mx-auto w-full space-y-8 md:w-2/3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          disabled={list.length < 1}
          onClick={() => insertAt(1, "Inserted")}
        >
          Insert After First
        </Button>
        <Button disabled={list.length < 2} onClick={() => removeAt(1)}>
          Remove Second Item
        </Button>
        <Button onClick={() => set(["One", "Two", "Three"])}>
          Set New List
        </Button>
        <Button onClick={() => push("New Item")}>Push New Item</Button>
        <Button variant="destructive" onClick={() => clear()}>
          Clear
        </Button>
      </div>
      {list.length > 0 ? (
        <ListDemo list={list} update={updateAt} remove={removeAt} />
      ) : (
        <div className="rounded-md border p-4">
          <p className="text-center text-red-500">No items in the list</p>
        </div>
      )}
    </div>
  )
}

interface ListDemoProps {
  list: List[]
  update: (index: number, value: List) => void
  remove: (index: number) => void
}

function ListDemo({ list, update, remove }: ListDemoProps) {
  const [isUpdate, setIsUpdate] = React.useState<{ [key: number]: boolean }>({})
  const [updateValue, setUpdateValue] = React.useState<{
    [key: number]: string
  }>({})

  const handleUpdate = (index: number) => {
    if (!updateValue[index]) return
    update(index, updateValue[index])
    setIsUpdate((prev) => ({ ...prev, [index]: false }))
  }

  const handleCancel = (index: number) => {
    setIsUpdate((prev) => ({ ...prev, [index]: false }))
  }

  return (
    <div className="space-y-2">
      {list.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-2 rounded-md border p-4"
        >
          {isUpdate[index] ? (
            <>
              <Input
                type="text"
                value={updateValue[index] || item}
                onChange={(e) =>
                  setUpdateValue((prev) => ({
                    ...prev,
                    [index]: e.target.value,
                  }))
                }
                className="col-span-full"
              />
              <div className="col-span-full flex justify-end gap-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdate(index)}
                  disabled={!updateValue[index] || updateValue[index] === item}
                >
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCancel(index)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="col-span-full md:col-span-3">{item}</p>
              <div className="col-span-full flex justify-end gap-2 md:col-span-1">
                <Button
                  size="sm"
                  onClick={() =>
                    setIsUpdate((prev) => ({ ...prev, [index]: true }))
                  }
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
