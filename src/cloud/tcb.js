import cloudbase from '@cloudbase/js-sdk'

const ENV_ID = import.meta.env.VITE_TCB_ENV_ID

let app = null
let ready = null

export function isCloudEnabled() {
  return Boolean(ENV_ID)
}

export async function initCloud() {
  if (!isCloudEnabled()) return null
  if (ready) return ready

  ready = (async () => {
    app = cloudbase.init({ env: ENV_ID })
    const auth = app.auth({ persistence: 'local' })
    const loginState = await auth.getLoginState()
    if (!loginState) {
      await auth.signInAnonymously()
    }
    return app
  })()

  return ready
}

export async function getCloudApp() {
  if (!isCloudEnabled()) return null
  return initCloud()
}

export function dataUrlToFile(dataUrl, filename = 'dish.jpg') {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new File([bytes], filename, { type: mime })
}
