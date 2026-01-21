import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function CultureBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 px-6 py-6 shadow-lg border border-border">
      <div className="flex items-center justify-between gap-4">
        <Button size="icon" variant="ghost" className="text-foreground/70 hover:text-foreground hover:bg-accent shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <p className="text-center text-sm md:text-base font-medium text-foreground leading-relaxed">
          Delivered in a transparent, respectful culture of local collaboration with a focus on sustainable operational
          outcomes, performance & societal benefits
        </p>

        <Button size="icon" variant="ghost" className="text-foreground/70 hover:text-foreground hover:bg-accent shrink-0">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
