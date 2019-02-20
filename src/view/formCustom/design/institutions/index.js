import institutions from './institutions'

institutions.install = (Vue, options) => {
  Vue.component('institutions', institutions)
}

export default institutions
