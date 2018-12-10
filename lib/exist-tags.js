export default ({ token } = {}) => {
  const http = HTTP.create()
  const response = http.request({
    url: 'https://exist.io/api/1/users/$self/attributes/?limit=1&groups=custom',
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
    .filter(({ attribute }) => attribute !== 'custom')
    .map(({ attribute }) => attribute)
}
