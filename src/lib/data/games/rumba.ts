import type { Game } from '$lib/types/game';
import { jassDeck } from '$lib/data/decks/jass';
import RumbaRules from '$lib/data/games/rules/rumba.md';

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
	rules: RumbaRules
};
