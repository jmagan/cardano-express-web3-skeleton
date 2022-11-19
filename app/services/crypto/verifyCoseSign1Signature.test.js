const { verifyCoseSign1Signature } = require('./verifyCoseSign1Signature.js')

const validKey =
  'a40101032720062158201f58b408264f9f3e597af3a7e9775ef6bb34698e789abc20694c7e39e1152adc'
const validSignature =
  '84582aa201276761646472657373581de02f2a934b95726f848ec9f4ac81d8c7db5f33ad8f764b4b19d4ed0359a166686173686564f458377b22686f7374223a22484f5354222c22616374696f6e223a225369676e207570222c226e616d65223a22222c22656d61696c223a22227d58400b616a4e0290db786abb66f1afebb6dfe0ce4850431f2502aa91d20723f216b297e45a11f5cb37baaef0426cc5745baecb9bb04b6af3ce7f0413095bb5de8107'

const invalidKey =
  'a40101032720062158201f58b408264f9f3e597af3a7e9775ef6bb34698e789abc20694c7e39e115aaaa'
const invalidSignature =
  '84582AA201276761646472657373581DE02F2A934B95726F848EC9F4AC81D8C7DB5F33AD8F764B4B19D4ED0AAAA166686173686564F458377B22686F7374223A22484F5354222C22616374696F6E223A225369676E207570222C226E616D65223A22222C22656D61696C223A22227D58400B616A4E0290DB786ABB66F1AFEBB6DFE0CE4850431F2502AA91D20723F216B297E45A11F5CB37BAAEF0426CC5745BAECB9BB04B6AF3CE7F0413095BB5DE8107'

describe('verifyCoseSign1Signature()', () => {
  it('Should verify a correct signature', async () => {
    const result = await verifyCoseSign1Signature(validKey, validSignature)
    expect(result).toBe(true)
  })

  it('Should not verify a incorrect key', async () => {
    const result = await verifyCoseSign1Signature(invalidKey, validSignature)
    expect(result).toBe(false)
  })

  it('Should not verify a incorrect tampered signature', async () => {
    const result = await verifyCoseSign1Signature(validKey, invalidSignature)
    expect(result).toBe(false)
  })
})
