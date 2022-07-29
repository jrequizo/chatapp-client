import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { io, Socket } from 'socket.io-client';

import { getCredentials, getUid, storeProfile } from "@/utils/credentialManager";
import { API } from "@/utils/trpc/trpc";

import ChatProperties from "@/types/ChatProperties";

import Navbar from "@/components/Navbar/Navbar";

import MessageHandler from "./MessageHandler";
import Chatbox from "./components/ChatboxComponent";
import ChatNavigationButton from "./components/ChatNavigationButtonComponent";

const ChatPage: React.FC = () => {
	const navigator = useNavigate()

	// Retrieve credentials from localStore. The jwt will be passed into the authorization context for connecting with the Chat server.
	const [credentials] = useState(getCredentials());
	const { jwt, refreshToken, userObject } = credentials

	// If the credentials don't exist, redirect the User to the login page.
	if (!(jwt && refreshToken && userObject)) {
		navigator("/login")
	}

	// Retrieve uid from localStore. This will be used to retrieve the profile information of the User.
	const [currentUid] = useState(getUid());

	// Retrieve the User's public profile information
	// const profileQuery = API.useQuery(["profile.profileData", { uid: currentUid! }], {
	API.useQuery(["profile.profileData", { uid: currentUid! }], {
		enabled: !!currentUid,
		onSuccess(data) {
			// Cache the User's profile information
			storeProfile(data)
		},
	})

	/**
	 * Retrieve data for and populate the left Chat navigation bar.
	 */
	const [publicChatData, setPublicChatData] = useState<ChatProperties[]>([])

	// Retrieve the list of Public chats from the API.
	const publicChatQuery = API.useQuery(["chat.publicChats"], {
		onSuccess(data) {
			const _publicChatData = data.map((chat) => {
				return {
					chatId: chat.id,
					chatName: chat.name
				}
			})
			setPublicChatData(_publicChatData)
		},
	})

	/** 
	 * Handler passed to child prop to define how to implement onMessage callback.
	 * Child prop needs to call `MessageHandler.bindOnMessage(<callback>)` to execute
	 * <callback> whenever the Socket emits a `client-message` event.
	 */
	const [messageHandler] = useState<MessageHandler>(new MessageHandler())
	const [socket, setSocket] = useState<Socket>()

	
	useEffect(() => {
		const _socket = io(`${process.env.REACT_APP_SOCKET_URL}`, { transports: ['websocket'] })

		_socket.on('connect', () => {
			/**
			 * Authenticate the User once the connection to the socket.io server is established.
			 * This will emit an `authenticated` event when completed with a boolean indicating
			 * if the User successfully authenticated.
			 */
			_socket.emit("authenticate", {jwt: jwt})
		})

		/**
		 * Emission handler when the `authenticate` event is handled on the socket.io server.
		 */
		_socket.on('authenticated', (isAuthenticated) => {
			if (isAuthenticated) {
				if (publicChatData.length > 0) {
					// Join the first Chat when we are sure it exists.
					_socket?.emit("join-chat", {
						chatId: publicChatData[0].chatId,
						type: "public"
					})
				}
			} else {
				// TODO: Re-authenticate
				// For now, we'll redirect to login
				navigator("/login")
			}
		})

		/**
		 * Bind the `MessageHandler` to consume the socket.io `emit-message` event.
		 */
		_socket.on('emit-message', (data) => messageHandler.onMessage(data))

		setSocket(_socket)

		/**
		 * Clean-up functions to unbind callbacks.
		 * (May want to add a clea-up function for `MessageHandler`?)
		 */
		return () => {
			_socket.off('client-message')
			_socket.off('error')
			_socket.close()
		}

	}, [setSocket, publicChatQuery.status, jwt, messageHandler, navigator, publicChatData])

	/**
	 * Sends a Message to the socket.io server.
	 * @param message 
	 */
	function onSendMessage(message: string) {
		socket?.emit("send-message", message)
	}

	/**
	 * Callback function for when the User clicks on a Chat in the left navigation panel.
	 * Emits to the server to join the selected Chat.
	 * @param event 
	 */
	function onChatNavigationButtonPressed(event: React.MouseEvent<HTMLButtonElement>) {
		const index = parseInt(event.currentTarget.name)
		const chat = publicChatData[index]
		emitJoinChat(chat)
	}

	/**
	 * Helper function to emit a chat-join event. Used when the query to retrieve the records
	 * of existing public chats and when the User selects another chat on the left navigation panel.
	 * @param chatProperties 
	 */
	function emitJoinChat(chatProperties: ChatProperties) {
		socket?.emit("join-chat", {
			jwt: jwt,
			chatId: chatProperties.chatId,
			type: "public"
		})
	}

	return (
		// TODO: pass props
		<ChatComponent
			onSendMessage={onSendMessage}
			onChatNavigationButtonPressed={onChatNavigationButtonPressed}
			publicChats={publicChatData}
			messageHandler={messageHandler}
		/>
	)
}

