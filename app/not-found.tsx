import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h1 className="text-[15px] font-medium">404</h1>
      <p className="mt-5 text-[15px] leading-[1.7]">
        This page doesn&apos;t exist.{' '}
        <Link href="/" className="chip">
          ← back home
        </Link>
      </p>
    </div>
  )
}
