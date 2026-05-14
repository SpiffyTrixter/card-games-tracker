import { m } from '$lib/paraglide/messages.js';
import type { Game } from '$lib/types/game';

export const velvetDice: Game = {
	id: 'velvet-dice',
	title: m.game_velvet_dice_title,
	description: m.game_velvet_dice_description,
	category: m.category_dice,
	players: { min: 2, max: 4 },
	icon: 'casino',
	props: {
		dice: {
			name: m.equipment_velvet_dice,
			count: 5,
			description: 'Standard 6-sided dice. Wooden dice are recommended for the intended atmosphere.'
		},
		board: {
			name: 'Velvet Mat',
			description:
				'A soft surface to roll the dice on quietly and keep them from bouncing off the table.'
		}
	}
};
