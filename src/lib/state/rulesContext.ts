import { getContext, setContext } from 'svelte';

import type { Game } from '$types/game';

type RulesContext = {
	openRules: (game: Game) => void;
};

const RULES_KEY = Symbol('rules');

export function setRulesContext(context: RulesContext) {
	setContext(RULES_KEY, context);
}

export function getRulesContext() {
	return getContext<RulesContext>(RULES_KEY);
}
