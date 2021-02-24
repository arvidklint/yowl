import { useEffect, useRef, useState } from 'react'

import { call, getUserMedia, setup } from '../../peer'

import Connector from './connector'
import MyID from './my-id'
import Video from './video'

export default function Yowl() {
  const [remoteStream, setRemoteStream] = useState(null)
  const [myID, setMyID] = useState('')
  const [myStream, setMyStream] = useState(null)

  const addRemoteStream = (rs) => {
    setRemoteStream(rs)
  }

  const getStream = async () => {
    try {
      const s = await getUserMedia({ video: true, audio: false })
      setMyStream(s)
      setMyID(setup(s, addRemoteStream))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!myStream) {
      getStream()
    }
  })

  return (
    <div className="p-4">
      {myStream && (
        <>
          <Video srcObject={myStream} />
          <MyID id={myID} />
          <Connector
            stream={myStream}
            addRemoteStream={(value) => setRemoteStream(value)}
          />
        </>
      )}
      <div>
        Remote streams
        {remoteStream && <Video srcObject={remoteStream} />}
      </div>
    </div>
  )
}
