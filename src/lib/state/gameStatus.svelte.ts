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
	currentGameId = $state<string | null>(null);
	headerState = $state<HeaderState>({ showSearch: true });
	stopGame = $state<(() => void) | undefined>(undefined);
}

export const gameStatus = new GameStatus();
