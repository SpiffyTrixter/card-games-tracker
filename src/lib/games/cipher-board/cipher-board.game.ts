import type { Game } from '$lib/types/game';

export const cipherBoard: Game = {
	id: 'cipher-board',
	title: 'Cipher Board',
	description:
		'An abstract strategy game played on a grid of polished obsidian. Outmaneuver your opponent in silence.',
	category: 'Strategy',
	players: { min: 2, max: 2 },
	icon: 'extension'
};
