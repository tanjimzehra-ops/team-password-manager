import { Card, CardContent } from "@/components/ui/card"

export function CapabilitiesGrid() {
  const capabilities = [
    {
      title: "SMO Solar Intellectual property & licenses rights",
      color: "bg-secondary text-secondary-foreground",
    },
    { title: "Revenue, surplus & investment", color: "bg-primary text-primary-foreground" },
    {
      title: "MERA plant & technology production, operability & reliability",
      color: "bg-accent text-accent-foreground",
    },
    {
      title: "Attraction & retention of high performing team aligned to culture",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Infrastructure, operations & quality support systems & technology",
      color: "bg-primary text-primary-foreground",
    },
    {
      title: "Strategic partnerships, alliances, networks, distribution and support channels",
      color: "bg-accent text-accent-foreground",
    },
    {
      title: "Data & information to support strategic, operational research management & innovation",
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Rigorous, contemporary governance & management system - opportunity & risk",
      color: "bg-primary text-primary-foreground",
    },
    { title: "Policy & Permit System", color: "bg-accent text-accent-foreground" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {capabilities.map((capability, index) => (
        <Card
          key={index}
          className={`${capability.color} border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[-1px] hover:translate-y-[-1px]`}
        >
          <CardContent className="p-5">
            <p className="text-sm font-medium leading-relaxed">{capability.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
