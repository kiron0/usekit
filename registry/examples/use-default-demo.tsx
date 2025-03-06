import { Button } from "@/components/ui/button"
import { useDefault } from "registry/hooks/use-default"

export default function UseDefaultDemo() {
  const initialState = { name: "Tyler" }
  const defaultState = { name: "Ben" }

  const [user, setUser] = useDefault(initialState, defaultState)

  return (
    <div className="space-y-4 flex flex-col justify-center items-center text-center">
      <div className="space-x-2">
        <Button
          title="Sets the value to Lynn"
          className="link"
          onClick={() => setUser({ name: "Lynn" })}
        >
          Lynn
        </Button>
        <Button
          title="Sets the value to Tyler"
          className="link"
          onClick={() => setUser({ name: "Tyler" })}
        >
          Tyler
        </Button>
        <Button
          title="Sets the value to null causing it to use the default value"
          className="link"
          onClick={() => setUser(null)}
        >
          Null
        </Button>
      </div>
      <p className="text-muted-foreground text-balance">
        Clicking on the buttons will set the user object to different values.
        When the &quot;Null&quot; button is clicked, the user object will be set
        to the default value: {JSON.stringify(defaultState)}.
      </p>
      <pre>
        <code>{JSON.stringify(user)}</code>
      </pre>
    </div>
  )
}
