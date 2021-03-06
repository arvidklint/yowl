export const isBrowser = () => typeof window !== 'undefined'

export function getUserMedia({ video = true, audio = false }) {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ video, audio })
      .then((stream) => {
        return resolve(stream)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export function closeUserMedia(stream) {
  if (!stream) return
  stream.getTracks().forEach(function (track) {
    if (track.readyState == 'live') {
      track.stop()
    }
  })
}
