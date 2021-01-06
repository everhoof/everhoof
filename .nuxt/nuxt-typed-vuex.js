import { getAccessorFromStore } from 'typed-vuex'

import { createStore } from '/root/TeamCity/buildAgent/work/5c699737d0887f4a/.nuxt/store'

const storeAccessor = getAccessorFromStore(createStore())

export default async ({ store }, inject) => {
  inject('accessor', storeAccessor(store))
}
