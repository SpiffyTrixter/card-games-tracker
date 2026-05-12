<script lang="ts">
	import { slide } from 'svelte/transition';

	import * as Card from '$components/ui/card/index.js';
	import type { GameManager } from '$lib/state/gameManager.svelte';

	let { gameManager }: { gameManager: GameManager } = $props();

	const sortedPlayers = $derived(
		[...gameManager.session.players].sort((a, b) => a.score - b.score)
	);
</script>

<div class="grid grid-cols-2 gap-2 bg-muted/20 p-4 sm:grid-cols-3 md:grid-cols-4 md:gap-4 md:p-6">
	{#each sortedPlayers as player (player.id)}
		<Card.Root
			class="flex flex-col items-center gap-0.5 rounded-xl border border-border/30 bg-card p-2 transition-all md:gap-1 md:p-4 {player.score ===
				sortedPlayers[0].score && gameManager.session.players.length > 1
				? 'ring-2 ring-primary'
				: ''}"
		>
			<span
				class="font-label-sm md:text-label-sm w-full truncate text-center text-[10px] text-muted-foreground uppercase"
			>
				{player.name}
			</span>
			<div
				class="font-display-sm md:font-display-md text-headline-lg text-primary md:text-display-md"
			>
				{player.score}
			</div>
			{#if player.history.length > 0}
				{@const lastDelta = player.history[player.history.length - 1].delta}
				<span
					class="font-label-sm text-label-sm"
					class:text-destructive={lastDelta > 0}
					class:text-primary={lastDelta < 0}
					class:text-muted-foreground={lastDelta === 0}
					transition:slide
				>
					{lastDelta > 0 ? '+' : ''}{lastDelta}
				</span>
			{/if}
		</Card.Root>
	{/each}
</div>
