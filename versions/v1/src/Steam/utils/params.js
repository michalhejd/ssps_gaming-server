export function params(apiKey, redirectUrl, state){
    return {
        "openid.ns": 'http://specs.openid.net/auth/2.0',
        "openid.mode": 'checkid_setup',
        "openid.return_to": redirectUrl,
        "openid.identity": 'http://specs.openid.net/auth/2.0/identifier_select',
        "openid.claimed_id": 'http://specs.openid.net/auth/2.0/identifier_select',
    }
}