<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import { cn } from '$lib/utils';

	let { gameManager: gm }: { gameManager: GameManager } = $props();

	const TOTAL_TRICKS = 5;

	// Rumba specific state
	type RoundPhase = 'participants' | 'rumba' | 'scoring';
	type RoundState = 'standard' | 'rumba' | 'sit-out';

	let roundPhase = $state<RoundPhase>('participants');
	let roundInputs = $state<{ state: RoundState; tricks: number }[]>(
		gm.session.players.map(() => ({ state: 'standard', tricks: 0 }))
	);
	let error = $state('');

	// Derived
	const currentTotalTricks = $derived(
		roundInputs.reduce((sum, input) => sum + (Number(input.tricks) || 0), 0)
	);
	const remainingTricks = $derived(TOTAL_TRICKS - currentTotalTricks);

	$effect(() => {
		if (gm.session.players.length > 0 && roundInputs.length !== gm.session.players.length) {
			initRoundInputs();
		}
	});

	function initRoundInputs() {
		roundInputs = gm.session.players.map(() => ({
			state: 'standard',
			tricks: 0
		}));
		roundPhase = 'participants';
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

	function submitRound() {
		// Validation
		if (currentTotalTricks !== TOTAL_TRICKS) {
			error = `Total tricks must be exactly ${TOTAL_TRICKS}. Currently: ${currentTotalTricks}`;
			return;
		}

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

		// Check for winner
		if (gm.session.players.some((p) => p.score <= 0)) {
			gm.finishGame();
		} else {
			initRoundInputs();
			error = '';
		}
	}

	function toggleSitOut(i: number) {
		const player = gm.session.players[i];
		if (roundInputs[i].state === 'sit-out') {
			roundInputs[i].state = 'standard';
		} else {
			// Constraints
			if (player.score <= 5) {
				error = `${player.name} cannot sit out with 5 points or less.`;
				return;
			}
			if (getConsecutiveSits(player.id) >= 2) {
				error = `${player.name} must play (max 2 consecutive sits).`;
				return;
			}
			roundInputs[i].state = 'sit-out';
			roundInputs[i].tricks = 0;
		}
		error = '';
	}

	function toggleRumba(i: number) {
		if (roundInputs[i].state === 'sit-out') return;
		roundInputs[i].state = roundInputs[i].state === 'rumba' ? 'standard' : 'rumba';
	}
</script>

<div class="space-y-6 p-4 md:space-y-8 md:p-8">
	<!-- Round Phase Wizard Header -->
	<div
		class="flex items-center justify-between rounded-xl border bg-muted p-1 text-[9px] tracking-wider uppercase md:mb-8 md:p-2 md:text-[10px]"
	>
		<Button
			variant={roundPhase === 'participants' ? 'default' : 'ghost'}
			size="sm"
			onclick={() => {
				roundPhase = 'participants';
				error = '';
			}}
			class="flex-1 rounded-lg"
		>
			1. <span class="xs:inline hidden">Participants</span><span class="xs:hidden">Who?</span>
		</Button>
		<span
			class="material-symbols-outlined mx-0.5 text-[12px] text-muted-foreground md:mx-1 md:text-[14px]"
			>chevron_right</span
		>
		<Button
			variant={roundPhase === 'rumba' ? 'default' : 'ghost'}
			size="sm"
			onclick={() => {
				if (roundInputs.every((r) => r.state === 'sit-out')) {
					error = 'Someone must play.';
				} else {
					roundPhase = 'rumba';
					error = '';
				}
			}}
			class="flex-1 rounded-lg"
		>
			2. Rumba
		</Button>
		<span
			class="material-symbols-outlined mx-0.5 text-[12px] text-muted-foreground md:mx-1 md:text-[14px]"
			>chevron_right</span
		>
		<Button
			variant={roundPhase === 'scoring' ? 'default' : 'ghost'}
			size="sm"
			onclick={() => {
				if (roundInputs.every((r) => r.state === 'sit-out')) {
					error = 'Someone must play.';
				} else {
					roundPhase = 'scoring';
					error = '';
				}
			}}
			class="flex-1 rounded-lg"
		>
			3. Scoring
		</Button>
	</div>

	{#if roundPhase === 'participants'}
		<div class="space-y-4" in:fade>
			<div class="flex min-h-14 items-end justify-between md:min-h-[64px]">
				<h3 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
					<span class="material-symbols-outlined text-primary">group</span> Who is playing?
				</h3>
			</div>
			<div class="space-y-2 md:space-y-3">
				{#each gm.session.players as player, i (player.id)}
					{@const isSit = roundInputs[i].state === 'sit-out'}
					{@const disableSit = player.score <= 5 || getConsecutiveSits(player.id) >= 2}
					<Card.Root size="xs" class={cn('transition-all', isSit && 'bg-muted/50 opacity-60')}>
						<Card.Content
							class="flex flex-col justify-between gap-3 p-3 sm:flex-row sm:items-center"
						>
							<div class="flex items-center gap-3">
								<span class="text-lg font-medium">{player.name}</span>
							</div>
							<div
								class="relative flex h-10 w-full overflow-hidden rounded-lg bg-muted p-1 sm:w-48 md:h-11"
							>
								<div
									class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] {isSit
										? 'bg-primary/20'
										: 'bg-primary'} rounded-md shadow-sm transition-all duration-300 ease-out"
									style="transform: translateX({isSit ? '100%' : '0%'})"
								></div>

								<button
									onclick={() => {
										roundInputs[i].state = 'standard';
										error = '';
									}}
									class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 md:py-2 {isSit
										? 'text-muted-foreground'
										: 'text-primary-foreground'}"
								>
									Play
								</button>
								<button
									onclick={() => toggleSitOut(i)}
									disabled={disableSit && !isSit}
									class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 disabled:opacity-20 md:py-2 {isSit
										? 'font-bold text-primary'
										: 'text-muted-foreground'}"
								>
									Sit Out
								</button>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>

			{#if error}
				<div
					class="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
					transition:slide
				>
					<span class="material-symbols-outlined">error</span>
					{error}
				</div>
			{/if}

			<Button
				onclick={() => {
					if (roundInputs.every((r) => r.state === 'sit-out')) {
						error = 'Someone must play.';
					} else {
						roundPhase = 'rumba';
						error = '';
					}
				}}
				class="mt-4 w-full py-6 text-lg font-bold shadow-lg"
			>
				Confirm Participants
			</Button>
		</div>
	{:else if roundPhase === 'rumba'}
		<div class="space-y-4" in:fade>
			<div class="flex min-h-14 items-end justify-between md:min-h-[64px]">
				<h3 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
					<span class="material-symbols-outlined text-primary">auto_awesome</span> Any Rumba calls?
				</h3>
			</div>
			<div class="space-y-2 md:space-y-3">
				{#each gm.session.players as player, i (player.id)}
					{#if roundInputs[i].state !== 'sit-out'}
						{@const isRumba = roundInputs[i].state === 'rumba'}
						<Card.Root
							size="xs"
							class={cn(
								'transition-all',
								isRumba && 'border-primary bg-primary/5 ring-1 ring-primary/20'
							)}
						>
							<Card.Content
								class="flex flex-col justify-between gap-3 p-3 sm:flex-row sm:items-center"
							>
								<span class={cn('text-lg font-medium', isRumba && 'text-primary')}
									>{player.name}</span
								>
								<div
									class="relative flex h-10 w-full overflow-hidden rounded-lg bg-muted p-1 sm:w-48 md:h-11"
								>
									<!-- Sliding Background -->
									<div
										class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-md bg-primary shadow-sm transition-all duration-300 ease-out"
										style="transform: translateX({isRumba ? '100%' : '0%'})"
									></div>

									<button
										onclick={() => {
											roundInputs[i].state = 'standard';
										}}
										class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 md:py-2 {isRumba
											? 'text-muted-foreground'
											: 'text-primary-foreground'}"
									>
										Standard
									</button>
									<button
										onclick={() => toggleRumba(i)}
										class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 md:py-2 {isRumba
											? 'font-bold text-primary-foreground'
											: 'text-muted-foreground'}"
									>
										Rumba!
									</button>
								</div>
							</Card.Content>
						</Card.Root>
					{/if}
				{/each}
			</div>

			<div class="flex gap-4 pt-4">
				<Button variant="outline" onclick={() => (roundPhase = 'participants')} class="flex-1 py-6">
					Back
				</Button>
				<Button
					onclick={() => (roundPhase = 'scoring')}
					class="flex-2 py-6 text-lg font-bold shadow-lg"
				>
					Enter Tricks
				</Button>
			</div>
		</div>
	{:else if roundPhase === 'scoring'}
		<div class="space-y-4" in:fade>
			<div class="flex min-h-14 items-end justify-between md:min-h-[64px]">
				<h3 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
					<span class="material-symbols-outlined text-primary">edit_note</span> Trick Tally
				</h3>
				<div class="w-20 shrink-0 text-right">
					<div
						class="text-3xl leading-none font-bold tabular-nums"
						class:text-primary={remainingTricks === 0}
						class:text-destructive={remainingTricks < 0}
					>
						{remainingTricks}
					</div>
					<div class="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase">
						Remaining
					</div>
				</div>
			</div>

			<div class="space-y-2 md:space-y-3">
				{#each gm.session.players as player, i (player.id)}
					{#if roundInputs[i].state !== 'sit-out'}
						<Card.Root size="xs">
							<Card.Content class="flex items-center justify-between gap-4 p-3">
								<div class="min-w-0">
									<span class="block truncate text-lg font-medium">{player.name}</span>
									{#if roundInputs[i].state === 'rumba'}
										<Badge
											variant="default"
											class="mt-1 text-[10px] font-bold tracking-tighter uppercase"
										>
											Rumba Mode
										</Badge>
									{/if}
								</div>
								<div class="flex shrink-0 items-center gap-2 md:gap-4">
									<Button
										variant="outline"
										size="icon"
										onclick={() => (roundInputs[i].tricks = Math.max(0, roundInputs[i].tricks - 1))}
										class="h-9 w-9 md:h-10 md:w-10"
									>
										<span class="material-symbols-outlined text-[20px]">remove</span>
									</Button>
									<span
										class="w-6 text-center text-xl font-bold text-primary tabular-nums md:w-8 md:text-2xl"
									>
										{roundInputs[i].tricks}
									</span>
									<Button
										variant="outline"
										size="icon"
										onclick={() => (roundInputs[i].tricks = roundInputs[i].tricks + 1)}
										disabled={remainingTricks <= 0}
										class="h-9 w-9 md:h-10 md:w-10"
									>
										<span class="material-symbols-outlined text-[20px]">add</span>
									</Button>
								</div>
							</Card.Content>
						</Card.Root>
					{/if}
				{/each}
			</div>

			{#if error}
				<div
					class="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
					transition:slide
				>
					<span class="material-symbols-outlined">error</span>
					{error}
				</div>
			{/if}

			<div class="flex gap-4 pt-6">
				<Button variant="outline" onclick={() => (roundPhase = 'rumba')} class="flex-1 py-6">
					Back
				</Button>
				<Button onclick={submitRound} class="flex-2 py-6 text-lg font-bold shadow-lg">
					Record Round
				</Button>
			</div>
		</div>
	{/if}
</div>
