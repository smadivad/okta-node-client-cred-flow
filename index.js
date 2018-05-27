require('dotenv').config()
const express = require('express')
const OktaJwtVerifier = require('@okta/jwt-verifier')
const okta = require('@okta/okta-sdk-nodejs')
const oktaClient = new okta.Client({
  orgUrl: process.env.ORG_URL,
  token: process.env.TOKEN,
})
const request = require('request-promise')

const app = express()

const issuer = `${process.env.ORG_URL}/oauth2/${process.env.AUTH_SERVER_ID}`
const oktaJwtVerifier = new OktaJwtVerifier({ issuer })

const cache = {
  expiration: null,
  scopes: [],
}

const hasScope = async (scope) => {
  if (new Date() > cache.expiration) {
    const scopes = await request({
      uri: `${process.env.ORG_URL}/api/v1/authorizationServers/${process.env.AUTH_SERVER_ID}/scopes`,
      headers: {
        authorization: `SSWS ${process.env.TOKEN}`,
      },
      json: true,
    })

    cache.expiration = new Date()
    cache.scopes = scopes
      .filter(scope => scope.metadataPublish === 'NO_CLIENTS')
      .map(scope => scope.name)
  }

  return cache.scopes.includes(scope)
}

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

app.get('/register/:scope/:label', async (req, res) => {
  try {
    const isValidScope = await hasScope(req.params.scope)
    if (!isValidScope) throw new Error('Invalid scope')

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
      request_token_url: `${issuer}/v1/token`,
    })
  } catch (error) {
    res.json({ error: error.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
