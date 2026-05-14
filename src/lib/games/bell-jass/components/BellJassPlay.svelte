<script lang="ts">
	import { untrack } from 'svelte';
	import { slide } from 'svelte/transition';

	import { Badge } from '$components/ui/badge/index.js';
	import { Button } from '$components/ui/button/index.js';
	import GameWizard from '$lib/components/game/shared/GameWizard.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import type { PlayerState, WizardStep } from '$lib/types/game';
	let { gameManager: gm }: { gameManager: GameManager } = $props();

	const TOTAL_BELLS = 9;

	let roundInputs = $state<{ bells: number }[]>([]);

	// Sync inputs with players
	$effect.pre(() => {
		if (gm.session.players.length > 0 && roundInputs.length !== gm.session.players.length) {
			untrack(() => {
				initRoundInputs();
			});
		}
	});

	function initRoundInputs() {
		roundInputs = gm.session.players.map(() => ({
			bells: 0
		}));
	}

	const currentTotalBells = $derived(
		roundInputs.reduce((sum, input) => sum + (Number(input?.bells) || 0), 0)
	);
	const remainingBells = $derived(TOTAL_BELLS - currentTotalBells);

	function submitRound() {
		const roundData: Record<
			string,
			{ delta: number; tricks: number; metadata: { state: string } }
		> = {};

		const turiWinnerIndex = roundInputs.findIndex((input) => input.bells === TOTAL_BELLS);

		gm.session.players.forEach((player, i) => {
			const input = roundInputs[i];
			const bells = input.bells;
			let delta = bells;
			let state = 'standard';

			if (turiWinnerIndex !== -1) {
				state = 'turi';
				delta = i === turiWinnerIndex ? 0 : TOTAL_BELLS;
			}

			roundData[player.id] = {
				delta,
				tricks: bells,
				metadata: { state }
			};
		});

		gm.addRound(roundData);

		const currentRound = gm.session.players[0]?.history.length || 0;
		const maxRounds = gm.session.settings?.maxRounds;

		if (maxRounds && currentRound >= maxRounds) {
			gm.finishGame();
		} else {
			initRoundInputs();
		}
	}

	const steps: WizardStep[] = [
		{
			id: 'scoring',
			shortTitle: m.bell_jass_scoring,
			title: () => {
				const max = gm.session.settings?.maxRounds;
				const current = gm.session.players[0]?.history.length + 1;
				return max
					? `${m.bell_jass_scoring_title()} (${current} / ${max})`
					: `${m.bell_jass_scoring_title()} (${current})`;
			},
			icon: 'edit_note',
			buttonText: m.bell_jass_record_round,
			validate: () => {
				if (currentTotalBells !== TOTAL_BELLS) {
					return m.bell_jass_total_bells_error({ total: TOTAL_BELLS, current: currentTotalBells });
				}
				return null;
			},
			playerAction: renderScoringCounter,
			extraUI: renderBellsCounter,
			getDelta: (player, i) => getPlayerDelta(i),
			showScoreChange: true
		}
	];
	const turiWinnerIndex = $derived(roundInputs.findIndex((input) => input.bells === TOTAL_BELLS));

	function getPlayerDelta(i: number) {
		const input = roundInputs[i];
		if (!input) return 0;
		if (turiWinnerIndex !== -1) {
			return i === turiWinnerIndex ? 0 : TOTAL_BELLS;
		}
		return input.bells;
	}
</script>

<GameWizard {steps} gameManager={gm} onSubmit={submitRound} positiveIsGood={false} />

{#snippet renderScoringCounter(player: PlayerState, i: number)}
	{@const input = roundInputs[i]}
	{#if input}
		<div class="flex h-12 min-w-0 flex-col justify-center">
			{#if input.bells === TOTAL_BELLS}
				<div in:slide={{ axis: 'y' }}>
					<Badge
						variant="default"
						class="mt-0.5 h-4 bg-primary text-[9px] font-bold tracking-tighter text-primary-foreground uppercase"
					>
						Turi!
					</Badge>
				</div>
			{/if}
		</div>
		<div class="flex shrink-0 items-center gap-2 sm:w-48 sm:justify-center md:gap-4">
			<Button
				variant="outline"
				size="icon"
				onclick={() => (input.bells = Math.max(0, input.bells - 1))}
				class="h-9 w-9 md:h-10 md:w-10"
				aria-label={`Decrease ${player.name}'s bell count`}
			>
				<span class="material-symbols-outlined text-[20px]">remove</span>
			</Button>
			<span class="w-6 text-center text-xl font-bold text-primary tabular-nums md:w-8 md:text-2xl">
				{input.bells}
			</span>
			<Button
				variant="outline"
				size="icon"
				onclick={() => (input.bells = Math.min(TOTAL_BELLS, input.bells + 1))}
				disabled={remainingBells <= 0}
				class="h-9 w-9 md:h-10 md:w-10"
				aria-label={`Increase ${player.name}'s bell count`}
			>
				<span class="material-symbols-outlined text-[20px]">add</span>
			</Button>
		</div>
	{/if}
{/snippet}

{#snippet renderBellsCounter()}
	<div class="w-20 shrink-0 text-right">
		<div
			class="text-3xl leading-none font-bold tabular-nums"
			class:text-primary={remainingBells === 0}
			class:text-destructive={remainingBells < 0}
		>
			{remainingBells}
		</div>
		<div class="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase">
			{m.bell_jass_remaining()}
		</div>
	</div>
{/snippet}
