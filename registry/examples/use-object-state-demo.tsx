import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useObjectState } from "registry/hooks/use-object-state"

interface TeamStats {
  team: string
  wins: number
  losses: number
  championships: number
}

const initialState: TeamStats = {
  team: "Utah Jazz",
  wins: 2138,
  losses: 1789,
  championships: 0,
}

export default function UseObjectStateDemo() {
  const [stats, setStats] = useObjectState<TeamStats>(initialState)

  const addWin = () => {
    setStats((s) => ({
      wins: s.wins + 1,
    }))
  }

  const addLoss = () => {
    setStats((s) => ({
      losses: s.losses + 1,
    }))
  }

  const addChampionship = () => {
    setStats((s) => ({
      championships: s.championships + 1,
    }))
  }

  const reset = () => {
    setStats(initialState)
  }

  return (
    <div className="space-y-6 overflow-hidden text-center">
      <h1 className="text-2xl font-semibold underline">Team Statistics</h1>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="link" onClick={addWin}>
          Add Win
        </Button>
        <Button variant="link" onClick={addLoss}>
          Add Loss
        </Button>
        <Button variant="link" onClick={addChampionship}>
          Add Championship
        </Button>
        <Button variant="link" onClick={reset}>
          Reset
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {(Object.keys(stats) as Array<keyof TeamStats>).map((key) => (
              <TableHead key={key} className="min-w-24 text-start capitalize">
                {key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {(Object.keys(stats) as Array<keyof TeamStats>).map((key) => (
              <TableCell key={key} className="text-start">
                {stats[key]}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
