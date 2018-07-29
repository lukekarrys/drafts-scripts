import DayOne from '../lib/dayone'
import { processDraft } from '../lib/helpers'
import { setTags, getTags } from '../lib/journal-tags'

processDraft()
setTags()

new DayOne({
  journal: 'Journal',
  tags: getTags(),
  entry: draft.content
}).open()
