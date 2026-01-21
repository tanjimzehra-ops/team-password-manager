import { initialData } from '@/data/mera-adapter'

export function HeroStatement() {
  // Get the purpose/impact from the JSON data
  const purposeRow = initialData.find(row => row.category === 'purpose')
  const impactText = purposeRow?.nodes[0]?.title || 'Strategic Purpose'

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-8 shadow-xl border border-border">
      <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="relative">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground text-center max-w-5xl mx-auto leading-tight text-balance">
          {impactText}
        </h1>
      </div>
    </div>
  )
}
