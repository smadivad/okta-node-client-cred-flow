require('dotenv').config()
const express = require('express')
const OktaJwtVerifier = require('@okta/jwt-verifier')
const okta = require('@okta/okta-sdk-nodejs')
const oktaClient = new okta.Client({
  orgUrl: process.env.ORG_URL,
  token: process.env.TOKEN,
})

const app = express()

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.ISSUER,
})

app.get('/', async (req, res) => {
  try {
    const { authorization } = req.headers
    if (!authorization) throw new Error('You must send an Authorization header')

    const [authType, token] = authorization.split(' ')
    if (authType !== 'Bearer') throw new Error('Expected a Bearer token')

    await oktaJwtVerifier.verifyAccessToken(token)
    res.json('Hello World!')
  } catch (error) {
    res.json({ error: error.message })
  }
})

app.get('/register/:label', async (req, res) => {
  try {
    const application = await oktaClient.createApplication({
      name: 'oidc_client',
      label: req.params.label,
      signOnMode: 'OPENID_CONNECT',
      credentials: {
        oauthClient: {},
      },
      settings: {
        oauthClient: {
          grant_types: ['client_credentials'],
          application_type: 'service',
        },
      },
    })

    const { client_id, client_secret } = application.credentials.oauthClient

    res.json({
      client_id,
      client_secret,
      request_token_url: `${process.env.ISSUER}/v1/token`,
    })
  } catch (error) {
    res.json({ error: error.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
