import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import dotenv from 'dotenv';
dotenv.config();

// async function handleSignInWithGoogle(response) {
//     const { data, error } = await supabase.auth.signInWithIdToken({
//       provider: 'google',
//       token: response.credential,
//     })
//   }

@customElement('siso')
export class SigninSignout extends LitElement {

    render() {
        return html`<div
            id="g_id_onload"
            data-client_id="${process.env.CLIENT_ID_PROD}"
            data-context="signin"
            data-ux_mode="popup"
            data-callback="handleSignInWithGoogle"
            data-nonce=""
            data-auto_select="true"
            data-itp_support="true"
            data-use_fedcm_for_prompt="true"
            ></div>

            <div
            class="g_id_signin"
            data-type="standard"
            data-shape="pill"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left"
            ></div>`
    }
}
