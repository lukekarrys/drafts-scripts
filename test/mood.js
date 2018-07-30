const { ts, run, testEach, setup } = require('./utils/helpers')
const MockDate = require('mockdate')

const mood = run('mood')

testEach('it works', (t, sandbox) => {
  const initialDraft = {
    tags: ['existingtag'],
    content: [
      '3',
      'tired',
      'travel',
      'exercise run',
      'removethistag',
      '',
      'this is a longer thing. much longer.',
      '',
      'more stuff',
      '',
      'more stuff'
    ].join('\n')
  }

  setup({
    draft: initialDraft,
    HTTP: {
      request: () => ({
        success: true,
        statusCode: 200,
        responseText: JSON.stringify([
          { group: { name: 'custom' }, attribute: 'tired' },
          { group: { name: 'custom' }, attribute: 'travel' },
          { group: { name: 'custom' }, attribute: 'exercise_run' }
        ]),
        error: ''
      })
    }
  })

  const openURL = sandbox.spy()
  sandbox.stub(global.app, 'openURL').callsFake(openURL)

  MockDate.set('2018-07-23')
  mood()

  const expectedEntry = [
    `# Checkin ${ts()}`,
    '## Daily Mood - 3',
    '',
    '### Tags',
    '- tired',
    '- travel',
    '- exercise run',
    '',
    '### Gratitude',
    'this is a longer thing. much longer.',
    '',
    '### Day',
    'more stuff',
    '',
    'more stuff'
  ].join('\n')

  t.equal(openURL.callCount, 1)

  t.equal(
    openURL.args[0][0],
    `dayone://post?entry=${encodeURIComponent(
      expectedEntry
    )}&tags=${encodeURIComponent(
      ['day', 'checkin', ...initialDraft.tags, 'mood'].join(',')
    )}&journal=Mood`
  )
})

testEach('TODO: requests failing', () => {})
testEach('TODO: prompt to add unknown tags', () => {})
testEach('TODO: yesterdays date', () => {})
