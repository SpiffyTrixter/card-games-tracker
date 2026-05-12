import { getContext, setContext, untrack } from 'svelte';

import { PersistenceService } from '$lib/services/persistence';
import type { Game, GameSession, PlayerHistoryEntry } from '$types/game';

export class GameManager {
	currentGame: Game | undefined;
	session = $state<GameSession>({
		id: crypto.randomUUID(),
		gameId: '',
		players: [],
		state: 'setup',
		initialScore: 0,
		startTime: Date.now()
	});

	constructor(game: Game) {
		this.currentGame = game;

		const savedSession = PersistenceService.getSession(game.id);
		if (savedSession) {
			this.session = savedSession;
		} else {
			this.initDefault(game.id);
		}

		$effect(() => {
			// Track all changes in session and save
			const sessionCopy = $state.snapshot(this.session);
			untrack(() => {
				PersistenceService.saveSession(this.session.gameId, sessionCopy);
			});
		});
	}

	private initDefault(gameId: string) {
		this.session.gameId = gameId;
		this.session.players = [];
		this.addPlayer('Player 1');
		this.addPlayer('Player 2');
	}

	addPlayer(name: string) {
		const id = crypto.randomUUID();
		this.session.players.push({
			id,
			name: name || `Player ${this.session.players.length + 1}`,
			score: 0,
			history: []
		});
	}

	removePlayer(id: string) {
		this.session.players = this.session.players.filter((p) => p.id !== id);
	}

	startGame(customInitialScore?: number) {
		if (this.session.players.length < 2) return;

		const startingScore = customInitialScore ?? this.currentGame?.initialScore ?? 0;

		this.session.initialScore = startingScore;
		this.session.players.forEach((p) => (p.score = startingScore));
		this.session.state = 'playing';
		this.session.startTime = Date.now();
	}

	addRoundFromInput(roundInput: Record<string, Record<string, unknown>>) {
		if (!this.currentGame?.logic) {
			console.warn('No logic defined for game: ' + this.session.gameId);
			return;
		}
		const roundData = this.currentGame.logic.calculateScore(roundInput, this.session.players);
		this.addRound(roundData);
	}

	addRound(
		roundData: Record<
			string,
			{ delta: number; tricks?: number; metadata?: Record<string, unknown> }
		>
	) {
		this.session.players.forEach((player) => {
			const data = roundData[player.id];
			if (data) {
				player.score += data.delta;
				const entry: PlayerHistoryEntry = {
					delta: data.delta,
					scoreAfter: player.score,
					tricks: data.tricks,
					metadata: data.metadata
				};
				player.history.push(entry);
			}
		});
	}

	rewindTo(roundIndex: number) {
		if (roundIndex < 0) {
			this.session.players.forEach((p) => {
				p.history = [];
				p.score = this.session.initialScore;
			});
			return;
		}

		this.session.players.forEach((p) => {
			if (roundIndex < p.history.length) {
				p.history = p.history.slice(0, roundIndex + 1);
				p.score = p.history[p.history.length - 1].scoreAfter;
			}
		});
	}

	finishGame() {
		this.session.state = 'finished';
		this.session.endTime = Date.now();
	}

	reset() {
		this.session.state = 'setup';
		this.session.players.forEach((p) => {
			p.history = [];
			p.score = this.session.initialScore;
		});
	}
}

const GAME_MANAGER_KEY = Symbol('GAME_MANAGER');

export function setGameManager(manager: GameManager) {
	setContext(GAME_MANAGER_KEY, manager);
}

export function getGameManager(): GameManager {
	return getContext<GameManager>(GAME_MANAGER_KEY);
}
