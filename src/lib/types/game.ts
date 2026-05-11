export interface Players {
	min: number;
	max: number;
}

export interface EquipmentItem {
	name: string;
	count?: number;
	description?: string;
}

export interface GameProps {
	deck?: EquipmentItem;
	dice?: EquipmentItem;
	board?: EquipmentItem;
	extras?: EquipmentItem[];
}

export interface Game {
	id: string; // Added ID for routing/tracking
	title: string;
	description: string;
	category: string;
	players: Players;
	icon?: string;
	props?: GameProps;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rules?: any; // Rules can be a markdown string or a Svelte component
}

export interface PlayerHistoryEntry {
	tricks?: number;
	delta: number;
	scoreAfter: number;
	metadata?: Record<string, unknown>; // For game-specific data
}

export interface PlayerState {
	id: string;
	name: string;
	score: number;
	history: PlayerHistoryEntry[];
}

export interface GameSession {
	id: string;
	gameId: string;
	players: PlayerState[];
	state: 'setup' | 'playing' | 'finished';
	startTime: number;
	endTime?: number;
}
