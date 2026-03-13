import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingDown, Users } from 'lucide-react'

export default function ResultCard({ oevk }) {
  const { oevk_name, county, margin, winner_votes, second_votes, winner_party, second_party } = oevk

  const marginPercent = ((margin / winner_votes) * 100).toFixed(1)
  const isTight = margin < 1000

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <Badge variant={isTight ? 'destructive' : 'secondary'} className="text-xs">
          {isTight ? '🔥 Szoros körzet!' : '📍 A te körzeted'}
        </Badge>
        <h2 className="text-2xl font-bold">{oevk_name}</h2>
        {county && <p className="text-muted-foreground text-sm">{county}</p>}
        {!isTight && (
          <p className="text-xs text-muted-foreground max-w-xs mx-auto pt-1">
            Pártlistás szavazatod minden körzetben ugyanannyit ér — és az dönti el a többséget.
          </p>
        )}
      </div>

      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6 pb-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <TrendingDown className="w-4 h-4" />
            <span>A győzelem különbség volt</span>
          </div>
          <div className="text-5xl font-black text-primary tabular-nums">
            {margin.toLocaleString('hu-HU')}
          </div>
          <div className="text-lg font-semibold text-foreground">szavazat</div>
          <div className="text-xs text-muted-foreground pt-1">
            {marginPercent}% különbség • 2022-es parlamenti választás
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Részletek
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              1. helyezett {winner_party ? `(${winner_party})` : ''}
            </span>
            <span className="font-semibold tabular-nums">
              {winner_votes.toLocaleString('hu-HU')} szav.
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              2. helyezett {second_party ? `(${second_party})` : ''}
            </span>
            <span className="font-semibold tabular-nums">
              {second_votes.toLocaleString('hu-HU')} szav.
            </span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="text-sm font-medium">Különbség</span>
            <span className="font-bold text-primary tabular-nums">
              {margin.toLocaleString('hu-HU')} szav.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
