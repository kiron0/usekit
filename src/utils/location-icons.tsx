import * as React from "react"
import {
  Clock,
  Globe,
  Hash,
  Home,
  Info,
  Link2,
  Lock,
  Phone,
  Search,
  Server,
} from "lucide-react"

export const iconMap: Record<string, React.JSX.Element> = {
  pathname: <Home className="size-5 text-blue-500" />,
  search: <Search className="size-5 text-green-500" />,
  hash: <Hash className="size-5 text-purple-500" />,
  host: <Globe className="size-5 text-yellow-500" />,
  href: <Link2 className="size-5 text-red-500" />,
  hostname: <Link2 className="size-5 text-red-500" />,
  origin: <Server className="size-5 text-indigo-500" />,
  port: <Phone className="size-5 text-pink-500" />,
  protocol: <Lock className="size-5 text-teal-500" />,
  state: <Info className="size-5 text-gray-500" />,
  length: <Clock className="size-5 text-orange-500" />,
}
