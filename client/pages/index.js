import cn from 'classnames'
import Page from '../components/page'

export default function Home() {
  return (
    <Page>
      <div className={containerClasses}>
        <h1 className="text-9xl">Yowl</h1>
        <button className={buttonClasses}>
          <span className="text-2xl tracking-widest">Start</span>
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
  'bg-indigo-500',
  'w-80',
  'h-80',
  'shadow-md',
  'border-8',
  'border-indigo-700',
  'transition-all',
  'hover:shadow-2xl'
)
