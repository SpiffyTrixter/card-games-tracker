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

	const TOTAL_TRICKS = 5;

	type RoundState = 'standard' | 'rumba' | 'sit-out';
	let roundInputs = $state<{ state: RoundState; tricks: number }[]>([]);

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
			state: 'standard',
			tricks: 0
		}));
	}

	function getConsecutiveSits(playerId: string) {
		const player = gm.session.players.find((p) => p.id === playerId);
		if (!player) return 0;
		let sits = 0;
		for (let i = player.history.length - 1; i >= 0; i--) {
			if (player.history[i].metadata?.state === 'sit-out') sits++;
			else break;
		}
		return sits;
	}

	function toggleSitOut(i: number) {
		const player = gm.session.players[i];
		const input = roundInputs[i];
		if (!input) return;

		if (input.state === 'sit-out') {
			input.state = 'standard';
		} else {
			if (player.score <= 5) return m.rumba_cannot_sit_out({ name: player.name });
			if (getConsecutiveSits(player.id) >= 2) return m.rumba_must_play({ name: player.name });
			input.state = 'sit-out';
			input.tricks = 0;
		}
		return null;
	}

	function toggleRumba(i: number) {
		const input = roundInputs[i];
		if (!input || input.state === 'sit-out') return;
		input.state = input.state === 'rumba' ? 'standard' : 'rumba';
	}

	const currentTotalTricks = $derived(
		roundInputs.reduce((sum, input) => sum + (Number(input?.tricks) || 0), 0)
	);
	const remainingTricks = $derived(TOTAL_TRICKS - currentTotalTricks);

	function submitRound() {
		const roundData: Record<
			string,
			{ delta: number; tricks: number; metadata: { state: RoundState } }
		> = {};

		gm.session.players.forEach((player, i) => {
			const input = roundInputs[i];
			const tricks = input.tricks;
			let delta;

			if (input.state === 'sit-out') {
				delta = 0;
			} else if (input.state === 'rumba') {
				delta = tricks >= 3 ? -(tricks * 2) : 10;
			} else {
				delta = tricks === 0 ? 5 : -tricks;
			}

			roundData[player.id] = {
				delta,
				tricks,
				metadata: { state: input.state }
			};
		});

		gm.addRound(roundData);

		if (gm.session.players.some((p) => p.score <= 0)) {
			gm.finishGame();
		} else {
			initRoundInputs();
		}
	}

	function getPlayerDelta(i: number) {
		const input = roundInputs[i];
		if (!input) return 0;
		const tricks = input.tricks;

		if (input.state === 'sit-out') {
			return 0;
		} else if (input.state === 'rumba') {
			return tricks >= 3 ? -(tricks * 2) : 10;
		} else {
			return tricks === 0 ? 5 : -tricks;
		}
	}

	const rumbaSteps: WizardStep[] = [
		{
			id: 'participants',
			shortTitle: m.rumba_participants,
			title: m.rumba_participants_title,
			icon: 'group',
			buttonText: m.rumba_confirm_participants,
			validate: () => {
				if (roundInputs.every((r) => r.state === 'sit-out')) return m.rumba_someone_must_play();
				return null;
			},
			playerAction: renderParticipantToggle
		},
		{
			id: 'rumba',
			shortTitle: m.rumba_rumba_calls,
			title: m.rumba_rumba_calls_title,
			icon: 'auto_awesome',
			buttonText: m.rumba_enter_tricks,
			filterPlayers: (p, i) => roundInputs[i]?.state !== 'sit-out',
			playerAction: renderRumbaToggle
		},
		{
			id: 'scoring',
			shortTitle: m.rumba_scoring,
			title: m.rumba_scoring_title,
			icon: 'edit_note',
			buttonText: m.rumba_record_round,
			filterPlayers: (p, i) => roundInputs[i]?.state !== 'sit-out',
			validate: () => {
				if (currentTotalTricks !== TOTAL_TRICKS) {
					return m.rumba_total_tricks({ total: TOTAL_TRICKS, current: currentTotalTricks });
				}
				return null;
			},
			playerAction: renderScoringCounter,
			extraUI: renderTricksCounter,
			getDelta: (p, i) => getPlayerDelta(i),
			showScoreChange: true
		}
	];
</script>

<GameWizard steps={rumbaSteps} gameManager={gm} onSubmit={submitRound} positiveIsGood={false} />

