export interface HeaderAction {
	icon: string;
	label: string;
	onclick: () => void;
}

export interface HeaderState {
	title?: string;
	actions?: HeaderAction[];
	showSearch?: boolean;
}

class GameStatus {
	isGameInProgress = $state(false);
	headerState = $state<HeaderState>({ showSearch: true });
}

export const gameStatus = new GameStatus();
