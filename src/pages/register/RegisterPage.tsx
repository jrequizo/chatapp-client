import React, { useRef } from "react";

import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from 'react-hook-form'

import { TRPCClientError } from "@trpc/client";
import { API } from "@/utils/trpc/trpc";

import { storeCredentials, storeUid } from "@/utils/credentialManager";
import ActionButton from "@/components/ActionButton";

type RegisterFormValues = {
	email: string
	username: string
	password: string
}
/**
 * Register component handler. Handles the callback functions and some initial data requests.
 * 
 */
const RegisterPage: React.FC = () => {
	// TODO: check if User already has existing valid credentials

	const navigator = useNavigate()

	const emailRef = useRef<HTMLInputElement | null>(null);
	const usernameRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);

	const { register, handleSubmit, setError, trigger, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>();

	const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => await onRegisterButtonPressed(data);

	/**
	 * tRPC mutation for logging in the User.
	 */
	const registerMutation = API.useMutation(["account.register"], {
		onSuccess(data) {
			if (data) {
				// Cache User credentials
				storeCredentials({
					jwt: data.jwt,
					refreshToken: data.refreshToken,
					userObject: data.user
				})
				storeUid(data.uid)

				// Navigate to Chat
				navigator("/")
			}
		},
	})

	const { ref: emailHookRef, ...emailHook } = register("email", {
		required: {
			value: true,
			message: "Email field empty."
		},
	})
	const { ref: usernameHookRef, ...usernameHook } = register("username", {
		required: {
			value: true,
			message: "Username field empty."
		},
	})
	const { ref: passwordHookRef, ...passwordHook } = register("password", {
		required: {
			value: true,
			message: "Password field empty."
		},
	})

	/**
	 * Handlers for auto-moving focus from Input elements when `Enter` key is pressed.
	 */
	function onEmailEnterPressed(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter' && usernameRef.current) {
			usernameRef.current.focus();
		}
	}
	function onUsernameEnterPressed(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter' && passwordRef.current) {
			passwordRef.current.focus();
		}
	}
	async function onPasswordEnterPressed(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter') {
			// No other elements to focus on, act as a pseudo-submit action
			await handleSubmit(onSubmit)()
		}
	}

	// Call the tRPC mutation.
	async function onRegisterButtonPressed(data: { email: string, username: string, password: string }) {
		try {
			await registerMutation.mutateAsync(data)
		} catch (error) {
			if (error instanceof TRPCClientError) {
				if (error.data.httpStatus === 400) {
					handleValidationErrors(error.message);
				} else if (error.data.httpStatus === 409) {
					handleRegistrationErrors(error.message)
				}
			}
		}
	}

	/**
	 * 
	 */
	function handleValidationErrors(errorMessage: string) {
		if (errorMessage === "auth/invalid-email") {
			setError("email", {
				type: "custom",
				message: "Invalid email."
			}, {
				shouldFocus: false
			});
		} else if (errorMessage === "auth/email-already-exists") {
			setError("email", {
				type: "custom",
				message: "Email already in use."
			}, {
				shouldFocus: false
			});
		} else {
			const errors = JSON.parse(errorMessage) as Array<any>;

			errors.forEach((error) => {
				let path: "email" | "username" | "password" | undefined = error.path[0] ?? undefined;
				if (path) {
					setError(path, {
						type: "custom",
						message: error.message
					}, {
						shouldFocus: false
					});
				}
			});
		}
	}
	/**
	 * 
	 */
	function handleRegistrationErrors(errorMessage: string) {
		const errors = JSON.parse(errorMessage) as Array<any>;

		errors.forEach((error) => {
			let path: "email" | "username" | "password" | undefined = undefined;

			if (error === "Email already in use.") path = "email";
			if (error === "Username already in use.") path = "username";

			if (path) {
				setError(path, {
					type: "custom",
					message: error
				}, {
					shouldFocus: false
				});
			}
		});
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

						<span className="pl-1.5 text-3xl text-white font-bold sm:block md:hidden ml-auto">Register</span>
						<span className={`md:mt-auto sm:mt-2 text-left text-green-700 text-sm font-semibold ${(!emailRef.current?.reportValidity() && "mb-2")}`}>Email Address</span>
						{emailRef.current?.reportValidity() && <span className="mr-auto text-rose-500 text-xs p-1 pt-0">{errors.email?.message}</span>}
						<input
							className="text-sm mb-2 p-2 rounded-lg w-64 focus:outline-none invalid:outline-red-400"
							placeholder="Email Address..."
							onKeyDown={onEmailEnterPressed}
							{...emailHook}
							ref={(e) => { emailHookRef(e); emailRef.current = e; }}
						></input>

						<span className={`sm:mt-2 text-left text-green-700 text-sm font-semibold ${(!usernameRef.current?.reportValidity() && "mb-2")}`}>Usernanme</span>
						{usernameRef.current?.reportValidity() && <span className="mr-auto text-rose-500 text-xs p-1 pt-0">{errors.username?.message}</span>}
						<input
							type="username"
							className="text-sm mb-2 p-2 rounded-lg w-64 focus:outline-none invalid:outline-red-400"
							placeholder="Username..."
							onKeyDown={onUsernameEnterPressed}
							{...usernameHook}
							ref={(e) => { usernameHookRef(e); usernameRef.current = e; }}
						></input>

						<span className={`sm:mt-2 text-left text-green-700 text-sm font-semibold ${(!passwordRef.current?.reportValidity() && "mb-2")}`}>Password</span>
						{passwordRef.current?.reportValidity() && <span className="mr-auto text-rose-500 text-xs p-1 pt-0">{errors.password?.message}</span>}
						<input
							type="password"
							className="text-sm mb-2 p-2 rounded-lg w-64 focus:outline-none invalid:outline-red-400"
							placeholder="Password..."
							onKeyDown={onPasswordEnterPressed}
							{...passwordHook}
							ref={(e) => { passwordHookRef(e); passwordRef.current = e; }}
						></input>

						<ActionButton
							actionLabel="Register"
							loadingLabel="Registering..."
							success={!isSubmitting}
							onActionButtonPressed={async () => {
								const isValidForm = await trigger(["email", "username", "password"], { shouldFocus: false })
								if (isValidForm) handleSubmit(onSubmit)()
							}}
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
