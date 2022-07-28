import { useNavigate } from "react-router";

import { storeCredentials, storeUid } from "@/utils/credentialManager";
import { API } from "@/utils/trpc/trpc";

import { useState } from "react";
import ActionButton from "@/components/ActionButton";
import { TRPCClientError } from "@trpc/client";

/**
 * Login component handler. Handles the callback functions and some initial data requests.
 * 
 */
const LoginPage: React.FC = () => {
	// TODO: check if User already has existing valid credentials
	const navigator = useNavigate();

	/**
	 * tRPC mutation for logging in the User.
	 */
	const login = API.useMutation(["auth.login"], {
		onSuccess(data) {
			// Cache User credentials
			storeCredentials({
				jwt: data.jwt,
				refreshToken: data.refreshToken,
				userObject: data.user
			});
			storeUid(data.uid);

			// Navigate to Chat
			navigator("/");
		}
	});

	// Call the tRPC mutation.
	async function onLoginButtonPressed(email: string, password: string) {
		try {
			await login.mutateAsync({ email: email, password: password });
		} catch (error) {
		}
	}

	return (
		<LoginComponent
			onLoginButtonPressed={onLoginButtonPressed}
		/>
	);
}



interface LoginComponentProps {
	onLoginButtonPressed?: (email: string, password: string) => Promise<void>
}

/**
 * Component wrapper for LoginPage.
 * @param onLoginButtonPressed Callback function for when the Login button is pressed. 
 */
const LoginComponent: React.FC<LoginComponentProps> = ({
	onLoginButtonPressed
}) => {
	const [emailField, setEmailField] = useState("");
	const [passwordField, setPasswordField] = useState("");
	const [isQuerying, setIsQuerying] = useState(true);

	function onEmailChanged(event: React.ChangeEvent<HTMLInputElement>) {
		const { value } = event.target;
		setEmailField(value);
	}

	function onPasswordChanged(event: React.ChangeEvent<HTMLInputElement>) {
		const { value } = event.target;
		setPasswordField(value);
	}

	async function _onLoginButtonPressed() {
		if (onLoginButtonPressed) {
			setIsQuerying(false)
			await onLoginButtonPressed(emailField, passwordField)
			setIsQuerying(true)
		}
	}

	return (
		<main className="Login w-full">
			<section className="grid grid-cols-1 md:grid-cols-2">
				{/* Left area */}
				<div className="md:grid items-center justify-center hidden">
					<img
						className="w-64 h-64"
						src={`${process.env.PUBLIC_URL}/images/chatbox-logo.svg`}
						alt="ChatApp logo">
					</img>
				</div>
				{/* Right area */}
				<div className="flex justify-center items-center text-center bg-theme-darkgreen">
					<div className="flex flex-col py-8 mx-5 h-full justify-center">
						{/* Chatbox logo visible only on mobile */}
						<img
							className="mx-auto h-2/6 sm:block md:hidden"
							src={`${process.env.PUBLIC_URL}/images/chatbox-logo.svg`}
							alt="Logo"
						></img>
						<span className="pl-1.5 text-3xl text-white font-bold sm:block md:hidden ml-auto">ChatBox</span>
						<p className="md:mt-auto sm:mt-2 text-left text-green-700 text-sm font-semibold">Email Address</p>
						<input type="email"
							className="text-sm md:mt-2 sm:mt-1 mb-2 p-2 rounded-lg md:w-64"
							placeholder="Email Address..."
							name="email"
							onChange={onEmailChanged}
							value={emailField}
						></input>
						<p className="sm:mt-2 text-left text-green-700 text-sm font-semibold">Password</p>
						<input type="password"
							className="text-sm mb-2 p-2 rounded-lg w-64"
							placeholder="Password..."
							name="password"
							onChange={onPasswordChanged}
							value={passwordField}
						></input>
						<ActionButton
							actionLabel="Login"
							loadingLabel="Loading..."
							success={isQuerying}
							onActionButtonPressed={_onLoginButtonPressed}
							className="mb-3 ml-auto py-1 px-4 text-white bg-theme-green rounded-lg font-bold hover:bg-green-500"
						/>
						<a
							className="text-gray-300 mb-auto ml-auto text-xs text-theme-green hover:text-green-400 transition"
							href="/under-construction"
						>Forgot your password?</a>
						<div
							className="text-white py-4"
						>Don't have an account? Click <a
							className="text-theme-green hover:text-green-400 transition"
							href="/register"
						>here</a>
						</div>
					</div>
				</div>

			</section>
		</main>
	);
}

export default LoginPage;