/**
 * Component
 */
interface ChatComponentProps {
	// The public chats to display in the navigator.
	onSendMessage: (message: string) => void

	// Callback handler for when the User presses enter or presses the send button on the chat.
	onChatNavigationButtonPressed: (event: React.MouseEvent<HTMLButtonElement>) => void

	// Callback handler for when the User selects a Chat on the left sidebar.
	publicChats: Array<ChatProperties>

	/**
	 * onMessage callback handler, fires the attached callback when a new message is received
	 * from the Socket.IO client.
	 */
	messageHandler: MessageHandler
}

/**
 * Component wrapper for ChatPage.
 * @param {ChatComponentProps} ChatComponentProps
 * 
 * Properties:
 * * `profileData` The User's public profile data.
 * * `publicChats` The public chats to display in the navigator.
 * * `onSendMessage` Callback handler for when the User presses enter or presses the send button on the chat.
 * * `onChatNavigationButtonPressed` Callback handler for when the User selects a Chat on the left sidebar.
 * * `messageHandler` onMessage callback handler, fires the attached callback when a new message is received from the Socket.IO client.
 * @returns ChatComponent
 */
const ChatComponent: React.FC<ChatComponentProps> = ({
	// The public chats to display in the navigator.
	publicChats,

	// Callback handler for when the User presses enter or presses the send button on the chat.
	onSendMessage,

	// Callback handler for when the User selects a Chat on the left sidebar.
	onChatNavigationButtonPressed,

	/**
	 * onMessage callback handler, fires the attached callback when a new message is received
	 * from the Socket.IO client.
	 */
	messageHandler
}: ChatComponentProps) => {
	// State for currently selected Chat.
	const [activeChat, setActiveChat] = useState(0);
	const [isDisplayingChatNav, setIsDisplayingChatNav] = useState(false);

	const navigationPanelRef = useRef<HTMLDivElement>(null);

	/**
	 * Create the JSX.Element[] props for the Chat buttons on the left navigation panel.
	 */
	const chatNavigationButtons = publicChats.map((property, index) => {
		let selected = publicChats[activeChat];
		return <ChatNavigationButton
			chatName={property.chatName}
			name={index.toString()}
			key={property.chatId}
			active={selected.chatId === property.chatId}
			onClick={_onChatNavigationButtonPressed}
		/>
	})

	/**
	 * Update the local state of which Chat is selected then pass the callback back up the component tree.
	 * @param event 
	 */
	function _onChatNavigationButtonPressed(event: React.MouseEvent<HTMLButtonElement>) {
		const { name: index } = event.currentTarget;

		setActiveChat(parseInt(index))

		if (isDisplayingChatNav) {
			setIsDisplayingChatNav(false);
		}

		// Call the provided callback.
		onChatNavigationButtonPressed(event);
	}

	function onViewRoomsPressed(event: React.MouseEvent<HTMLButtonElement>) {
		// toggle the view
		setIsDisplayingChatNav(true);
	}

	return (
		<main className="Chat">
			<Navbar />
			<section>
				<div className={`w-72 w-screen sm:relative sm:flex w-screen sm:w-48 md:w-72 md:inline bg-slate-300 ${(!isDisplayingChatNav && "hidden")}`} ref={navigationPanelRef}>
					<div className="flex flex-col">
						<div className="flex">
							<button className="flex-1 font-bold bg-slate-200 hover:cursor-not-allowed text-gray-400">Private</button>
							<button className="flex-1 font-bold text-gray-400">Public</button>
						</div>
						<div className={`w-screen sm:w-48 md:w-72 grow basis-0`}>
							<h3 className="font-normal p-2">-Rooms</h3>
							<div className="h-full m-3">
								{
									chatNavigationButtons
								}
							</div>
						</div>
					</div>
				</div>
				<div className={`flex flex-1 bg-slate-200  ${(isDisplayingChatNav && "hidden")}`}>
					<Chatbox
						onSendMessage={onSendMessage}
						messageHandler={messageHandler}
						properties={publicChats[activeChat]}
						onViewRoomsPressed={onViewRoomsPressed}
					/>
				</div>
			</section>
		</main>
	)
}

export default ChatPage
