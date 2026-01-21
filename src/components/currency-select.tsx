import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { currencyList, type CurrencyCode } from '@/lib/currencies'

export function CurrencySelect({ id, value, onChange }: {
  id: string
  value: CurrencyCode
  onChange: (value: CurrencyCode) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as CurrencyCode)}>
      <SelectTrigger id={id}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencyList.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <span className="flex items-center gap-2">
              <span>{currency.flag}</span>
              <span>{currency.code}</span>
              <span className="text-muted-foreground">({currency.symbol})</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}