const auth = {
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_API,
  redirectUri: process.env.AUTH0_CALLBACK,
  responseType: 'token id_token',
  scope: 'openid',
}

export default auth
