import { rumba } from './rumba';
import { baccaratReserve } from './baccarat-reserve';
import { velvetDice } from './velvet-dice';
import { cipherBoard } from './cipher-board';
import type { Game } from '$lib/types/game';

export const libraryGames: Game[] = [rumba, baccaratReserve, velvetDice, cipherBoard];
