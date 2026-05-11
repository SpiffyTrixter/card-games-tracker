import type { Game } from '$types/game';

import { rumba } from './rumba';

// Central Registry of all available games
export const gamesRegistry: Record<string, Game> = {
	rumba
};

// Helper to get game by ID
export function getGameById(id: string): Game | undefined {
	return gamesRegistry[id];
}

// Helper to get all games as an array
export function getAllGames(): Game[] {
	return Object.values(gamesRegistry);
}
