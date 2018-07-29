import { qs } from './helpers'

export default class DayOne {
  constructor({ journal, tags, entry }) {
    this.journal = journal
    this.tags = tags
    this.entry = entry
    this.scheme = 'dayone://'
  }

  post() {
    const { scheme, entry, tags, journal } = this
    return `${scheme}post?${qs({
      entry: entry.trim(),
      tags: tags.join(','),
      journal
    })}`
  }

  open() {
    app.openURL(this.post())
  }
}
