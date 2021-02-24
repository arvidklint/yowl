import cn from 'classnames'

import { isBrowser } from '../utils/browser'

import Page from '../components/page'
import Yowl from '../components/yowl'

export default function Home() {
  return (
    <Page>
      <div className={containerClasses}>
        <h1 className="text-9xl">Yowl</h1>
        {isBrowser() && <Yowl />}
      </div>
    </Page>
  )
}

const containerClasses = cn(
  'flex',
  'flex-col',
  'justify-center',
  'items-center',
  'h-screen'
)
