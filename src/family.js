import outdent from 'outdent'
import DayOne from '../lib/dayone'
import { ts, startCase, processDraft } from '../lib/helpers'
import { setTags, getTags } from '../lib/journal-tags'

processDraft()

const ID_TAG = 'family'
const DATE = ts()
let { content } = draft

const tags = []

const credential = Credential.create(`Family Names`, `Info about your family`)
credential.addTextField('names', 'Your family member names (comma separated)')
credential.authorize()

const names = (credential.getValue('names') || '')
  .toLowerCase()
  .split(',')
  .filter(Boolean)
  .map((name) => name.trim())

names.forEach((name) => {
  const regex = new RegExp(`\\b${name}\\b`, 'gi')
  if (regex.test(content)) tags.push(name)
})

content = content.trim()
if (!content.startsWith('#')) {
  content = outdent`
    # ${startCase(tags.join(', '))} ${DATE}
    ${content.trim()}
  `
}

draft.content = content
setTags(ID_TAG, ...tags)
draft.update()

new DayOne({
  journal: 'Journal',
  tags: getTags(),
  entry: draft.content
}).open()
