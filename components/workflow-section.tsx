import { Badge } from "@/components/ui/badge"

export function WorkflowSection() {
  const workflow = [
    {
      label: "Understanding of need, operational & market contexts",
      color: "bg-secondary text-secondary-foreground border-2 border-border",
    },
    { label: "Marketing & conversion", color: "bg-primary text-primary-foreground border-2 border-border" },
    { label: "Contract for service and off takes", color: "bg-accent text-accent-foreground border-2 border-border" },
    {
      label: "Integration with waste collection & transport system",
      color: "bg-secondary text-secondary-foreground border-2 border-border",
    },
    { label: "Production, storage & distribution", color: "bg-primary text-primary-foreground border-2 border-border" },
    { label: "By-product & Residuals Management", color: "bg-accent text-accent-foreground border-2 border-border" },
    {
      label: "Data collection, analysis, operational and impact reporting",
      color: "bg-card text-card-foreground border-2 border-border",
    },
    { label: "Value promotion and risk management", color: "bg-secondary text-secondary-foreground border-2 border-border" },
    {
      label: "Whole system evaluation, improvement and promotion",
      color: "bg-primary text-primary-foreground border-2 border-border",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {workflow.map((step, index) => (
          <Badge
            key={index}
            variant="outline"
            className={`${step.color} px-4 py-3 text-sm font-medium whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all`}
          >
            {step.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
