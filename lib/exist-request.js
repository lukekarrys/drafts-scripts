import getToken from './exist-token'

const parseData = (data) =>
  Array.isArray(data)
    ? {
        // Cant figure out how to get exist and http's encoding to play nicely
        // together. If fixed it'd be possible to bypass postpass entirely
        data: data.map((d) => JSON.stringify(d)).join(','),
        parse: true
      }
    : { data }

export default ({ attribute, data, tokenLabel, fail = true } = {}) => {
  const http = HTTP.create()
  const token = getToken(attribute, tokenLabel)

  const response = http.request({
    url: 'https://postpass.now.sh',
    method: 'POST',
    data: Object.assign(parseData(data), {
      url: `https://exist.io/api/1/attributes/${attribute}/`
    }),
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (fail && !response.success) {
    context.fail(
      JSON.stringify({
        error: response.error,
        text: response.responseText,
        code: response.statusCode
      })
    )
  }

  return response
}
