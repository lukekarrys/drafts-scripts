const { ts, run, testEach, setup } = require('./utils/helpers')

const family = run('family')

const NAMES = ['Bob', 'ALICE', 'john']

testEach('it works', (t, sandbox) => {
  const initialDraft = {
    tags: ['existingtag'],
    content: 'This is a post about JOHN with no title'
  }

  setup({
    draft: initialDraft,
    Credential: {
      getValue: () => NAMES.join(',')
    }
  })

  const openURL = sandbox.spy()
  sandbox.stub(global.app, 'openURL').callsFake(openURL)

  family()

  t.equal(openURL.callCount, 1)
  t.equal(
    openURL.args[0][0],
    `dayone://post?entry=${encodeURIComponent(
      `# John ${ts()}\nThis is a post about JOHN with no title`
    )}&tags=${encodeURIComponent(
      [...initialDraft.tags, 'family', 'john'].join(',')
    )}&journal=Journal`
  )
})

testEach('it works with multiple names', (t, sandbox) => {
  const initialDraft = {
    tags: ['existingtag'],
    content: 'This is a post about John and alice and BOB with no title'
  }

  setup({
    draft: initialDraft,
    Credential: {
      getValue: () => NAMES.join(',')
    }
  })

  const openURL = sandbox.spy()
  sandbox.stub(global.app, 'openURL').callsFake(openURL)

  family()

  t.equal(openURL.callCount, 1)
  t.equal(
    openURL.args[0][0],
    `dayone://post?entry=${encodeURIComponent(
      `# Bob, Alice, John ${ts()}\n${initialDraft.content}`
    )}&tags=${encodeURIComponent(
      [...initialDraft.tags, 'family', 'bob', 'alice', 'john'].join(',')
    )}&journal=Journal`
  )
})

testEach('it works with a title', (t, sandbox) => {
  setup({
    draft: {
      content: '# Has a title\nAnd some content'
    }
  })

  const openURL = sandbox.spy()
  sandbox.stub(global.app, 'openURL').callsFake(openURL)

  family()

  t.equal(openURL.callCount, 1)
  t.equal(
    openURL.args[0][0],
    `dayone://post?entry=${encodeURIComponent(
      '# Has a title\nAnd some content'
    )}&tags=family&journal=Journal`
  )
})
