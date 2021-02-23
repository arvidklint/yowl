import cn from 'classnames'
import Page from '../components/page'

export default function Home() {
  return (
    <Page>
      <div className={containerClasses}>
        <h1 className="text-9xl">Yowl</h1>
        <button className={buttonClasses}>
          <span className="text-2xl tracking-widest">Start listening</span>
        </button>
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

const buttonClasses = cn(
  'rounded-full',
  'bg-indigo-700',
  'w-80',
  'p-2',
  'shadow-md',
  'transition-all',
  'hover:shadow-2xl',
  'hover:bg-indigo-600'
)
