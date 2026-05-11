<script lang="ts">
	import { fade } from 'svelte/transition';

	import type { GameManager } from '$lib/state/gameManager.svelte';

	let { gameManager }: { gameManager: GameManager } = $props();

	// Assuming lowest score wins by default if it's a card game,
	// but we should probably check a game setting in the future.
	// For now, let's just sort and take the first one.
	const sortedPlayers = $derived(
		[...gameManager.session.players].sort((a, b) => a.score - b.score)
	);
	const winner = $derived(sortedPlayers[0]);
</script>

<div class="flex flex-col items-center gap-8 p-12 text-center" in:fade>
	<div
		class="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-primary"
	>
		<span class="material-symbols-outlined text-[64px]">workspace_premium</span>
	</div>
	<div>
		<h2 class="font-display-lg text-display-lg text-primary">Victory!</h2>
		<p class="font-headline-md mt-2 text-on-surface-variant">
			{winner.name} has claimed the win.
		</p>
	</div>

	<div
		class="bg-surface-container/30 w-full max-w-md space-y-4 rounded-2xl border border-outline p-6"
	>
		<h3 class="font-label-lg tracking-widest text-on-surface-variant uppercase">Final Standings</h3>
		{#each sortedPlayers as player (player.id)}
			<div class="flex items-center justify-between">
				<span class="font-headline-sm">{player.name}</span>
				<span class="font-display-sm text-primary">{player.score}</span>
			</div>
		{/each}
	</div>

	<button
		onclick={() => gameManager.reset()}
		class="font-label-lg hover:bg-primary-light rounded-xl bg-primary px-12 py-4 text-surface shadow-xl transition-all"
	>
		New Match
	</button>
</div>
