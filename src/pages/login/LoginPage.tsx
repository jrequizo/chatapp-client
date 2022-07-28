import React, { useEffect, useRef } from "react";

import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from 'react-hook-form'

import { TRPCClientError } from "@trpc/client";
import { API } from "@/utils/trpc/trpc";

import { storeCredentials, storeUid } from "@/utils/credentialManager";
import ActionButton from "@/components/ActionButton";

type LoginFormValues = {
	email: string
	password: string
}

/**
 * LoginPage.
 */
const LoginPage: React.FC = () => {
	// TODO: check if User already has existing valid credentials
	const navigator = useNavigate();

	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);

	const { register, handleSubmit, setError, formState } = useForm<LoginFormValues>();
	
	const onSubmit: SubmitHandler<LoginFormValues> = async (data) => await onLoginButtonPressed(data);

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

	const {ref: emailHookRef, ...emailHook} = register("email", {
		required: {
			value: true,
			message: "Email field empty."
		},
	})
	const {ref: passwordHookRef, ...passwordHook} = register("password", {
		required: {
			value: true,
			message: "Password field empty."
		},
	})

	/**
	 * Handlers for auto-moving focus from Input elements when `Enter` key is pressed.
	 */
	function onEmailEnterPressed(event: React.KeyboardEvent<HTMLInputElement>) {
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

	/**
	 * 
	 */
	async function onLoginButtonPressed(data: { email: string, password: string }) {
		try {
			await login.mutateAsync(data);
		} catch (error) {
			if (error instanceof TRPCClientError) {
				handleLoginErrors(error.message)
			}
		}
	}

	/**
	 * 
	 */
	function handleLoginErrors(errorMessage: string) { 
		switch(errorMessage) {
			case "auth/user-not-found":
				setError('email', {
					type: "custom",
					message: "Email not found."
				});
				break
			case "auth/wrong-password":
				setError('password', {
					type: "custom",
					message: "Invalid password."
				});
				break
			default:
				break
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
						<span className={`md:mt-auto sm:mt-2 text-left text-green-700 text-sm font-semibold ${(!emailRef.current?.reportValidity() && "mb-2")}`}>Email Address</span>
						{emailRef.current?.reportValidity() && <span className="mr-auto text-rose-500 text-xs p-1 pt-0">{formState.errors.email?.message}</span>}
						<input type="email"
							className="text-sm mb-2 p-2 rounded-lg w-64 focus:outline-none invalid:outline-red-400"
							placeholder="Email Address..."
							onKeyDown={onEmailEnterPressed}
							ref={(e) => {emailHookRef(e); emailRef.current = e;}}
							{...emailHook}
						></input>
						<span className={`sm:mt-2 text-left text-green-700 text-sm font-semibold ${(!passwordRef.current?.reportValidity() && "mb-2")}`}>Password</span>
						{passwordRef.current?.reportValidity() && <span className="mr-auto text-rose-500 text-xs p-1 pt-0">{formState.errors.password?.message}</span>}
						<input type="password"
							className="text-sm mb-2 p-2 rounded-lg max-w-64 focus:outline-none invalid:outline-red-400 invalid:outline-solid"
							placeholder="Password..."
							onKeyDown={onPasswordEnterPressed}
							ref={(e) => {passwordHookRef(e); passwordRef.current = e;}}
							{...passwordHook}
						></input>
						<ActionButton
							actionLabel="Login"
							loadingLabel="Loading..."
							success={!formState.isSubmitting}
							onActionButtonPressed={handleSubmit(onSubmit)}
							className="mb-3 ml-auto py-1 px-4 text-white bg-theme-green rounded-lg font-bold hover:bg-green-500 disabled:bg-gray-400"
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
