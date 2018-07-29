import outdent from 'outdent'
import DayOne from '../lib/dayone'
import { processDraft } from '../lib/helpers'
import { setTags, getTags } from '../lib/journal-tags'

processDraft()

const VALID_TYPES = ['tv', 'movie', 'book', 'music']

const ID_TAG = 'media'
const [type, title, score, ...review] = draft.content
  .split('\n')
  .filter(Boolean)
  .map((l) => l.trim())
const tags = [ID_TAG, type]

if (!VALID_TYPES.includes(type)) {
  throw new Error(`${type} is not a valid type`)
}

const fullReview = review
  .filter(Boolean)
  .join('\n\n')
  .trim()

if (!fullReview.length) tags.push('todo')
setTags(...tags)

draft.content = outdent`
  # ${title}
  ### Score ${score}

  ${fullReview}
`

draft.update()

new DayOne({
  journal: 'Media',
  tags: getTags(),
  entry: draft.content
}).open()
