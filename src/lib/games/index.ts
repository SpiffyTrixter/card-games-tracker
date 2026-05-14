import type { Game } from '$lib/types/game';

import { bellJass } from './bell-jass/game';
import { rumba } from './rumba/game';

export const gamesRegistry: Record<string, Game> = {
	[rumba.id]: rumba,
	[bellJass.id]: bellJass
};

export function getGameById(id: string): Game | undefined {
	return gamesRegistry[id];
}

export function getAllGames(): Game[] {
	return Object.values(gamesRegistry);
}
