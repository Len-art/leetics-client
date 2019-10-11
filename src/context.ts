import { detect } from 'detect-browser'

function getUrl() {
  return { url: window.location.href }
}

function detectBrowser() {
  const browserInfo = detect()
  if (!browserInfo) {
    return
  }
  return {
    browser: browserInfo.name,
    browserVersion: browserInfo.version || undefined,
    os: browserInfo.os,
  }
}

function getViewport() {
  return { viewport: `w:${window.innerWidth}h:${window.innerHeight}` }
}

export default () => ({
  ...getUrl(),
  ...detectBrowser(),
  ...getViewport(),
})
