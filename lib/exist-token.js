export default (name, label) => {
  const tokenName = name.replace(/\//g, '-')

  const credential = Credential.create(
    `Exist ${tokenName}`,
    `Your ${tokenName} token for exist.io`
  )
  credential.addPasswordField(name, label)
  credential.authorize()

  return credential.getValue(name)
}
