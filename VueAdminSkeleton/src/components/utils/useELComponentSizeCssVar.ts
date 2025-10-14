import { useLayoutStore } from "@/stores/layout"
import { computed, effectScope, onScopeDispose } from "vue"

/**
 * 获取当前elementComponent的css变量
 */
export function useElComponentSizeCssVar() {
    const layoutStore = useLayoutStore()
    const scope = effectScope()
    const state = scope.run(() => {
      return computed(() => {
        let str = '--el-component-size'
        if (['small', 'large'].includes(layoutStore.size)) {
          str += '-' + layoutStore.size
        }
        return `var(${str})`
      })
    })
    onScopeDispose(() => scope.stop())
    return state!
  }
  