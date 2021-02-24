import cn from 'classnames'

import { call } from '../../peer'
import Input from '../common/input'

export default function Connector({ addRemoteStream, stream }) {
  const onConnectionId = async (id) => {
    const remoteStream = await call(id, stream)
    addRemoteStream(remoteStream)
  }

  return (
    <>
      <Input
        name="connection-id"
        onEnter={(value) => onConnectionId(value)}
        placeholder="Connection ID"
      />
      <button
        className={buttonClasses}
        onClick={(value) => onConnectionId(value)}
      >
        <span className="uppercase tracking-widest">Go</span>
      </button>
    </>
  )
}

const buttonClasses = cn(
  'rounded-full',
  'bg-indigo-600',
  'px-8',
  'py-2',
  'm-2',
  'shadow-md',
  'transition-all',
  'hover:shadow-2xl',
  'hover:bg-indigo-500'
)
