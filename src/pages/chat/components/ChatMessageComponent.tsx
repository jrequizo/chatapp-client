import { useNavigate } from 'react-router'

import { getProfile } from '@/utils/credentialManager'
import ChatMessage from '@/types/ChatMessage'


type ChatMessageComponentProps = {
	messageDetails: ChatMessage
}

/**
 * Component for the individual Chat messages that appear in the `ChatboxComponent`.
 * Contains the Username title, a profile picture button that navigates to their profile, 
 * and the message contents.
 * @param {ChatMessageComponentProps} ChatMessageComponentProps
 * @returns 
 */
const ChatMessageComponent: React.FC<ChatMessageComponentProps> = ({
	messageDetails
}) => {
	const navigate = useNavigate()

	const { content, sender } = messageDetails

	function onProfileIconClicked() {
		navigate(`/profile/${messageDetails.sender.uid}`)
	}

	const isSender = sender.uid === getProfile()?.uid

	return (
		<div className={`flex flex-col items-start ${(isSender ? "items-end" : "")}`}> {/* right {items-end} */}
			<span className="px-3 py-1 font-bold">{sender.username}</span>
			<div className="flex flex-row-reverse h-fit mx-1 my-auto mx-3 gap-2" id={sender.uid}>
				<button className="h-full items-baseline bg-transparent border-none h-12 w-12 min-profile-button-size" onClick={onProfileIconClicked}>
					<img className="rounded-full overflow-hidden h-12 w-12 object-cover min-profile-button-size" src={sender.pfp_url} alt="Profile"></img>
				</button>
				<div className={`text-white rounded-lg p-2 align-middle flex ${(isSender ? "bg-blue-700" : "bg-theme-darkgreen")}`}> {/* right {bg-blue-700} */}
					<span className="flex items-center message-size">{content}</span>
				</div>
			</div>
		</div>
	)
}


export default ChatMessageComponent
