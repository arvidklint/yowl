import dynamic from 'next/dynamic'

const Listener = dynamic(() => import('./listener'), { ssr: false })

export default function Yowl() {
  return <Listener />
}
