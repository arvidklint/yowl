import Head from 'next/head'

export default function Page({ children, title = '', footer = null }) {
  return (
    <div className="container mx-auto">
      <Head>
        <title>Yowl {title && ` - ${title}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>

      {footer && <footer className="">{footer}</footer>}
    </div>
  )
}
