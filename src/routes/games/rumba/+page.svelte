<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	// import { rumba } from '$lib/data/games/rumba';

	// Game Constants
	const INITIAL_SCORE = 15;
	const TOTAL_TRICKS = 5;

	// Game State Types
	type GameState = 'setup' | 'playing' | 'finished';
	type RoundPhase = 'calling' | 'rumba' | 'playing';
	type RoundState = 'standard' | 'rumba' | 'sit-out';

	interface PlayerRoundHistory {
		state: RoundState;
		tricks: number;
		delta: number;
		scoreAfter: number;
	}

	interface Player {
		id: string;
		name: string;
		score: number;
		history: PlayerRoundHistory[];
		consecutiveSits: number;
	}

	interface RoundInput {
		state: RoundState;
		tricks: number;
	}

	interface MatchHistoryEntry {
		id: number;
		date: string;
		players: { name: string; score: number }[];
	}

	// State Runes
	let gameState = $state<GameState>('setup');
	let roundPhase = $state<RoundPhase>('calling');
	let players = $state<Player[]>([
		{ id: 'p1', name: 'Player 1', score: INITIAL_SCORE, history: [], consecutiveSits: 0 },
		{ id: 'p2', name: 'Player 2', score: INITIAL_SCORE, history: [], consecutiveSits: 0 }
	]);
	let roundInputs = $state<RoundInput[]>([]);
	let error = $state('');

	// Modals & History
	let showHistoryModal = $state(false);
	let historyTab = $state<'rounds' | 'matches'>('rounds');
	let matchHistory = $state<MatchHistoryEntry[]>([]);
	let rewindTarget = $state<{ index: number; label: string } | null>(null);

	// Derived
	const currentTotalTricks = $derived(roundInputs.reduce((sum, input) => sum + (input.tricks || 0), 0));
	const remainingTricks = $derived(TOTAL_TRICKS - currentTotalTricks);

	// Functions
	function initRoundInputs(currentPlayers: Player[]) {
		roundInputs = currentPlayers.map(() => ({
			state: 'standard',
			tricks: 0
		}));
		roundPhase = 'calling';
	}

	function addPlayer() {
		if (players.length < 4) {
			players.push({
				id: Date.now().toString(),
				name: `Player ${players.length + 1}`,
				score: INITIAL_SCORE,
				history: [],
				consecutiveSits: 0
			});
		}
	}

	function removePlayer(index: number) {
		if (players.length > 2) {
			players.splice(index, 1);
		}
	}

	function startGame() {
		initRoundInputs(players);
		gameState = 'playing';
	}

	function startNewGame() {
		players = players.map((p) => ({
			...p,
			score: INITIAL_SCORE,
			history: [],
			consecutiveSits: 0
		}));
		gameState = 'setup';
		error = '';
		rewindTarget = null;
	}

	function movePlayer(index: number, direction: number) {
		if ((direction === -1 && index === 0) || (direction === 1 && index === players.length - 1)) return;
		const temp = players[index];
		players[index] = players[index + direction];
		players[index + direction] = temp;
	}

	function performRewind() {
		if (rewindTarget === null) return;
		const targetIdx = rewindTarget.index;

		players = players.map((player) => {
			const newHistory = player.history.slice(0, targetIdx);
			const previousRound = newHistory[newHistory.length - 1];
			const newScore = previousRound ? previousRound.scoreAfter : INITIAL_SCORE;

			let sits = 0;
			for (let i = newHistory.length - 1; i >= 0; i--) {
				if (newHistory[i].state === 'sit-out') sits++;
				else break;
			}

			return {
				...player,
				score: newScore,
				history: newHistory,
				consecutiveSits: sits
			};
		});

		initRoundInputs(players);
		gameState = 'playing';
		rewindTarget = null;
		showHistoryModal = false;
	}

	function updateRoundInput(index: number, field: keyof RoundInput, value: any) {
		if (field === 'state' && value === 'sit-out') roundInputs[index].tricks = 0;
		(roundInputs[index] as any)[field] = value;
		error = '';
	}

	function toggleRumba(index: number) {
		roundInputs[index].state = roundInputs[index].state === 'rumba' ? 'standard' : 'rumba';
	}

	function submitRound() {
		if (currentTotalTricks !== TOTAL_TRICKS) {
			error = `Exactly ${TOTAL_TRICKS} tricks must be accounted for.`;
			return;
		}

		for (let i = 0; i < players.length; i++) {
			if (roundInputs[i].state === 'sit-out') {
				if (players[i].score <= 5) {
					error = `${players[i].name} cannot sit out with 5 points or less.`;
					return;
				}
				if (players[i].consecutiveSits >= 2) {
					error = `${players[i].name} must play (max 2 consecutive sits).`;
					return;
				}
			}
		}

		players = players.map((player, i) => {
			const input = roundInputs[i];
			const tricks = input.tricks || 0;
			let delta = 0;
			if (input.state === 'standard') delta = tricks === 0 ? 5 : -tricks;
			else if (input.state === 'rumba') delta = tricks >= 3 ? -(tricks * 2) : 10;
			else if (input.state === 'sit-out') delta = 0;

			const newScore = player.score + delta;
			return {
				...player,
				score: newScore,
				consecutiveSits: input.state === 'sit-out' ? player.consecutiveSits + 1 : 0,
				history: [...player.history, { state: input.state, tricks, delta, scoreAfter: newScore }]
			};
		});

		initRoundInputs(players);

		if (players.some((p) => p.score <= 0)) {
			gameState = 'finished';
			const sortedFinalPlayers = [...players].sort((a, b) => a.score - b.score);
			matchHistory = [
				{
					id: Date.now(),
					date: new Date().toLocaleDateString('de-CH', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					}),
					players: sortedFinalPlayers.map((p) => ({ name: p.name, score: p.score }))
				},
				...matchHistory
			];
		}
	}
