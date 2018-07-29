export const pad = (v, times = 2, char = '0') =>
  v.toString().length < times ? `${char.repeat(times - 1)}${v}` : v.toString()

export const ts = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const qs = (obj) =>
  Object.keys(obj)
    .reduce(
      (acc, k) => (acc.push(`${k}=${encodeURIComponent(obj[k])}`), acc),
      []
    )
    .join('&')

export const startCase = (str) =>
  str.replace(/\b([a-z])/g, (part) => part.toUpperCase())

export const processDraft = () => {
  if (draft.isArchived || draft.isTrashed) {
    context.fail('Draft has already been processed')
    throw new Error('Draft has already been processed')
  }
}
