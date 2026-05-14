import type { Component } from 'svelte';

import type { GameManager } from '$lib/state/gameManager.svelte';

export interface Players {
	min: number;
	max: number;
}

export interface EquipmentItem {
	name: string | (() => string);
	count?: number;
	description?: string | (() => string);
}

export interface GameProps {
	deck?: EquipmentItem;
	dice?: EquipmentItem;
	board?: EquipmentItem;
	extras?: EquipmentItem[];
}

export interface Game {
	id: string;
	title: string | (() => string);
	description: string | (() => string);
	category: string | (() => string);
	players: Players;
	icon?: string;
	props?: GameProps;

	rules?: string | Component | Record<string, Component>;
	logic?: ScoringStrategy;
	initialScore?: number;

	components?: {
		play?: () => Promise<{ default: Component<{ gameManager: GameManager }> }>;
		scoreboard?: () => Promise<{ default: Component<{ gameManager: GameManager }> }>;
		scoreTable?: () => Promise<{ default: Component<{ gameManager: GameManager }> }>;
		setup?: () => Promise<{
			default: Component<{ gameManager: GameManager; playersLimit: Players; onStart: () => void }>;
		}>;
	};
}

export interface WizardStep {
	id: string;
	shortTitle: string | (() => string);
	title: string | (() => string);
	icon: string;
	buttonText: string | (() => string);
	validate?: () => string | null;
	filterPlayers?: (player: PlayerState, index: number) => boolean;
	playerAction: import('svelte').Snippet<[PlayerState, number]>;
	extraUI?: import('svelte').Snippet;
	getDelta?: (player: PlayerState, index: number) => number;
	showScoreChange?: boolean;
}

export interface RoundData {
	delta: number;
	tricks?: number;
	metadata?: Record<string, unknown>;
}

export interface ScoringStrategy {
	calculateScore: (
		roundInput: Record<string, Record<string, unknown>>,
		players: PlayerState[]
	) => Record<string, RoundData>;
}

export interface PlayerHistoryEntry {
	tricks?: number;
	delta: number;
	scoreAfter: number;
	metadata?: Record<string, unknown>;
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
	initialScore: number;
	startTime: number;
	endTime?: number;
	settings?: Record<string, any>;
}
