import React, { useState } from "react";
import { useNavigate } from "react-router";

import { storeCredentials, storeUid } from "@/utils/credentialManager";
import { API } from "@/utils/trpc/trpc";
import ActionButton from "@/components/ActionButton";

/**
 * Register component handler. Handles the callback functions and some initial data requests.
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
		onError(error, variables, context) {
			if (error.data?.code === "BAD_REQUEST") {
				// password isn't valid
			} else if (error.data?.code === "CONFLICT") {
				// email or username in use
			}
		},
	})

	// Call the tRPC mutation.
	async function onRegisterButtonPressed(email: string, username: string, password: string) {
		try {
			await register.mutateAsync({email: email, username: username, password: password})
		} catch (error) {}
	}

	return (
		<RegisterComponent 
			onRegisterButtonPressed={onRegisterButtonPressed}
		/>
	)
}


interface RegisterComponentProps {
	onRegisterButtonPressed?: (email: string, username: string, password: string) => Promise<void>
}

/**
 * Component wrapper for ChatPage.
 * @param {RegisterComponentProps} ChatComponentProps
 */
const RegisterComponent: React.FC<RegisterComponentProps> = ({
	onRegisterButtonPressed
}: RegisterComponentProps) => {
	const [emailField, setEmailField] = useState("")
	const [usernameField, setUsernameField] = useState("")
	const [passwordField, setPasswordField] = useState("")
	const [isQuerying, setIsQuerying] = useState(false)

	const onEmailChanged = (event: React.ChangeEvent<HTMLInputElement>) => setEmailField(event.target.value)
	const onUsernameChanged = (event: React.ChangeEvent<HTMLInputElement>) => setUsernameField(event.target.value)
	const onPasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => setPasswordField(event.target.value)

	async function _onRegisterButtonPressed() {
		if (onRegisterButtonPressed) {
			setIsQuerying(true)
			await onRegisterButtonPressed(emailField, usernameField, passwordField)
			setIsQuerying(false)
		}
	}

	return (
		<main className="Login">
			<section className="grid grid-cols-1 md:grid-cols-2">

				<div className="md:grid items-center justify-center hidden">
					<img
						className="w-64 h-64"
						src={`${process.env.PUBLIC_URL}/images/chatbox-logo.svg`}
						alt="ChatApp logo">
					</img>
				</div>

				<div className="flex justify-center items-center text-center bg-theme-darkgreen">
					<div className="flex flex-col py-8 mx-5 h-full justify-center">
						{/* Chatbox logo visible only on mobile */}
						<img
							className="mx-auto h-2/6 sm:block md:hidden"
							src={`${process.env.PUBLIC_URL}/images/chatbox-logo.svg`}
							alt="Logo"
						></img>
						<span className="pl-1.5 text-3xl text-white font-bold sm:block md:hidden ml-auto">Register</span>
						<p className="md:mt-auto sm:mt-2 text-left text-green-700 text-sm font-semibold">Email Address</p>
						<input type="email"
							className="text-sm md:mt-2 sm:mt-1 mb-2 p-2 rounded-lg md:w-64"
							placeholder="Email Address..."
							name="email"
							onChange={onEmailChanged}
							value={emailField}
						></input>
						<p className="text-left text-green-700 text-sm font-semibold md:w-64">Username</p>
						<input type="username"
							className="text-sm mb-2 p-2 rounded-lg"
							placeholder="Username..."
							name="username"
							onChange={onUsernameChanged}
							value={usernameField}
						></input>
						<p className="text-left text-green-700 text-sm font-semibold md:w-64">Username</p>
						<input type="password"
							className="text-sm mb-2 p-2 rounded-lg"
							placeholder="Password..."
							name="password"
							onChange={onPasswordChanged}
							value={passwordField}
						></input>
						<ActionButton
							actionLabel="Register"
							loadingLabel="Registering..."
							success={!isQuerying}
							onActionButtonPressed={_onRegisterButtonPressed}
							className="mb-auto ml-auto py-1 px-4 text-white bg-theme-green rounded-lg font-bold hover:bg-green-500"
						/>
						<div
							className="text-white py-4"
						>Already registered? Click <a
							className="text-theme-green hover:text-theme-lightgreen transition"
							href="/login"
						>here</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

export default RegisterPage
