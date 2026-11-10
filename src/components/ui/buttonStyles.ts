// Shared with link-styled buttons so a <Link> can look exactly like a <Button>.
export const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-display text-base font-bold tracking-tight transition duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

export const buttonVariants = {
  primary:
    'bg-emerald text-navy shadow-[0_6px_16px_rgb(14_34_64/0.18)] hover:bg-emerald-hover hover:shadow-[0_10px_22px_rgb(14_34_64/0.22)]',
  secondary: 'bg-navy text-white shadow-[0_6px_16px_rgb(14_34_64/0.2)] hover:bg-navy-soft',
  outline: 'border-2 border-navy bg-white text-navy hover:bg-paper',
}
