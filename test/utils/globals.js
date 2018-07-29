const _ = require('lodash')

const FUNC = () => {}
const STRING = ''
const ARR = []
const BOOL = false

const constructors = {
  Credential: {
    addPasswordField: FUNC,
    addTextField: FUNC,
    authorize: FUNC,
    getValue: FUNC
  },
  HTTP: {
    request: () => ({
      success: true,
      statusCode: 200,
      responseData: {},
      responseText: '{}',
      error: ''
    })
  },
  Prompt: {
    addButton: FUNC,
    show: FUNC
  },
  CallbackURL: {
    open: FUNC
  }
}

const statics = {
  draft: {
    content: STRING,
    tags: ARR,
    isArchived: BOOL,
    isTrashed: BOOL,
    hasTag: (t) => global.draft.tags.includes(t),
    addTag: (t) => global.draft.tags.push(t),
    update: FUNC,
    processTemplate: FUNC
  },
  app: {
    openURL: FUNC
  },
  context: {
    fail: FUNC
  }
}

module.exports = {
  setup: (props) => {
    const cKeys = Object.keys(constructors)
    const sKeys = Object.keys(statics)

    cKeys.forEach(
      (k) =>
        (global[k] = {
          create: () => _.merge({}, constructors[k], props[k])
        })
    )
    sKeys.forEach((k) => (global[k] = _.merge({}, statics[k], props[k])))

    return [...cKeys, ...sKeys].reduce(
      (acc, key) => ((acc[key] = global[key]), acc),
      {}
    )
  },
  teardown: () => {
    ;[...Object.keys(constructors), ...Object.keys(statics)].forEach(
      (k) => delete global[k]
    )
  }
}
