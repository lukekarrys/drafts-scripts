import outdent from 'outdent'
import getExistTags from '../lib/exist-tags'
import { ts, processDraft } from '../lib/helpers'
import existRequest from '../lib/exist-request'
import DayOne from '../lib/dayone'
import { setTags, getTags } from '../lib/journal-tags'

processDraft()

const [data, gratitude, ...day] = draft.content
  .trim()
  .split('\n\n')
  .filter(Boolean)

const appendTags = []
let [mood, ...rawTags] = data.toLowerCase().split('\n')

const ID_TAG = 'mood'
const NOW = new Date()
const YESTERDAY = mood.includes('yesterday') || NOW.getHours() < 16
const DATE = ts(YESTERDAY ? (NOW.setDate(NOW.getDate() - 1), NOW) : NOW)

mood = parseInt(mood, 10).toString()

if (rawTags.length) {
  const existingTags = getExistTags({
    tokenLabel: 'Token for appending custom tags',
    attribute: 'custom/append'
  })

  const [foundTags, newTags] = rawTags
    .map((tag) => tag.toLowerCase().trim())
    .reduce(
      (acc, tag) => {
        acc[existingTags.includes(tag) ? 0 : 1].push(tag)
        return acc
      },
      [[], []]
    )

  appendTags.push(...foundTags)

  if (newTags.length) {
    const p = Prompt.create()
    p.title = 'New Tags'
    p.message = `You’re adding new tags: ${newTags.join(', ')}`
    p.isCancellable = true
    p.addButton('OK')

    if (!p.show()) {
      console.log('Don’t add new tags')
    } else {
      appendTags.push(...newTags)
    }
  }

  existRequest({
    tokenLabel: 'Token for appending custom tags',
    attribute: 'custom/append',
    data: appendTags.map((tag) => ({ date: DATE, value: tag }))
  })
}

existRequest({
  tokenLabel: 'Token for updating mood',
  attribute: 'update',
  data: {
    name: 'mood',
    date: DATE,
    value: mood
  }
})

setTags(ID_TAG)

draft.content = outdent`
  # Checkin ${DATE}
  ## Daily Mood - ${mood}

  ### Tags
  ${appendTags.map((t) => `- ${t}`).join('\n')}

  ### Gratitude
  ${gratitude}

  ### Day
  ${day.join('\n\n').trim()}
`
draft.update()

if (YESTERDAY) {
  const p = Prompt.create()
  p.title = 'Yesterday!'
  p.message = 'Don’t forget to change the DayOne entry date!'
  p.addButton('OK')
  p.show()
} else {
  const cb = CallbackURL.create()
  cb.baseURL = 'streaks://x-callback-url/completed/task/p33'
  cb.open()
}

new DayOne({
  journal: 'Mood',
  tags: ['day', 'checkin', ...getTags()],
  entry: draft.content
}).open()
