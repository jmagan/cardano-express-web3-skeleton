const prompt = require('prompt')
const {
  createCOSEKey,
  createRewardAddress,
  createFakePrivateKey,
  createCOSESign1Signature
} = require('./test/helpers/auth')
prompt.start()

prompt.message = ''
prompt.delimiter = ':'

const host = 'HOST'

const getPayload = async () => {
  const actionPrompt = await prompt.get({
    name: 'action',
    description: 'Action',
    message: 'Valid inputs: S, R or L',
    pattern: '[SRLsrl]'
  })

  switch (actionPrompt.action) {
    case 'S':
    case 's':
      console.log(`\u{1F916} Creating signup payload.`)
      const signupPrompt = await prompt.get([
        {
          name: 'name',
          description: 'User name'
        },
        {
          name: 'email',
          description: 'User email'
        }
      ])

      return {
        host,
        action: 'Sign up',
        name: signupPrompt.name,
        email: signupPrompt.email
      }
    case 'R':
    case 'r':
      console.log(`\u{1F916} Creating reset payload.`)
      return {
        host,
        action: 'Reset'
      }
    case 'L':
    case 'l':
      console.log(`\u{1F916} Creating login payload.`)
      return {
        host,
        action: 'Login'
      }
  }
}

const main = async () => {
  console.log(
    `\u{1F916} Please, select the action for the payload (S: Signup, R: Reset, L: Login)`
  )

  const payload = await getPayload()

  console.log(
    `\u{1F916} Choose a number between 0 and 254. Each number represents a unique address and private key. For example in the sample data, the number 0 is the wallet for admin and the number 1 for the simple user. `
  )
  const walletNumberPrompt = await prompt.get({
    name: 'walletNumber',
    description: 'Wallet number',
    type: 'integer',
    minimum: 0,
    maximum: 254,
    message: 'Integer between 0 and 254'
  })

  const walletNumber = walletNumberPrompt.walletNumber

  const privateKey = createFakePrivateKey(walletNumber)
  const stakeAddress = createRewardAddress(privateKey)
  const coseKey = createCOSEKey(privateKey)
  const adminResetCoseSign1 = createCOSESign1Signature(
    payload,
    stakeAddress,
    privateKey
  )

  console.log(`\u{1F916} Generating wallet address, key and signature.\n`)

  console.log(
    `\u{1F4EA} Address: \x1b[34m${stakeAddress
      .to_address()
      .to_bech32()}\x1b[0m\n`
  )

  console.log(
    `\u{1F511} Key: \x1b[36m${Buffer.from(coseKey.to_bytes()).toString(
      'hex'
    )} \x1b[0m\n`
  )
  console.log(
    `\u{1F4DD} Signature: \x1b[35m${Buffer.from(
      adminResetCoseSign1.to_bytes()
    ).toString('hex')} \x1b[0m`
  )
}

main()
