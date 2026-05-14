import type { Game } from '$lib/types/game';

import { baccaratReserve } from './baccarat-reserve/baccarat-reserve.game';
import { bellJass } from './bell-jass/game';
import { cipherBoard } from './cipher-board/cipher-board.game';
import { rumba } from './rumba/rumba.game';
import { velvetDice } from './velvet-dice/velvet-dice.game';

// Central Registry of all available games
export const gamesRegistry: Record<string, Game> = {
	rumba,
	bellJass,
	baccaratReserve,
	velvetDice,
	cipherBoard
};

// Helper to get game by ID
export function getGameById(id: string): Game | undefined {
	return gamesRegistry[id];
}

// Helper to get all games as an array
export function getAllGames(): Game[] {
	return Object.values(gamesRegistry);
}
