import { useNavigate } from 'react-router'
import { getProfile } from '@/utils/credentialManager'


type ChatMessageComponentProps = {
	senderId: string
	senderUsername: string
	senderPfpUrl: string
	message: string
	timestamp: number
}

/**
 * Component for the individual Chat messages that appear in the `ChatboxComponent`.
 * Contains the Username title, a profile picture button that navigates to their profile, 
 * and the message contents.
 * @param {ChatMessageComponentProps} ChatMessageComponentProps
 * @returns 
 */
const ChatMessageComponent: React.FC<ChatMessageComponentProps> = ({
	senderId,
	senderUsername,
	senderPfpUrl,
	message,
	timestamp
}) => {
	const navigate = useNavigate()

	const currentUserId = getProfile()?.uid

	function onProfileIconClicked() {
		navigate(`/profile/${senderId}`)
	}

	if (senderId === currentUserId) {
		return (
			<div className="flex flex-col items-start items-end">
				<span className="px-3 py-1 font-bold">{senderUsername}</span>
				<div className="flex flex-row-reverse h-fit mx-1 my-auto mx-3 gap-2" id={senderId}>
					<button className="h-full items-baseline bg-transparent border-none h-12 w-12 min-profile-button-size" onClick={onProfileIconClicked}>
						<img className="rounded-full overflow-hidden h-12 w-12 object-cover min-profile-button-size" src={senderPfpUrl} alt="Profile"></img>
					</button>
					<div className="bg-blue-700 text-white rounded-lg p-2 align-middle flex">
						<span className="flex items-center message-size">{message}</span>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div className="flex flex-col items-start">
				<span className="px-3 py-1 font-bold">{senderUsername}</span>
				<div className="flex h-fit mx-1 my-auto mx-3 gap-2" id={senderId}>
					<button className="h-full items-baseline bg-transparent border-none h-12 w-12 min-profile-button-size" onClick={onProfileIconClicked}>
						<img className="rounded-full overflow-hidden h-12 w-12 object-cover min-profile-button-size" src={senderPfpUrl} alt="Profile"></img>
					</button>
					<div className="bg-theme-darkgreen text-white rounded-lg p-2 align-middle flex">
						<span className="flex items-center message-size">{message}</span>
					</div>
				</div>
			</div>
		)
	}
}

export default ChatMessageComponent
