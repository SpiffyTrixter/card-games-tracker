import type { GameSession, PlayerHistoryEntry } from '$lib/types/game';

export class GameManager {
	session = $state<GameSession>({
		id: crypto.randomUUID(),
		gameId: '',
		players: [],
		state: 'setup',
		startTime: Date.now()
	});

	constructor(gameId: string) {
		this.session.gameId = gameId;
		// Initialize with 2 default players
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

	startGame(initialScore = 0) {
		if (this.session.players.length < 2) return;
		this.session.players.forEach((p) => (p.score = initialScore));
		this.session.state = 'playing';
		this.session.startTime = Date.now();
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
			// Reset to start of game
			this.session.players.forEach((p) => {
				p.history = [];
				// We'd need to know initial score, assuming it's what they had at start of history
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
			p.score = 0;
			p.history = [];
		});
	}
}
