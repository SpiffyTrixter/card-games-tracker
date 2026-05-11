import type { Game } from '$lib/types/game';
import { frenchDeck } from '$lib/data/decks/french';

export const baccaratReserve: Game = {
	id: 'baccarat-reserve',
	title: 'Baccarat Reserve',
	description:
		'The timeless pursuit of nine, refined. Experience the pristine mechanics of the classic salon game.',
	category: 'Classic',
	players: { min: 2, max: 8 },
	icon: 'style',
	props: {
		deck: frenchDeck
	}
};
