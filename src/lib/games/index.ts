import type { Game } from '$lib/types/game';

import { baccaratReserve } from './baccarat-reserve/baccarat-reserve.game';
import { bellJass } from './bell-jass/game';
import { cipherBoard } from './cipher-board/cipher-board.game';
import { rumba } from './rumba/game';
import { velvetDice } from './velvet-dice/velvet-dice.game';

export const gamesRegistry: Record<string, Game> = {
	rumba,
	bellJass,
	baccaratReserve,
	velvetDice,
	cipherBoard
};

export function getGameById(id: string): Game | undefined {
	return gamesRegistry[id];
}

export function getAllGames(): Game[] {
	return Object.values(gamesRegistry);
}