{#snippet renderParticipantToggle(player: PlayerState, i: number)}
	{@const input = roundInputs[i]}
	{#if input}
		{@const isSit = input.state === 'sit-out'}
		{@const disableSit = player.score <= 5 || getConsecutiveSits(player.id) >= 2}
		<div class="flex h-12 min-w-0 flex-col justify-center"></div>
		<div class="relative flex h-10 w-full overflow-hidden rounded-lg bg-muted p-1 sm:w-48 md:h-11">
			<div
				class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] {isSit
					? 'bg-primary/20'
					: 'bg-primary'} rounded-md shadow-sm transition-all duration-300 ease-out"
				style="transform: translateX({isSit ? '100%' : '0%'})"
			></div>

			<button
				onclick={() => {
					input.state = 'standard';
				}}
				class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 md:py-2 {isSit
					? 'text-muted-foreground'
					: 'text-primary-foreground'}"
			>
				{m.rumba_play()}
			</button>
			<button
				onclick={() => toggleSitOut(i)}
				disabled={disableSit && !isSit}
				class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 disabled:opacity-20 md:py-2 {isSit
					? 'font-bold text-primary'
					: 'text-muted-foreground'}"
			>
				{m.rumba_sit_out()}
			</button>
		</div>
	{/if}
{/snippet}

{#snippet renderRumbaToggle(_player: PlayerState, i: number)}
	{@const input = roundInputs[i]}
	{#if input}
		{@const isRumba = input.state === 'rumba'}
		<div class="flex h-12 min-w-0 flex-col justify-center"></div>
		<div class="relative flex h-10 w-full overflow-hidden rounded-lg bg-muted p-1 sm:w-48 md:h-11">
			<div
				class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-md bg-primary shadow-sm transition-all duration-300 ease-out"
				style="transform: translateX({isRumba ? '100%' : '0%'})"
			></div>

			<button
				onclick={() => {
					input.state = 'standard';
				}}
				class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 md:py-2 {isRumba
					? 'text-muted-foreground'
					: 'text-primary-foreground'}"
			>
				{m.rumba_standard()}
			</button>
			<button
				onclick={() => toggleRumba(i)}
				class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 md:py-2 {isRumba
					? 'font-bold text-primary-foreground'
					: 'text-muted-foreground'}"
			>
				{m.rumba_rumba()}
			</button>
		</div>
	{/if}
{/snippet}

{#snippet renderScoringCounter(player: PlayerState, i: number)}
	{@const input = roundInputs[i]}
	{#if input}
		<div class="flex h-12 min-w-0 flex-col justify-center">
			{#if input.state === 'rumba'}
				<div in:slide={{ axis: 'y' }}>
					<Badge
						variant="default"
						class="mt-0.5 h-4 text-[9px] font-bold tracking-tighter uppercase"
					>
						{m.rumba_mode()}
					</Badge>
				</div>
			{/if}
		</div>
		<div class="flex shrink-0 items-center gap-2 sm:w-48 sm:justify-center md:gap-4">
			<Button
				variant="outline"
				size="icon"
				onclick={() => (input.tricks = Math.max(0, input.tricks - 1))}
				class="h-9 w-9 md:h-10 md:w-10"
				aria-label={`Decrease ${player.name}'s trick count`}
			>
				<span class="material-symbols-outlined text-[20px]">remove</span>
			</Button>
			<span class="w-6 text-center text-xl font-bold text-primary tabular-nums md:w-8 md:text-2xl">
				{input.tricks}
			</span>
			<Button
				variant="outline"
				size="icon"
				onclick={() => (input.tricks = input.tricks + 1)}
				disabled={remainingTricks <= 0}
				class="h-9 w-9 md:h-10 md:w-10"
				aria-label={`Increase ${player.name}'s trick count`}
			>
				<span class="material-symbols-outlined text-[20px]">add</span>
			</Button>
		</div>
	{/if}
{/snippet}

{#snippet renderTricksCounter()}
	<div class="w-20 shrink-0 text-right">
		<div
			class="text-3xl leading-none font-bold tabular-nums"
			class:text-primary={remainingTricks === 0}
			class:text-destructive={remainingTricks < 0}
		>
			{remainingTricks}
		</div>
		<div class="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase">
			{m.rumba_remaining()}
		</div>
	</div>
{/snippet}
