import dynamic from 'next/dynamic'
import { isBrowser } from '../../utils/browser'

const Listener = dynamic(() => import('./listener'))

export default function Yowl() {
  return <>{isBrowser() && <Listener />}</>
}
