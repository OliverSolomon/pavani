import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'b9pxg5gg',
    dataset: 'production',
  },
  /** Hosted Studio: https://pavani.sanity.studio */
  studioHost: 'pavani',
  deployment: {
    appId: 'xepsrnlwsad8um30i3roi0e0',
    autoUpdates: true,
  },
})
