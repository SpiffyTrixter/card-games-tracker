<script lang="ts">
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import { slide } from 'svelte/transition';

	let { gameManager }: { gameManager: GameManager } = $props();

	const sortedPlayers = $derived(
		[...gameManager.session.players].sort((a, b) => a.score - b.score)
	);
</script>

<div
	class="grid grid-cols-2 gap-2 bg-surface-container/20 p-4 sm:grid-cols-3 md:grid-cols-4 md:gap-4 md:p-6"
>
	{#each sortedPlayers as player (player.id)}
		<div
			class="flex flex-col items-center gap-0.5 rounded-xl border border-outline/30 bg-surface p-2 transition-all md:gap-1 md:p-4"
			class:ring-2={player.score === sortedPlayers[0].score &&
				gameManager.session.players.length > 1}
			class:ring-primary={player.score === sortedPlayers[0].score &&
				gameManager.session.players.length > 1}
		>
			<span
				class="w-full truncate text-center font-label-sm text-[10px] text-on-surface-variant uppercase md:text-label-sm"
			>
				{player.name}
			</span>
			<div
				class="font-display-sm text-headline-lg text-primary md:font-display-md md:text-display-md"
			>
				{player.score}
			</div>
			{#if player.history.length > 0}
				{@const lastDelta = player.history[player.history.length - 1].delta}
				<span
					class="font-label-sm text-label-sm"
					class:text-error={lastDelta > 0}
					class:text-primary={lastDelta < 0}
					class:text-on-surface-variant={lastDelta === 0}
					transition:slide
				>
					{lastDelta > 0 ? '+' : ''}{lastDelta}
				</span>
			{/if}
		</div>
	{/each}
</div>
