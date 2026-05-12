import type { Game } from '$lib/types/game';

import { baccaratReserve } from './baccarat-reserve/baccarat-reserve.game';
import { cipherBoard } from './cipher-board/cipher-board.game';
import { rumba } from './rumba/rumba.game';
import { velvetDice } from './velvet-dice/velvet-dice.game';

export const libraryGames: Game[] = [rumba, baccaratReserve, velvetDice, cipherBoard];
