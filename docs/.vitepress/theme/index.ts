import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import PicoClawFooter from './PicoClawFooter.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(PicoClawFooter),
    })
  },
}
