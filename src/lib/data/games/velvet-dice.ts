import type { Game } from '$lib/types/game';

export const velvetDice: Game = {
	title: 'Velvet Dice',
	description: 'A tactile game of chance and careful positioning. Roll the bones in a quiet, tense atmosphere.',
	category: 'Modern',
	players: { min: 2, max: 4 },
	icon: 'casino',
	props: {
		dice: {
			name: 'Standard Dice (D6)',
			count: 5,
			description: 'Standard 6-sided dice. Wooden dice are recommended for the intended atmosphere.'
		},
		board: {
			name: 'Velvet Mat',
			description: 'A soft surface to roll the dice on quietly and keep them from bouncing off the table.'
		}
	}
};