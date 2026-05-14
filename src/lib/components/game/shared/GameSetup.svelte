<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import { Button } from '$components/ui/button/index.js';
	import { Input } from '$components/ui/input/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import type { Players, PlayerState } from '$lib/types/game';

	let {
		gameManager,
		playersLimit,
		onStart,
		extraSettings
	}: {
		gameManager: GameManager;
		playersLimit: Players;
		onStart: () => void;
		extraSettings?: import('svelte').Snippet;
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
				class="font-display-sm text-headline-sm md:font-headline-lg flex items-center gap-2 text-primary md:text-[20px]"
			>
				<span class="material-symbols-outlined">person_add</span>
				{m.players()}
			</h2>
			<p class="font-label-sm text-[10px] text-muted-foreground md:text-[11px]">
				{m.drag_to_change_sequence()}
			</p>
		</div>
		<Button
			variant="outline"
			size="sm"
			onclick={addPlayer}
			disabled={gameManager.session.players.length >= playersLimit.max}
			class="gap-1 border-border bg-muted hover:border-primary"
		>
			<span class="material-symbols-outlined text-[16px]">add</span>
			{m.add()}
		</Button>
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
				class="flex items-center gap-2 rounded-xl border border-border/30 bg-muted/40 p-2 md:gap-3 md:p-3"
			>
				<div
					class="flex cursor-grab items-center px-1 text-muted-foreground/50 active:cursor-grabbing md:px-2"
				>
					<span class="material-symbols-outlined text-[20px] md:text-[24px]">drag_indicator</span>
				</div>

				<div class="min-w-0 grow">
					<Input
						bind:value={player.name}
						placeholder={m.enter_name()}
						class="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md w-full border-none bg-transparent py-1 text-foreground shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
						aria-label={`Player name input for ${player.name}`}
					/>
				</div>

				<Button
					variant="ghost"
					size="icon"
					onclick={() => gameManager.removePlayer(player.id)}
					disabled={gameManager.session.players.length <= playersLimit.min}
					class="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
					aria-label={`Remove player ${player.name}`}
				>
					<span class="material-symbols-outlined text-[20px]">delete</span>
				</Button>
			</div>
		{/each}
	</div>

	{#if extraSettings}
		{@render extraSettings()}
	{/if}

	<div class="border-t border-border/30 pt-4 md:pt-6">
		<Button
			onclick={onStart}
			disabled={gameManager.session.players.length < playersLimit.min}
			class="w-full py-6 text-lg font-bold shadow-lg"
		>
			<span class="material-symbols-outlined text-[24px]">play_circle</span>
			{m.commence()}
		</Button>
	</div>
</div>
