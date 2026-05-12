import { browser } from '$app/environment';
import type { GameSession } from '$lib/types/game';

export class PersistenceService {
	static getSession(gameId: string): GameSession | null {
		if (!browser) return null;
		const storageKey = `game_session_${gameId}`;
		const savedSession = localStorage.getItem(storageKey);
		if (!savedSession) return null;

		try {
			return JSON.parse(savedSession);
		} catch (e) {
			console.error('Failed to parse saved game session:', e);
			return null;
		}
	}

	static saveSession(gameId: string, session: GameSession) {
		if (!browser) return;
		const storageKey = `game_session_${gameId}`;
		localStorage.setItem(storageKey, JSON.stringify(session));
	}

	static clearSession(gameId: string) {
		if (!browser) return;
		const storageKey = `game_session_${gameId}`;
		localStorage.removeItem(storageKey);
	}
}
