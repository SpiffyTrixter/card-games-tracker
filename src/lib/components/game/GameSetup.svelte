<script lang="ts">
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import type { Players, PlayerState } from '$lib/types/game';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	let {
		gameManager,
		playersLimit,
		onStart
	}: {
		gameManager: GameManager;
		playersLimit: Players;
		onStart: () => void;
	} = $props();

	function addPlayer() {
		if (gameManager.session.players.length < playersLimit.max) {
			gameManager.addPlayer('');
		}
	}

	function handleDndConsider(e: CustomEvent<{ items: PlayerState[] }>) {
		gameManager.session.players = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent<{ items: PlayerState[] }>) {
		gameManager.session.players = e.detail.items;
	}
</script>

<div class="space-y-4 p-6 md:space-y-6 md:p-8">
	<div class="flex items-end justify-between">
		<div class="space-y-1">
			<h2
				class="font-display-sm text-headline-sm flex items-center gap-2 text-primary md:font-headline-lg md:text-[20px]"
			>
				<span class="material-symbols-outlined">person_add</span> Players
			</h2>
			<p class="font-label-sm text-[10px] text-on-surface-variant/60 md:text-[11px]">
				Drag to change sequence
			</p>
		</div>
		<button
			onclick={addPlayer}
			disabled={gameManager.session.players.length >= playersLimit.max}
			class="rounded-DEFAULT border border-outline bg-surface-container px-3 py-1.5 font-label-sm text-[11px] transition-colors hover:border-primary disabled:opacity-30 md:px-4 md:py-2 md:text-label-sm"
		>
			+ Add
		</button>
	</div>

	<div
		class="space-y-2 md:space-y-3"
		use:dndzone={{ items: gameManager.session.players, flipDurationMs: 200 }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each gameManager.session.players as player (player.id)}
			<div
				animate:flip={{ duration: 200 }}
				class="flex items-center gap-2 rounded-xl border border-outline/30 bg-surface-container/40 p-2 md:gap-3 md:p-3"
			>
				<div
					class="flex cursor-grab items-center px-1 text-on-surface-variant/30 active:cursor-grabbing md:px-2"
				>
					<span class="material-symbols-outlined text-[20px] md:text-[24px]">drag_indicator</span>
				</div>

				<div class="min-w-0 grow">
					<input
						bind:value={player.name}
						placeholder="Enter Name"
						class="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md w-full border-none bg-transparent py-1 text-on-surface placeholder:text-on-surface-variant/20 focus:ring-0"
					/>
				</div>

				<button
					onclick={() => gameManager.removePlayer(player.id)}
					disabled={gameManager.session.players.length <= playersLimit.min}
					class="flex h-8 w-8 items-center justify-center text-on-surface-variant transition-colors hover:text-error disabled:opacity-0 md:h-10 md:w-10"
				>
					<span class="material-symbols-outlined text-[20px]">delete</span>
				</button>
			</div>
		{/each}
	</div>

	<div class="border-t border-outline/30 pt-4 md:pt-6">
		<button
			onclick={onStart}
			disabled={gameManager.session.players.length < playersLimit.min}
			class="text-headline-sm md:text-headline-md flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-display-md text-surface shadow-lg transition-all hover:bg-primary-light hover:shadow-primary/20 disabled:bg-outline/20 disabled:text-on-surface-variant/40 md:py-5"
		>
			<span class="material-symbols-outlined">play_circle</span>
			Commence
		</button>
	</div>
</div>
