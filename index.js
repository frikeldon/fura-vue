
const components = {
}

export default {
  install (app, { prefix = 'fura' } = {}) {
    for (const name in components) {
      const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      app.component(`${prefix}-${kebabName}`, components[name])
    }
  },
  components
}
