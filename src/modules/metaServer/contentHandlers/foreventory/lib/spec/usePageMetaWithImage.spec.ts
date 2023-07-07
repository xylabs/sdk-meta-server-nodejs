import { Meta } from '@xyo-network/sdk-meta'

import { usePageMetaWithImage } from '../usePageMetaWithImage'

const testHtml = `
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="Own your piece of XYO's Decentralized Digital World!" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.json" />
  <title>XYO 2.1</title>
  <link href="https://fonts.googleapis.com/css?family=Nunito+Sans|Lexend+Deca|Rock+Salt|Source+Code+Pro&display=swap"
    rel="stylesheet">
  <meta property="og:url" content="https://explore.xyo.network" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="XYO 2.1 Explore" />
  <meta property="og:description" content="Explore the XYO 2.1 Blockchain" />
  <meta property="og:image" content="https://explore.xyo.network/meta-image-explore.jpg" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:image" content="https://explore.xyo.network/meta-image-explore.jpg" />
  <meta property="twitter:site" content="@OfficialXYO" />
  <meta property="twitter:creator" content="@OfficialXYO" />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-795QBPW744"></script>
  <script>function gtag() { dataLayer.push(arguments) } window.dataLayer = window.dataLayer || [], gtag("js", new Date), gtag("config", "G-795QBPW744")</script>
  <style>
    html {
      overflow-y: auto;
      overflow-x: hidden
    }

    #root,
    body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0
    }
  </style>
  <script defer="defer" src="/static/js/main.ae7f7033.js"></script>
  <link href="/static/css/main.026e3fe6.css" rel="stylesheet">
</head>

<body style="padding:0;margin:0;overflow-x:hidden"><noscript><iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-W2TFNXL" height="0" width="0"
      style="display:none;visibility:hidden"></iframe></noscript><noscript>You need to enable JavaScript to run this
    app.</noscript>
  <div id="root"></div>
</body>

</html>
`
const title = 'New Title'
const testMeta: Meta = {
  description: 'New Description',
  og: {
    image: 'https://www.fillmurray.com/200/300',
    title,
    type: 'website',
    url: 'https://test.xyo.network',
  },
  title,
  twitter: {
    card: 'summary_large_image',
    image: { url: 'https://www.placecage.com/400/300' },
    title,
  },
}

const expectedMeta: Meta = {
  description: 'Explore the XYO 2.1 Blockchain',
  og: {
    image: 'https://explore.xyo.network/meta-image-explore.jpg',
    title: 'XYO 2.1 Explore',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    image: { url: 'https://explore.xyo.network/meta-image-explore.jpg' },
    title: 'XYO 2.1 Explore',
  },
}

const verifyHtmlContainsMeta = (html: string, path: string, meta: Meta) => {
  expect(html.length).toBeGreaterThan(testHtml.length)
  expect(html).toContain(meta.title)
  expect(html).toContain(meta.description)
  expect(html).toContain(meta.og?.image)
  expect(html).toContain(meta.og?.title)
  expect(html).toContain(meta.og?.type)
  expect(html).toContain(path)
  expect(html).toContain(meta.twitter?.card)
  expect(html).toContain(meta.twitter?.image?.url)
  expect(html).toContain(meta.twitter?.title)
}

describe('usePageMetaWithImage', () => {
  describe('for Payload URLs sets standard meta fields', () => {
    const cases: string[] = ['']
    it.each(cases)('sets fields based on the  %s', async (path) => {
      const newHtml = await usePageMetaWithImage(path)
      const expected: Meta = { ...expectedMeta, title }
      verifyHtmlContainsMeta(newHtml, path, expected)
      expect(newHtml).toContain(title)
    })
  })
})
