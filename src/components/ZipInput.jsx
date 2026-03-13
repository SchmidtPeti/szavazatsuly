import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'

export default function ZipInput({ onSearch, loading }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim().length >= 4) {
      onSearch(value.trim())
    }
  }

  function handleChange(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setValue(v)
    if (v.length === 4) {
      onSearch(v)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          <MapPin className="w-6 h-6" />
          <span className="text-sm font-medium uppercase tracking-widest">SzavazatSúly</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Az én szavazatom<br />dönthet.
        </h1>
        <p className="text-muted-foreground text-base max-w-xs mx-auto">
          Írd be az irányítószámod, és meglátod, hány szavazaton múlt a győzelem a te körzetedben 2022-ben.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="pl. 1011"
          value={value}
          onChange={handleChange}
          className="text-center text-xl font-mono tracking-widest h-14"
          maxLength={4}
          autoFocus
        />
        <Button
          type="submit"
          className="w-full h-12"
          disabled={value.length < 4 || loading}
        >
          {loading ? 'Keresés...' : 'Megmutatom a körzetem →'}
        </Button>
      </form>
    </div>
  )
}
