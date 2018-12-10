export default (name, label) => {
  const credential = Credential.create('Exist Token', 'Your token for exist.io')
  credential.addPasswordField(name, label)
  credential.authorize()

  return credential.getValue(name)
}
