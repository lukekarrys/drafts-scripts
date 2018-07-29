const { run, testEach, setup } = require('./utils/helpers')

const media = run('media')

testEach('it works', (t, sandbox) => {
  const initialDraft = {
    tags: ['existingtag'],
    // Traiing spaces are eliminated
    content: [
      'tv     ',
      'title    ',
      '3 stars    ',
      'this is what I think',
      '',
      'it was good'
    ].join('\n')
  }

  setup({
    draft: initialDraft
  })

  const openURL = sandbox.spy()
  sandbox.stub(global.app, 'openURL').callsFake(openURL)

  media()

  const expectedEntry = [
    '# title',
    '### Score 3 stars',
    '',
    'this is what I think',
    '',
    'it was good'
  ].join('\n')

  t.equal(openURL.callCount, 1)
  t.equal(
    openURL.args[0][0],
    `dayone://post?entry=${encodeURIComponent(
      expectedEntry
    )}&tags=${encodeURIComponent(
      [...initialDraft.tags, 'media', 'tv'].join(',')
    )}&journal=Media`
  )
})

testEach('it throws for a bad type', (t) => {
  const initialDraft = {
    content: 'not a type\ntitle\n3 stars\ncontent'
  }

  setup({
    draft: initialDraft
  })

  t.throws(() => media())
})

testEach('it adds todo for no content', (t, sandbox) => {
  const initialDraft = {
    content: 'tv\ntitle\n3 stars\n\n'
  }

  setup({
    draft: initialDraft
  })

  const openURL = sandbox.spy()
  sandbox.stub(global.app, 'openURL').callsFake(openURL)

  media()

  const expectedEntry = '# title\n### Score 3 stars'

  t.equal(openURL.callCount, 1)
  t.equal(
    openURL.args[0][0],
    `dayone://post?entry=${encodeURIComponent(
      expectedEntry
    )}&tags=${encodeURIComponent(
      ['media', 'tv', 'todo'].join(',')
    )}&journal=Media`
  )
})
