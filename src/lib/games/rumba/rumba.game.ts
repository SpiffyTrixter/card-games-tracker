import { jassDeck } from '$lib/data/decks/jass';
import type { Game } from '$lib/types/game';

import { rumbaLogic } from './rumba.logic';
import RumbaRules from './rumba.rules.md';

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
	initialScore: 15,
	components: {
		play: () => import('./components/RumbaPlay.svelte')
	}
};
