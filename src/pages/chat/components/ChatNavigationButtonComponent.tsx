import React from "react";


type ChatNavigationButtonProps = {
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
	chatName: string
	name: string
	active?: boolean
}

/**
 * Chat selector button that appears on the left navigation panel.
 * @param {ChatNavigationButtonProps} ChatNavigationButtonProps
 * @returns ChatNavigationButton
 */
const ChatNavigationButton: React.FC<ChatNavigationButtonProps> = ({
	// Callback for when this button is clicked on.
	onClick,

	// The label text that appears on the button.
	chatName,

	// Index number of the Chat in the publicChats record.
	name,

	// Whether this is the currently selected Chat.
	active,
}) => {
	let className = "w-full text-left text-base border-none rounded p-1 pl-4"
	if (active) {
		className += " bg-slate-200"
	}

	return (
		<div className="p-px grow">
			<button name={name} className={className} onClick={onClick}>
				{`#${chatName}`}
			</button>
		</div>
	)
}

export default ChatNavigationButton
