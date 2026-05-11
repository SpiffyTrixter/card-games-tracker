<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import { confirmDialog } from '$lib/utils/dialogs';

	let {
		gameManager,
		isOpen = $bindable(false),
		onRewind
	}: {
		gameManager: GameManager;
		isOpen: boolean;
		onRewind?: (index: number) => void;
	} = $props();

	let activeTab = $state<'rounds' | 'matches'>('rounds');

	const roundsCount = $derived(gameManager.session.players[0]?.history.length || 0);
	const roundIndices = $derived(Array.from({ length: roundsCount }, (_, i) => i).reverse());

	async function handleRewind(index: number) {
		const confirmed = await confirmDialog({
			text: `Rewind game to the end of round ${index + 1}?`,
			confirmButtonText: 'Rewind',
			cancelButtonText: 'Cancel'
		});

		if (confirmed) {
			gameManager.rewindTo(index);
			if (onRewind) onRewind(index);
			isOpen = false;
		}
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content
		class="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0 sm:max-w-[90vw] md:max-w-2xl"
	>
		<Dialog.Header class="border-b border-border bg-muted/30 px-6 py-4">
			<Dialog.Title class="text-headline-sm font-display-md flex items-center gap-2 text-primary">
				<span class="material-symbols-outlined">history</span> Game History
			</Dialog.Title>
		</Dialog.Header>

		<div class="flex border-b border-border bg-muted/10">
			<button
				onclick={() => (activeTab = 'rounds')}
				class="font-label-lg flex-1 border-b-2 py-4 transition-all {activeTab === 'rounds'
					? 'border-primary bg-primary/5 text-primary'
					: 'border-transparent text-muted-foreground'}"
			>
				Rounds
			</button>
			<button
				onclick={() => (activeTab = 'matches')}
				class="font-label-lg flex-1 border-b-2 py-4 transition-all {activeTab === 'matches'
					? 'border-primary bg-primary/5 text-primary'
					: 'border-transparent text-muted-foreground'}"
			>
				Matches
			</button>
		</div>

		<div class="grow space-y-4 overflow-y-auto p-4 md:p-6">
			{#if activeTab === 'rounds'}
				{#if roundsCount === 0}
					<div class="py-12 text-center text-muted-foreground italic">No rounds played yet.</div>
				{:else}
					{#each roundIndices as roundIndex (roundIndex)}
						<div class="overflow-hidden rounded-xl border border-border/50 bg-muted/30">
							<div
								class="flex items-center justify-between border-b border-border/50 bg-muted/50 p-3"
							>
								<span class="font-label-md text-primary">Round {roundIndex + 1}</span>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => handleRewind(roundIndex)}
									class="h-8 gap-1 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary"
								>
									<span class="material-symbols-outlined text-sm">settings_backup_restore</span>
									Rewind here
								</Button>
							</div>
							<div class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
								{#each gameManager.session.players as player (player.id)}
									{@const entry = player.history[roundIndex]}
									<div class="flex flex-col">
										<span
											class="truncate text-[10px] tracking-tighter text-muted-foreground uppercase"
											>{player.name}</span
										>
										<div class="flex items-baseline gap-1">
											<span class="text-lg font-bold">{entry.scoreAfter}</span>
											<span
												class="text-[11px]"
												class:text-destructive={entry.delta > 0}
												class:text-primary={entry.delta < 0}
											>
												({entry.delta > 0 ? '+' : ''}{entry.delta})
											</span>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				{/if}
			{:else}
				<div class="py-12 text-center text-muted-foreground italic">Match history coming soon.</div>
			{/if}
		</div>

		<Dialog.Footer class="border-t border-border bg-muted/30 px-6 py-4">
			<Button onclick={() => (isOpen = false)} size="lg" class="font-label-lg w-full md:w-auto"
				>Close</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
