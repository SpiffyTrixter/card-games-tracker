import type { Component } from 'svelte';

import RumbaUI from '$components/game/RumbaUI.svelte';
import { jassDeck } from '$data/decks/jass';
import RumbaRules from '$data/games/rules/rumba.md';
import type { Game, PlayerState, RoundData, ScoringStrategy } from '$types/game';

const rumbaLogic: ScoringStrategy = {
	calculateScore: (roundInput: Record<string, Record<string, any>>, players: PlayerState[]) => {
		const roundData: Record<string, RoundData> = {};
		players.forEach((p) => {
			if (roundInput && roundInput[p.id]) {
				roundData[p.id] = { delta: (roundInput[p.id].score as number) || 0 };
			}
		});
		return roundData;
	}
};

export const rumba: Game = {
	id: 'rumba',
	title: 'Rumba',
	description: 'A captivating synthesis of traditional strategy and modern flair...',
	category: 'Cards',
	players: { min: 2, max: 4 },
	icon: 'style',
	props: {
		deck: jassDeck
	},
	rules: RumbaRules,
	logic: rumbaLogic,
	uiComponent: RumbaUI as Component<Record<string, unknown>>
};
