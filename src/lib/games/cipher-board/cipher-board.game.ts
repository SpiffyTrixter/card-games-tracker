import { m } from '$lib/paraglide/messages.js';
import type { Game } from '$lib/types/game';

export const cipherBoard: Game = {
	id: 'cipher-board',
	title: m.game_cipher_board_title,
	description: m.game_cipher_board_description,
	category: m.category_board,
	players: { min: 2, max: 2 },
	icon: 'extension'
};
