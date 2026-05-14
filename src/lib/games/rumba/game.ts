import { jassDeck } from '$lib/data/decks/jass';
import { m } from '$lib/paraglide/messages.js';
import type { Game } from '$lib/types/game';

import { logic } from './logic';
import RumbaRulesDe from './rules.de.md';
import RumbaRulesEn from './rules.en.md';

export const rumba: Game = {
	id: 'rumba',
	title: m.game_rumba_title,
	description: m.game_rumba_description,
	category: m.category_cards,
	players: { min: 2, max: 4 },
	icon: 'style',
	props: {
		deck: {
			...jassDeck,
			name: m.equipment_jass_deck
		}
	},
	rules: {
		en: RumbaRulesEn,
		de: RumbaRulesDe
	},
	logic: logic,
	initialScore: 15,
	components: {
		play: () => import('./components/RumbaPlay.svelte')
	}
};
