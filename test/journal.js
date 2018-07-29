const { run, testEach, setup } = require('./utils/helpers')

const journal = run('journal')

testEach('it works', (t, sandbox) => {
  const initialDraft = {
    tags: ['tag1'],
    content: 'This is the draft content'
  }

  setup({
    draft: initialDraft
  })

  const openURL = sandbox.spy()
  sandbox.stub(global.app, 'openURL').callsFake(openURL)

  journal()

  t.equal(openURL.callCount, 1)
  t.equal(
    openURL.args[0][0],
    `dayone://post?entry=${encodeURIComponent(
      initialDraft.content
    )}&tags=${initialDraft.tags.join(',')}&journal=Journal`
  )
})

testEach('it bails on an already archived draft', (t) => {
  setup({
    draft: {
      isArchived: true
    }
  })

  t.throws(() => journal(), 'Draft has already been processed')
})

testEach('it bails on an already trashed draft', (t) => {
  setup({
    draft: {
      isTrashed: true
    }
  })

  t.throws(() => journal(), 'Draft has already been processed')
})
