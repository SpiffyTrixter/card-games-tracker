import type { Component } from 'svelte';

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

	rules?: any; // Rules can be a markdown string or a Svelte component
	logic?: ScoringStrategy;
	initialScore?: number; // Optional initial score for players

	components?: {
		play?: Component<{ gameManager: any }>;
		scoreboard?: Component<{ gameManager: any }>;
		scoreTable?: Component<{ gameManager: any }>;
		setup?: Component<{ gameManager: any; playersLimit: Players; onStart: () => void }>;
	};
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
