import { useRouter } from 'next/router'

import Page from '../../components/page'
import SenderComponent from '../../components/yowl/sender'

export default function Sender() {
  const router = useRouter()
  const { id } = router.query
  return (
    <Page>
      <SenderComponent peerID={id} />
    </Page>
  )
}
