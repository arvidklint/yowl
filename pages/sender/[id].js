import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import Page from '../../components/page'

const SenderComponent = dynamic(() => import('../../components/yowl/sender'), {
  ssr: false,
})

export default function Sender() {
  const router = useRouter()
  const { id } = router.query
  return (
    <Page>
      <SenderComponent peerID={id} />
    </Page>
  )
}