</script>

<Header />

<main class="grow flex flex-col w-full px-margin-mobile md:px-margin-desktop py-12 max-w-max-width mx-auto gap-8 bg-background text-on-background">
	<div class="max-w-2xl mx-auto w-full bg-surface-felt rounded-xl shadow-2xl overflow-hidden border border-outline relative flex flex-col">
		
		<!-- Header -->
		<div class="bg-primary p-6 flex justify-between items-center shadow-lg">
			<div>
				<h1 class="font-display-md text-headline-lg text-on-primary tracking-tighter flex items-center gap-2 italic uppercase">Rumba</h1>
				<p class="font-label-sm text-[10px] text-on-primary/80 uppercase tracking-[0.2em] font-bold">Sequence Control</p>
			</div>
			<div class="flex items-center gap-2">
				<button 
					onclick={() => { historyTab = 'rounds'; showHistoryModal = true; }} 
					class="p-2 hover:bg-on-primary/10 rounded-full transition-all text-on-primary"
					aria-label="History"
				>
					<span class="material-symbols-outlined">history</span>
				</button>
				{#if gameState !== 'setup'}
					<button 
						onclick={() => rewindTarget = { index: -1, label: 'Game Start' }} 
						class="p-2 hover:bg-on-primary/10 rounded-full transition-all text-on-primary"
						aria-label="Reset"
					>
						<span class="material-symbols-outlined">refresh</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- Setup Screen -->
		{#if gameState === 'setup'}
			<div class="p-8 space-y-6">
				<div class="flex justify-between items-center">
					<h2 class="font-headline-lg text-[20px] text-primary flex items-center gap-2">
						<span class="material-symbols-outlined">person_add</span> Player Sequence
					</h2>
					<button 
						onclick={addPlayer} 
						disabled={players.length >= 4} 
						class="font-label-sm text-label-sm bg-surface-container border border-outline hover:border-primary disabled:opacity-30 px-4 py-2 rounded-DEFAULT transition-colors"
					>
						+ Add
					</button>
				</div>

				<div class="space-y-3">
					{#each players as player, index (player.id)}
						<div class="flex gap-3 items-center bg-surface-container/40 p-3 rounded-xl border border-outline/30">
							<div class="flex flex-col items-center">
								<button onclick={() => movePlayer(index, -1)} disabled={index === 0} class="text-on-surface-variant hover:text-primary disabled:opacity-0">
									<span class="material-symbols-outlined">keyboard_arrow_up</span>
								</button>
								<div class="text-on-surface-variant/50"><span class="material-symbols-outlined">drag_indicator</span></div>
								<button onclick={() => movePlayer(index, 1)} disabled={index === players.length - 1} class="text-on-surface-variant hover:text-primary disabled:opacity-0">
									<span class="material-symbols-outlined">keyboard_arrow_down</span>
								</button>
							</div>
							
							<div class="flex-1 flex items-center gap-3">
								<div class="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-full font-bold text-sm shrink-0">{index + 1}</div>
								<input
									type="text"
									bind:value={player.name}
									class="w-full px-4 py-2 bg-surface-container-low border border-outline rounded-DEFAULT focus:ring-1 focus:ring-primary outline-none font-body-md text-on-surface"
								/>
							</div>
							<button onclick={() => removePlayer(index)} class="p-2 text-on-surface-variant hover:text-error" disabled={players.length <= 2}>
								<span class="material-symbols-outlined">delete</span>
							</button>
						</div>
					{/each}
				</div>
				<button onclick={startGame} class="w-full bg-primary text-on-primary py-5 rounded-DEFAULT font-label-lg text-display-md hover:bg-primary-light transition-all flex items-center justify-center gap-3">
					<span class="material-symbols-outlined text-[32px]">play_arrow</span> Initialize Game
				</button>
			</div>
		{/if}

		<!-- Playing Screen -->
		{#if gameState === 'playing'}
			<div class="p-6 space-y-6">
				<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
					{#each players as p, i}
						<div class="bg-surface-container/50 p-4 rounded-xl border border-outline flex flex-col items-center relative overflow-hidden">
							<div class="absolute top-0 left-0 px-2 py-0.5 bg-outline/20 text-[8px] font-bold text-on-surface-variant rounded-br-lg">{i + 1}</div>
							<span class="font-label-sm text-[10px] text-on-surface-variant uppercase truncate w-full text-center">{p.name}</span>
							<span class="font-display-md text-[32px] {p.score <= 5 ? 'text-error animate-pulse-custom' : 'text-on-surface'}">{p.score}</span>
						</div>
					{/each}
				</div>

				<div class="flex justify-between items-center bg-surface-container-high p-2 rounded-xl border border-outline font-label-sm text-[10px] uppercase tracking-wider">
					 <div class="flex-1 text-center py-2 rounded-DEFAULT transition-all {roundPhase === 'calling' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}">1. Participant</div>
					 <span class="material-symbols-outlined text-[14px] text-outline mx-1">chevron_right</span>
					 <div class="flex-1 text-center py-2 rounded-DEFAULT transition-all {roundPhase === 'rumba' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}">2. Rumba</div>
					 <span class="material-symbols-outlined text-[14px] text-outline mx-1">chevron_right</span>
					 <div class="flex-1 text-center py-2 rounded-DEFAULT transition-all {roundPhase === 'playing' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}">3. Scoring</div>
				</div>

				<div class="space-y-4">
					{#if roundPhase === 'calling'}
						{#each players as p, i}
							{@const isSit = roundInputs[i].state === 'sit-out'}
							{@const disableSit = p.score <= 5 || p.consecutiveSits >= 2}
							<div class="flex justify-between items-center p-4 rounded-xl border transition-all {!isSit ? 'bg-surface-container border-outline' : 'bg-surface-container-low border-outline/30 opacity-60'}">
								<div class="flex items-center gap-3">
									<span class="w-6 h-6 flex items-center justify-center bg-outline/20 text-on-surface-variant rounded-full text-[10px] font-bold">{i + 1}</span>
									<span class="font-headline-lg text-[18px] {!isSit ? 'text-on-surface' : 'text-on-surface-variant'}">{p.name}</span>
								</div>
								<div class="flex bg-surface-container-highest p-1 rounded-DEFAULT">
									<button onclick={() => updateRoundInput(i, 'state', 'standard')} class="px-4 py-2 font-label-sm text-[10px] uppercase rounded-DEFAULT {!isSit ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'}">Play</button>
									<button onclick={() => updateRoundInput(i, 'state', 'sit-out')} disabled={disableSit} class="px-4 py-2 font-label-sm text-[10px] uppercase rounded-DEFAULT disabled:opacity-20 {isSit ? 'bg-surface-variant text-on-surface' : 'text-on-surface-variant'}">Sit</button>
								</div>
							</div>
						{/each}
					{/if}

					{#if roundPhase === 'rumba'}
						{#each players as p, i}
							{#if roundInputs[i].state !== 'sit-out'}
								{@const isRumba = roundInputs[i].state === 'rumba'}
								<div class="flex justify-between items-center p-4 rounded-xl border transition-all {isRumba ? 'bg-primary/10 border-primary ring-1 ring-primary/30' : 'bg-surface-container/50 border-outline'}">
									<div class="flex items-center gap-3">
										<span class="w-6 h-6 flex items-center justify-center bg-outline/20 text-on-surface-variant rounded-full text-[10px] font-bold">{i + 1}</span>
										<span class="font-headline-lg text-[18px] text-on-surface">{p.name}</span>
									</div>
									<button onclick={() => toggleRumba(i)} class="px-5 py-2 font-label-sm text-[10px] uppercase rounded-DEFAULT {isRumba ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-highest text-on-surface-variant'}">
										{isRumba ? 'Rumba!' : 'Call'}
									</button>
								</div>
							{/if}
						{/each}
					{/if}

					{#if roundPhase === 'playing'}
						<div class="flex justify-between items-center px-2 mb-2">
							<span class="font-label-sm text-[10px] text-on-surface-variant uppercase">Tricks Entry</span>
							<span class="font-label-sm text-label-sm {currentTotalTricks === TOTAL_TRICKS ? 'text-primary' : 'text-error'}">{currentTotalTricks} / {TOTAL_TRICKS}</span>
						</div>
						{#each players as p, i}
							{#if roundInputs[i].state !== 'sit-out'}
								<div class="bg-surface-container border border-outline p-4 rounded-xl flex items-center justify-between">
									<div class="flex items-center gap-3">
										<span class="w-6 h-6 flex items-center justify-center bg-outline/20 text-on-surface-variant rounded-full text-[10px] font-bold">{i + 1}</span>
										<div>
											<span class="font-headline-lg text-[18px] text-on-surface block">{p.name}</span>
											{#if roundInputs[i].state === 'rumba'}
												<span class="font-label-sm text-[8px] text-primary uppercase tracking-tighter">Rumba Mode</span>
											{/if}
										</div>
									</div>
									<div class="flex items-center gap-3">
										<button onclick={() => updateRoundInput(i, 'tricks', Math.max(0, roundInputs[i].tricks - 1))} class="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-DEFAULT border border-outline">
											<span class="material-symbols-outlined">remove</span>
										</button>
										<span class="font-display-md text-[24px] w-6 text-center text-primary">{roundInputs[i].tricks}</span>
										<button onclick={() => updateRoundInput(i, 'tricks', roundInputs[i].tricks + 1)} disabled={remainingTricks <= 0} class="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-DEFAULT border border-outline disabled:opacity-30">
											<span class="material-symbols-outlined">add</span>
										</button>
									</div>
								</div>
							{/if}
						{/each}
					{/if}
				</div>

				{#if error}
					<div class="bg-error/10 text-error p-4 rounded-xl border border-error/30 font-label-sm text-[10px] uppercase flex items-center gap-2">
						<span class="material-symbols-outlined text-[16px]">error</span> {error}
					</div>
				{/if}

				<button onclick={() => {
					if (roundPhase === 'calling') {
						if (roundInputs.every(r => r.state === 'sit-out')) error = "Someone must play.";
						else { roundPhase = 'rumba'; error = ''; }
					} else if (roundPhase === 'rumba') { roundPhase = 'playing'; }
					else if (roundPhase === 'playing') { submitRound(); }
				}} class="w-full bg-primary text-on-primary py-5 rounded-DEFAULT font-label-lg text-display-md hover:bg-primary-light transition-all">
					{roundPhase === 'calling' ? 'Confirm Participants' : roundPhase === 'rumba' ? 'Enter Tricks' : 'Submit Round'}
				</button>
			</div>
		{/if}

		<!-- Finished Screen -->
		{#if gameState === 'finished'}
			<div class="p-8 text-center space-y-8">
				<span class="material-symbols-outlined text-[80px] text-primary" style='font-variation-settings: "FILL" 1;'>trophy</span>
				<h2 class="font-display-lg text-display-lg text-on-surface italic">MATCH OVER</h2>
				<div class="space-y-3 text-left">
					{#each [...players].sort((a, b) => a.score - b.score) as p, i}
						<div class="flex items-center justify-between p-5 rounded-xl border-2 {i === 0 ? 'bg-primary/10 border-primary ring-4 ring-primary/10' : 'bg-surface-container/50 border-outline'}">
							<span class="font-headline-lg text-[20px] text-on-surface uppercase">{i + 1}. {p.name}</span>
							<span class="font-display-md text-[24px] {p.score <= 0 ? 'text-primary' : 'text-on-surface-variant'}">{p.score}</span>
						</div>
					{/each}
				</div>
				
				<button onclick={startNewGame} class="w-full bg-primary text-on-primary py-5 rounded-DEFAULT font-label-lg text-display-md hover:bg-primary-light flex items-center justify-center gap-2 transition-all">
					New Game
				</button>
			</div>
		{/if}

	</div>
</main>

<!-- History Modal -->
{#if showHistoryModal}
	<div class="fixed inset-0 bg-background/95 z-[70] flex flex-col p-4 md:p-6 overflow-y-auto backdrop-blur-sm">
		<div class="max-w-2xl mx-auto w-full">
			<div class="flex justify-between items-center mb-6">
				<h2 class="font-display-md text-headline-lg text-primary uppercase italic tracking-tighter flex items-center gap-2">
				   Logbook
				</h2>
				<button onclick={() => showHistoryModal = false} class="p-2 bg-surface-container rounded-full hover:bg-surface-container-high transition-colors text-on-surface">
					<span class="material-symbols-outlined">close</span>
				</button>
			</div>

			<!-- Tabs -->
			<div class="flex gap-2 mb-6 bg-surface-container p-1 rounded-xl border border-outline">
				<button 
					onclick={() => historyTab = 'rounds'}
					class="flex-1 py-3 font-label-sm text-[10px] uppercase rounded-DEFAULT flex items-center justify-center gap-2 transition-colors {historyTab === 'rounds' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
				>
					<span class="material-symbols-outlined text-[16px]">format_list_numbered</span> Current Game
				</button>
				<button 
					onclick={() => historyTab = 'matches'}
					class="flex-1 py-3 font-label-sm text-[10px] uppercase rounded-DEFAULT flex items-center justify-center gap-2 transition-colors {historyTab === 'matches' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}"
				>
					<span class="material-symbols-outlined text-[16px]">trophy</span> Match History
				</button>
			</div>

			{#if historyTab === 'rounds'}
				{#if players[0].history.length === 0}
					<div class="text-center py-20 text-on-surface-variant font-bold uppercase tracking-widest bg-surface-container/30 rounded-xl border border-outline border-dashed">No rounds recorded</div>
				{:else}
					<div class="space-y-4 pb-20">
						{#each [...players[0].history].reverse() as _, revIdx}
							{@const roundIdx = players[0].history.length - 1 - revIdx}
							<div class="bg-surface-container rounded-xl p-5 border border-outline group relative">
								<div class="flex justify-between items-center mb-4 border-b border-outline/30 pb-2">
									<div class="font-label-sm text-[10px] text-on-surface-variant uppercase">Round {roundIdx + 1}</div>
									{#if gameState === 'playing'}
										<button 
											onclick={() => rewindTarget = { index: roundIdx, label: `Round ${roundIdx + 1}` }}
											class="flex items-center gap-1 font-label-sm text-[10px] uppercase text-primary hover:text-primary-light transition-colors bg-primary/10 px-2 py-1 rounded border border-primary/20"
										>
											<span class="material-symbols-outlined text-[14px]">undo</span> Rewind to this
										</button>
									{/if}
								</div>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
									{#each players as p, pIdx}
										<div class="flex justify-between items-center">
											<span class="font-label-sm text-sm text-on-surface">{pIdx + 1}. {p.name}</span>
											<div class="text-right">
												<span class="text-[10px] font-bold px-2 py-0.5 rounded {
													p.history[roundIdx].state === 'rumba' ? 'bg-primary/20 text-primary' : 
													p.history[roundIdx].state === 'sit-out' ? 'bg-outline/20 text-on-surface-variant' : 'bg-surface-container-high text-on-surface'
												}">
													{p.history[roundIdx].tricks} tricks
												</span>
												<span class="ml-2 inline-block min-w-[32px] text-right font-body-md text-sm {p.history[roundIdx].delta > 0 ? 'text-error' : p.history[roundIdx].delta < 0 ? 'text-primary' : 'text-on-surface-variant'}">
													{p.history[roundIdx].delta > 0 ? '+' : ''}{p.history[roundIdx].delta}
												</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}

			{#if historyTab === 'matches'}
				{#if matchHistory.length === 0}
					<div class="text-center py-20 text-on-surface-variant font-bold uppercase tracking-widest bg-surface-container/30 rounded-xl border border-outline border-dashed">No completed matches</div>
				{:else}
					<div class="space-y-4 pb-20">
						{#each matchHistory as match}
							<div class="bg-surface-container rounded-xl p-6 border border-outline">
								<div class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-4">{match.date}</div>
								<div class="space-y-3">
									{#each match.players as p, pIdx}
										<div class="flex justify-between items-center p-3 rounded-DEFAULT border {pIdx === 0 ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-transparent'}">
											<div class="flex items-center gap-2">
												{#if pIdx === 0}
													<span class="material-symbols-outlined text-[16px] text-primary" style='font-variation-settings: "FILL" 1;'>trophy</span>
												{/if}
												<span class="font-label-sm {pIdx === 0 ? 'text-on-surface' : 'text-on-surface-variant'}">
													{pIdx + 1}. {p.name}
												</span>
											</div>
											<span class="font-display-md text-headline-lg {pIdx === 0 ? 'text-primary' : 'text-on-surface-variant'}">
												{p.score} <span class="font-label-sm text-[10px] text-on-surface-variant uppercase">pts</span>
											</span>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<!-- Confirmation Modal -->
{#if rewindTarget !== null}
	<div class="fixed inset-0 bg-background/90 z-[80] flex items-center justify-center p-6 backdrop-blur-sm">
		<div class="bg-surface-container border border-outline p-8 rounded-xl max-w-sm w-full text-center shadow-2xl">
			<div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border {rewindTarget.index === -1 ? 'bg-error/10 text-error border-error/20' : 'bg-primary/10 text-primary border-primary/20'}">
				<span class="material-symbols-outlined text-[32px]">{rewindTarget.index === -1 ? 'warning' : 'undo'}</span>
			</div>
			<h3 class="font-headline-lg text-[20px] text-on-surface mb-2 uppercase">
				{rewindTarget.index === -1 ? 'Reset Game?' : `Rewind to ${rewindTarget.label}?`}
			</h3>
			<p class="font-body-md text-sm text-on-surface-variant mb-8">
				{rewindTarget.index === -1 
					? 'This will clear all scores and return to player setup. This cannot be undone.' 
					: `All rounds following ${rewindTarget.label} will be deleted. This cannot be undone.`}
			</p>
			<div class="grid grid-cols-2 gap-3">
				<button onclick={() => rewindTarget = null} class="py-4 bg-surface-container-high rounded-DEFAULT font-label-sm text-[10px] uppercase hover:bg-surface-container-highest transition-colors text-on-surface">Cancel</button>
				<button 
					onclick={rewindTarget.index === -1 ? startNewGame : performRewind} 
					class="py-4 text-on-primary rounded-DEFAULT font-label-sm text-[10px] uppercase {rewindTarget.index === -1 ? 'bg-error hover:opacity-90' : 'bg-primary hover:bg-primary-light'} transition-colors"
				>
					Confirm
				</button>
			</div>
		</div>
	</div>
{/if}

<Footer />

<style>
	/* Material Symbols loading is usually handled at layout level, 
	   but assuming it is available as per existing components. */
	
	/* Adding some custom animations for transitions */
	.animate-pulse-custom {
		animation: pulse-custom 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse-custom {
		0%, 100% { opacity: 1; }
		50% { opacity: .5; }
	}
</style>
