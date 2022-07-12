import React from "react";
import { useNavigate } from "react-router";

import { storeCredentials, storeUid } from "@/utils/credentialManager";
import { API } from "@/utils/trpc/trpc";

import Register from "./components/Register";

/**
 * Login component handler. Handles the callback functions and some initial data requests.
 * 
 */
function RegisterPage() {
	// TODO: check if User already has existing valid credentials

	const navigator = useNavigate()
	
	/**
	 * tRPC mutation for logging in the User.
	 */
	const register = API.useMutation(["account.register"], {
		onSuccess(data) {
			// Cahe User credentials
			storeCredentials({
				jwt: data.jwt,
				refreshToken: data.refreshToken,
				userObject: data.user
			})
			storeUid(data.uid)

			// Navigate to Chat
			navigator("/")
		},
	})

	// Call the tRPC mutation.
	async function onRegisterButtonPressed(email: string, username: string, password: string) {
		register.mutate({email: email, username: username, password: password})
	}

	return (
		<Register 
			onButtonPressed={onRegisterButtonPressed}
		/>
	)
}

export default RegisterPage
