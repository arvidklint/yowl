import { useEffect, useRef } from 'react'

export default function Video({ srcObject, ...props }) {
  const refVideo = useRef(null)

  useEffect(() => {
    if (!refVideo.current) return
    refVideo.current.srcObject = srcObject
    refVideo.current.addEventListener('loadedmetadata', () => {
      refVideo.current.play()
    })
  }, [srcObject])

  return <video ref={refVideo} className="w-full rounded-lg" {...props} />
}
