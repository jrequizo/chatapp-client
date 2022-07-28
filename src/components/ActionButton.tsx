import React from 'react'

import { Spinner } from 'phosphor-react'

interface ActionButtonProps {
	actionLabel?: string
	loadingLabel?: string
	success: boolean
	className?: string

	onActionButtonPressed: React.MouseEventHandler<HTMLButtonElement>
}

const ActionButton: React.FC<ActionButtonProps> = ({
	actionLabel,
	loadingLabel,
	success,
	className,
	onActionButtonPressed
}) => {
	if (!className) {
		className = ""
	}

	return (
		<button
			className={`transition ${className}`} // ${(success && " hover:bg-green-500")}
			onClick={onActionButtonPressed}
			disabled={!success}
		>
			{
				(
					!success ?
					<div className="flex flex-row justify-center gap-1">
						<p>{loadingLabel ?? "Saving..."}</p>
						<Spinner size={24} weight="light" className="animate-spin" />
					</div>
					: actionLabel ?? "Save"
				)

			}
		</button>
	)
}

export default ActionButton