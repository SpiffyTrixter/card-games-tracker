import { frenchDeck } from '$lib/data/decks/french';
import { m } from '$lib/paraglide/messages.js';
import type { Game } from '$lib/types/game';

export const baccaratReserve: Game = {
	id: 'baccarat-reserve',
	title: m.game_baccarat_reserve_title,
	description: m.game_baccarat_reserve_description,
	category: m.category_cards,
	players: { min: 2, max: 8 },
	icon: 'style',
	props: {
		deck: {
			...frenchDeck,
			name: m.equipment_french_deck
		}
	}
};
