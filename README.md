# A Secure Node API using OAuth 2.0 Client Credentials

This example app shows how to use Node and Express to build an API that supports OAuth 2.0's client credentials. 

Please read [Secure a Node API with OAuth 2.0 Client Credentials](https://developer.okta.com/blog/2018/06/06/node-api-oauth-client-credentials) to see how this app was created.

**Prerequisites:** [Node.js](https://nodejs.org/).

> [Okta](https://developer.okta.com/) has Authentication and User Management APIs that reduce development time with instant-on, scalable user infrastructure. Okta's intuitive API and expert support make it easy for developers to authenticate, manage, and secure users and roles in any application.

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

To install this example application, run the following commands:

```bash
git clone https://github.com/oktadeveloper/okta-node-client-credentials-flow-example.git
cd okta-node-client-credentials-flow-example
```

This will get a copy of the project installed locally. To install all of its dependencies, run:

```bash
npm install
```

To run the app:
 
```bash
npm run dev
```

Then, in a separate terminal window, run the following test to connect to it.

```bash
node test.js
```

### Setup Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don’t have an account) and navigate to **Applications** > **Add Application**. Click **Single-Page App**, click **Next**, and give the app a name you’ll remember. Click **Done**.

#### Create an Authorization Server

The authorization server is where clients can request a token to use on your API server. Inside the Okta dashboard, click on the **API** tab in the header, then select the **Authorization Servers** tab. Click **Add Authorization Server**, then give your server a useful name and description. The `Audience` should be an absolute path for the server that will be consuming the tokens.

Once you create the authorization server, you will need a scope for your clients to access. Click the **Scopes** tab and add a scope. You can have many of these, which can help define what parts of the API are being used, or even who is using it.

Now that you have a scope, you also need to specify some rules to say who has access to it. Click the **Access Policies** tab and create a new policy. For now, just allow access to `All clients`. Then click **Add Rule** and give it a name. Since this is only for client credentials, remove the other grant types for acting on behalf of a user (`Authorization Code`, `Implicit`, and `Resource Owner Password`) so the only grant type is `Client Credentials`. Aside from that, just use the default settings for now.

Back on the **Settings** tab, take note of the **Issuer**. This is the address clients will use to request a token, and what your API server will use to verify that those tokens are valid.

#### Create a Test Client

In your Okta dashboard, click on **Applications** in the top header. Applications are also known as clients, so this is where you can create a test client. Click **Add Application** and choose **Service** (Machine-to-Machine). The only information it needs is a name, so you can use something like `Test Client`. This will give you the credentials for your client (in this testing case, that would be you).

#### Configure Settings

Modify `.env` to use the settings you specified above.

```bash
ISSUER=https://{yourOktaDomain}/oauth2/abcdefg1234567
DEFAULT_SCOPE=such_scope
TEST_CLIENT_ID={yourClientId}
TEST_CLIENT_SECRET={yourClientSecret}
```

**NOTE:** The value of `{yourOktaDomain}` should be something like `dev-123456.oktapreview.com`. Make sure you don't include `-admin` in the value!

## Links

This example uses the following libraries provided by Okta:

* [Okta JWT Verifier](https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier)

## Help

Please post any questions as comments on the [blog post](https://developer.okta.com/blog/2018/06/06/node-api-oauth-client-credentials), or visit our [Okta Developer Forums](https://devforum.okta.com/). You can also email developers@okta.com if would like to create a support ticket.

## License

Apache 2.0, see [LICENSE](LICENSE).
