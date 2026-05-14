import { jassDeck } from '$lib/data/decks/jass';
import { m } from '$lib/paraglide/messages.js';
import type { Game } from '$lib/types/game';

import { logic } from './logic';
import RulesDe from './rules.de.md';
import RulesEn from './rules.en.md';

export const bellJass: Game = {
	id: 'bell-jass',
	title: m.game_bell_jass_title,
	description: m.game_bell_jass_description,
	category: m.category_cards,
	players: { min: 3, max: 4 },
	icon: 'style',
	props: {
		deck: {
			...jassDeck,
			name: m.equipment_jass_deck
		}
	},
	rules: {
		en: RulesEn,
		de: RulesDe
	},
	logic: logic,
	initialScore: 0,
	components: {
		setup: () => import('./components/BellJassSetup.svelte'),
		play: () => import('./components/BellJassPlay.svelte')
	}
};
