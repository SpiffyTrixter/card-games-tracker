<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import GameLayout from '$lib/components/game/GameLayout.svelte';
	import GameSetup from '$lib/components/game/GameSetup.svelte';
	import Scoreboard from '$lib/components/game/Scoreboard.svelte';
	import ScoreTable from '$lib/components/game/ScoreTable.svelte';
	import { rumba } from '$lib/data/games/rumba';
	import { GameManager } from '$lib/state/gameManager.svelte';

	const TOTAL_TRICKS = 5;
	const INITIAL_SCORE = 15;

	const gm = new GameManager(rumba);

	// Rumba specific state
	type RoundPhase = 'participants' | 'rumba' | 'scoring';
	type RoundState = 'standard' | 'rumba' | 'sit-out';

	let roundPhase = $state<RoundPhase>('participants');
	let roundInputs = $state<{ state: RoundState; tricks: number }[]>([]);
	let error = $state('');

	// Derived
	const currentTotalTricks = $derived(
		roundInputs.reduce((sum, input) => sum + (input.tricks || 0), 0)
	);
	const remainingTricks = $derived(TOTAL_TRICKS - currentTotalTricks);

	function initRoundInputs() {
		roundInputs = gm.session.players.map(() => ({
			state: 'standard',
			tricks: 0
		}));
		roundPhase = 'participants';
	}

	function startGame() {
		gm.startGame(INITIAL_SCORE);
		initRoundInputs();
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

<GameLayout game={rumba} gameManager={gm}>
	{#if gm.session.state === 'setup'}
		<GameSetup gameManager={gm} playersLimit={rumba.players} onStart={startGame} />
	{:else if gm.session.state === 'playing'}
		<Scoreboard gameManager={gm} />
		<ScoreTable gameManager={gm} />

		<div class="space-y-6 p-4 md:space-y-8 md:p-8">
			<!-- Round Phase Wizard Header -->
			<div
				class="bg-surface-container-high font-label-sm mb-4 flex items-center justify-between rounded-xl border border-outline p-1 text-[9px] tracking-wider uppercase md:mb-8 md:p-2 md:text-[10px]"
			>
				<button
					onclick={() => {
						roundPhase = 'participants';
						error = '';
					}}
					class="flex-1 rounded-DEFAULT py-2 text-center transition-all {roundPhase ===
					'participants'
						? 'text-on-primary bg-primary'
						: 'hover:bg-surface-container-highest text-on-surface-variant'}"
				>
					1. <span class="xs:inline hidden">Participants</span><span class="xs:hidden">Who?</span>
				</button>
				<span
					class="material-symbols-outlined mx-0.5 text-[12px] text-outline md:mx-1 md:text-[14px]"
					>chevron_right</span
				>
				<button
					onclick={() => {
						if (roundInputs.every((r) => r.state === 'sit-out')) {
							error = 'Someone must play.';
						} else {
							roundPhase = 'rumba';
							error = '';
						}
					}}
					class="flex-1 rounded-DEFAULT py-2 text-center transition-all {roundPhase === 'rumba'
						? 'text-on-primary bg-primary'
						: 'hover:bg-surface-container-highest text-on-surface-variant'}"
				>
					2. Rumba
				</button>
				<span
					class="material-symbols-outlined mx-0.5 text-[12px] text-outline md:mx-1 md:text-[14px]"
					>chevron_right</span
				>
				<button
					onclick={() => {
						if (roundInputs.every((r) => r.state === 'sit-out')) {
							error = 'Someone must play.';
						} else {
							roundPhase = 'scoring';
							error = '';
						}
					}}
					class="flex-1 rounded-DEFAULT py-2 text-center transition-all {roundPhase === 'scoring'
						? 'text-on-primary bg-primary'
						: 'hover:bg-surface-container-highest text-on-surface-variant'}"
				>
					3. Scoring
				</button>
			</div>

			{#if roundPhase === 'participants'}
				<div class="space-y-4" in:fade>
					<div class="flex min-h-14 items-end justify-between md:min-h-[64px]">
						<h3
							class="font-headline-sm md:font-headline-md flex items-center gap-2 text-on-surface"
						>
							<span class="material-symbols-outlined text-primary">group</span> Who is playing?
						</h3>
					</div>
					<div class="space-y-2 md:space-y-3">
						{#each gm.session.players as player, i (player.id)}
							{@const isSit = roundInputs[i].state === 'sit-out'}
							{@const disableSit = player.score <= 5 || getConsecutiveSits(player.id) >= 2}
							<div
								class="flex flex-col justify-between gap-3 rounded-xl border p-3 transition-all sm:flex-row sm:items-center md:p-4 {!isSit
									? 'bg-surface-container border-outline'
									: 'bg-surface-container-low border-outline/30'}"
							>
								<div class="flex items-center gap-3 {isSit ? 'opacity-40' : ''}">
									<span class="font-headline-sm">{player.name}</span>
								</div>
								<div
									class="bg-surface-container-highest relative flex h-10 w-full overflow-hidden rounded-lg p-1 sm:w-48 md:h-11"
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
											? 'text-on-surface-variant'
											: 'text-on-primary'}"
									>
										Play
									</button>
									<button
										onclick={() => toggleSitOut(i)}
										disabled={disableSit && !isSit}
										class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 disabled:opacity-20 md:py-2 {isSit
											? 'font-bold text-primary'
											: 'text-on-surface-variant'}"
									>
										Sit Out
									</button>
								</div>
							</div>
						{/each}
					</div>

					{#if error}
						<div
							class="border-error/20 bg-error/10 text-error flex items-center gap-2 rounded-xl border p-4 text-sm"
							transition:slide
						>
							<span class="material-symbols-outlined">error</span>
							{error}
						</div>
					{/if}

					<button
						onclick={() => {
							if (roundInputs.every((r) => r.state === 'sit-out')) {
								error = 'Someone must play.';
							} else {
								roundPhase = 'rumba';
								error = '';
							}
						}}
						class="text-headline-sm font-display-md hover:bg-primary-light mt-4 w-full rounded-xl bg-primary py-5 text-surface shadow-lg transition-all"
					>
						Confirm Participants
					</button>
				</div>
			{:else if roundPhase === 'rumba'}
				<div class="space-y-4" in:fade>
					<div class="flex min-h-14 items-end justify-between md:min-h-[64px]">
						<h3
							class="font-headline-sm md:font-headline-md flex items-center gap-2 text-on-surface"
						>
							<span class="material-symbols-outlined text-primary">auto_awesome</span> Any Rumba calls?
						</h3>
					</div>
					<div class="space-y-2 md:space-y-3">
						{#each gm.session.players as player, i (player.id)}
							{#if roundInputs[i].state !== 'sit-out'}
								{@const isRumba = roundInputs[i].state === 'rumba'}
								<div
									class="flex flex-col justify-between gap-3 rounded-xl border p-3 transition-all sm:flex-row sm:items-center md:p-4 {isRumba
										? 'border-primary bg-primary/5 ring-1 ring-primary/20'
										: 'bg-surface-container/50 border-outline'}"
								>
									<span class="font-headline-sm {isRumba ? 'text-primary' : ''}">{player.name}</span
									>
									<div
										class="bg-surface-container-highest relative flex h-10 w-full overflow-hidden rounded-lg p-1 sm:w-48 md:h-11"
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
												? 'text-on-surface-variant'
												: 'text-on-primary'}"
										>
											Standard
										</button>
										<button
											onclick={() => toggleRumba(i)}
											class="font-label-sm relative z-10 flex-1 rounded-md px-4 py-1.5 text-[10px] uppercase transition-colors duration-300 md:py-2 {isRumba
												? 'text-on-primary font-bold'
												: 'text-on-surface-variant'}"
										>
											Rumba!
										</button>
									</div>
								</div>
							{/if}
						{/each}
					</div>

					<div class="flex gap-4 pt-4">
						<button
							onclick={() => (roundPhase = 'participants')}
							class="font-label-lg flex-1 rounded-xl border border-outline py-4 transition-all hover:border-on-surface"
						>
							Back
						</button>
						<button
							onclick={() => (roundPhase = 'scoring')}
							class="text-headline-sm font-display-md hover:bg-primary-light flex-2 rounded-xl bg-primary py-4 text-surface shadow-lg transition-all"
						>
							Enter Tricks
						</button>
					</div>
				</div>
			{:else if roundPhase === 'scoring'}
				<div class="space-y-6" in:fade>
					<div class="flex min-h-14 items-end justify-between md:min-h-[64px]">
						<h3
							class="font-headline-sm md:font-headline-md flex items-center gap-2 text-on-surface"
						>
							<span class="material-symbols-outlined text-primary">edit_note</span> Trick Tally
						</h3>
						<div class="text-right">
							<div
								class="text-headline-sm md:text-display-sm font-display-sm leading-none"
								class:text-primary={remainingTricks === 0}
								class:text-error={remainingTricks < 0}
							>
								{remainingTricks}
							</div>
							<div
								class="mt-1 text-[9px] tracking-widest text-on-surface-variant uppercase md:text-[10px]"
							>
								Remaining
							</div>
						</div>
					</div>

					<div class="space-y-2 md:space-y-3">
						{#each gm.session.players as player, i (player.id)}
							{#if roundInputs[i].state !== 'sit-out'}
								<div
									class="bg-surface-container flex items-center justify-between gap-4 rounded-xl border border-outline p-3 md:p-4"
								>
									<div class="min-w-0">
										<span class="font-headline-sm block truncate">{player.name}</span>
										{#if roundInputs[i].state === 'rumba'}
											<span
												class="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold tracking-tighter text-surface uppercase md:text-[10px]"
												>Rumba Mode</span
											>
										{/if}
									</div>
									<div class="flex shrink-0 items-center gap-2 md:gap-4">
										<button
											onclick={() =>
												(roundInputs[i].tricks = Math.max(0, roundInputs[i].tricks - 1))}
											class="bg-surface-container-high flex h-9 w-9 items-center justify-center rounded-lg border border-outline md:h-10 md:w-10"
										>
											<span class="material-symbols-outlined text-[20px]">remove</span>
										</button>
										<span
											class="font-display-md w-6 text-center text-[20px] text-primary md:w-8 md:text-[24px]"
											>{roundInputs[i].tricks}</span
										>
										<button
											onclick={() => (roundInputs[i].tricks = roundInputs[i].tricks + 1)}
											disabled={remainingTricks <= 0}
											class="bg-surface-container-high flex h-9 w-9 items-center justify-center rounded-lg border border-outline disabled:opacity-30 md:h-10 md:w-10"
										>
											<span class="material-symbols-outlined text-[20px]">add</span>
										</button>
									</div>
								</div>
							{/if}
						{/each}
					</div>

					{#if error}
						<div
							class="border-error/20 bg-error/10 text-error flex items-center gap-2 rounded-xl border p-4 text-sm"
							transition:slide
						>
							<span class="material-symbols-outlined">error</span>
							{error}
						</div>
					{/if}

					<div class="flex gap-4 pt-6">
						<button
							onclick={() => (roundPhase = 'rumba')}
							class="font-label-lg flex-1 rounded-xl border border-outline py-4 transition-all hover:border-on-surface"
						>
							Back
						</button>
						<button
							onclick={submitRound}
							class="text-headline-sm font-display-md hover:bg-primary-light flex-2 rounded-xl bg-primary py-4 text-surface shadow-lg shadow-primary/20 transition-all"
						>
							Record Round
						</button>
					</div>
				</div>
			{/if}
		</div>
	{:else if gm.session.state === 'finished'}
		{@const winner = [...gm.session.players].sort((a, b) => a.score - b.score)[0]}
		<div class="flex flex-col items-center gap-8 p-12 text-center" in:fade>
			<div
				class="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-primary"
			>
				<span class="material-symbols-outlined text-[64px]">workspace_premium</span>
			</div>
			<div>
				<h2 class="font-display-lg text-display-lg text-primary">Victory!</h2>
				<p class="font-headline-md mt-2 text-on-surface-variant">
					{winner.name} has mastered the rhythm.
				</p>
			</div>

			<div
				class="bg-surface-container/30 w-full max-w-md space-y-4 rounded-2xl border border-outline p-6"
			>
				<h3 class="font-label-lg tracking-widest text-on-surface-variant uppercase">
					Final Standings
				</h3>
				{#each [...gm.session.players].sort((a, b) => a.score - b.score) as player (player.id)}
					<div class="flex items-center justify-between">
						<span class="font-headline-sm">{player.name}</span>
						<span class="font-display-sm text-primary">{player.score}</span>
					</div>
				{/each}
			</div>

			<button
				onclick={() => gm.reset()}
				class="font-label-lg hover:bg-primary-light rounded-xl bg-primary px-12 py-4 text-surface shadow-xl transition-all"
			>
				New Match
			</button>
		</div>
	{/if}
</GameLayout>
