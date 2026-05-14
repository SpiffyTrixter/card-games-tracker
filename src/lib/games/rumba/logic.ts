import type { PlayerState, RoundData, ScoringStrategy } from '$lib/types/game';

export const logic: ScoringStrategy = {
	calculateScore: (roundInput: Record<string, Record<string, any>>, players: PlayerState[]) => {
		const roundData: Record<string, RoundData> = {};
		players.forEach((p) => {
			if (roundInput && roundInput[p.id]) {
				roundData[p.id] = { delta: (roundInput[p.id].score as number) || 0 };
			}
		});
		return roundData;
	}
};
