import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Target, Heart, TrendingUp } from 'lucide-react'

export function MainCards() {
  const cards = [
    {
      icon: Package,
      title: "Product/Service",
      description:
        "Modular, containerised, solar-powered production of electricity, green hydrogen, biochar & valued by-products from local waste streams",
      color: "bg-primary",
      iconColor: "text-primary-foreground",
    },
    {
      icon: Target,
      title: "Product/Market Fit",
      description:
        "A solar driven circular economy process optimising the match between local waste streams and market needs for green energy and fertilisers globally",
      color: "bg-secondary",
      iconColor: "text-secondary-foreground",
    },
    {
      icon: Heart,
      title: "Socio-economic Value Delivered & Created",
      description:
        "Diversion of organic waste to deliver a mix of green products and revenue streams and create direct, local environmental benefits and flow-on production & employment opportunities",
      color: "bg-accent",
      iconColor: "text-accent-foreground",
    },
    {
      icon: TrendingUp,
      title: "SGC Group",
      description:
        "SGC Group achieve target revenues and margins through value management, reputation & market positioning which achieves the scale, culture and productivity to",
      color: "bg-primary",
      iconColor: "text-primary-foreground",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={index}
            className="border-2 border-border bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <CardHeader className="space-y-4 pb-4">
              <div
                className={`h-12 w-12 ${card.color} flex items-center justify-center border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
              >
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
              <CardTitle className="text-lg font-semibold text-card-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-card-foreground leading-relaxed">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
