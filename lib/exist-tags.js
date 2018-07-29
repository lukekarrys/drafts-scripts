import getToken from './exist-token'

export default ({ attribute, tokenLabel } = {}) => {
  // Same as the params from mood.js for
  const token = getToken(attribute, tokenLabel)

  const http = HTTP.create()
  const response = http.request({
    url: 'https://exist.io/api/1/users/$self/attributes/?limit=1&group=custom',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.success) {
    context.fail(
      JSON.stringify({
        error: response.error,
        text: response.responseText,
        code: response.statusCode
      })
    )

    return []
  }

  return JSON.parse(response.responseText)
    .filter(
      ({ group, attribute }) =>
        group.name === 'custom' && attribute !== 'custom'
    )
    .map(({ attribute }) => attribute)
}
