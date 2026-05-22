import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export default function CounterBar({ used, remaining, percentage, MONTHLY_LIMIT }) {
  const color =
    percentage >= 90 ? 'bg-danger' : percentage >= 70 ? 'bg-warning' : 'bg-accent'

  const textColor =
    percentage >= 90 ? 'text-danger' : percentage >= 70 ? 'text-warning' : 'text-accent'

  return (
    <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2 min-w-[220px]">
      <Activity size={14} className={textColor} />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-text-secondary font-mono text-xs">buscas este mês</span>
          <span className={`font-mono text-xs font-semibold ${textColor}`}>
            {used} / {MONTHLY_LIMIT}
          </span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
