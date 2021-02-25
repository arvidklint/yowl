import QRCode from 'qrcode.react'

export default function QR({ value }) {
  return (
    <>
      <QRCode value={value} />
      <div>{value}</div>
    </>
  )
}
