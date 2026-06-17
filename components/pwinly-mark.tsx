export function PwinlyMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-md bg-white font-bold text-[#111111]"
      style={{ width: size, height: size, fontSize: size * 0.6 }}
      aria-hidden
    >
      P
    </span>
  )
}
