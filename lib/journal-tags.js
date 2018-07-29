const DEFAULT_TAG = 'journal'

export const getTags = () => draft.tags.filter((t) => t !== DEFAULT_TAG)

export const setTags = (...tags) => {
  draft.addTag(DEFAULT_TAG)
  tags.forEach((tag) => draft.addTag(tag))
  draft.update()
}
