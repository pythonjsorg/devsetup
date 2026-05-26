import React from 'react'

type Props = {
  stepNumber: number
  title: string
  badge?: React.ReactNode
  children: React.ReactNode
}

export default function StepCard({ stepNumber, title, badge, children }: Props) {
  return (
    <div className="flex gap-5 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Step number circle */}
      <div className="flex-shrink-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {stepNumber}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          {badge}
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
