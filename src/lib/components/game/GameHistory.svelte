<script lang="ts">
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

{#if isOpen}
	<div class="fixed inset-0 z-110 flex items-center justify-center p-4">
		<button
			class="absolute inset-0 bg-background/90 backdrop-blur-md"
			onclick={() => (isOpen = false)}
			onkeydown={(e) => e.key === 'Escape' && (isOpen = false)}
			aria-label="Close history"
		></button>

		<div
			class="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-outline bg-surface shadow-2xl"
		>
			<div class="flex items-center justify-between border-b border-outline p-6">
				<h3 class="text-headline-md flex items-center gap-2 font-display-md text-primary">
					<span class="material-symbols-outlined">history</span> Game History
				</h3>
				<button
					onclick={() => (isOpen = false)}
					class="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant"
				>
					<span class="material-symbols-outlined">close</span>
				</button>
			</div>

			<div class="flex border-b border-outline">
				<button
					onclick={() => (activeTab = 'rounds')}
					class="flex-1 border-b-2 py-4 font-label-lg transition-colors"
					class:border-primary={activeTab === 'rounds'}
					class:text-primary={activeTab === 'rounds'}
					class:border-transparent={activeTab !== 'rounds'}
					class:text-on-surface-variant={activeTab !== 'rounds'}
				>
					Rounds
				</button>
				<button
					onclick={() => (activeTab = 'matches')}
					class="flex-1 border-b-2 py-4 font-label-lg transition-colors"
					class:border-primary={activeTab === 'matches'}
					class:text-primary={activeTab === 'matches'}
					class:border-transparent={activeTab !== 'matches'}
					class:text-on-surface-variant={activeTab !== 'matches'}
				>
					Matches
				</button>
			</div>

			<div class="grow space-y-4 overflow-y-auto p-4">
				{#if activeTab === 'rounds'}
					{#if roundsCount === 0}
						<div class="py-12 text-center text-on-surface-variant italic">
							No rounds played yet.
						</div>
					{:else}
						{#each roundIndices as roundIndex (roundIndex)}
							<div
								class="overflow-hidden rounded-xl border border-outline/30 bg-surface-container/40"
							>
								<div
									class="flex items-center justify-between border-b border-outline/30 bg-surface-container/60 p-3"
								>
									<span class="font-label-md text-primary">Round {roundIndex + 1}</span>
									<button
										onclick={() => handleRewind(roundIndex)}
										class="flex items-center gap-1 rounded px-2 py-1 font-label-sm text-[12px] text-primary transition-colors hover:bg-primary/10"
									>
										<span class="material-symbols-outlined text-[14px]"
											>settings_backup_restore</span
										> Rewind here
									</button>
								</div>
								<div class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
									{#each gameManager.session.players as player (player.id)}
										{@const entry = player.history[roundIndex]}
										<div class="flex flex-col">
											<span
												class="truncate text-[10px] tracking-tighter text-on-surface-variant uppercase"
												>{player.name}</span
											>
											<div class="flex items-baseline gap-1">
												<span class="text-headline-sm font-display-sm">{entry.scoreAfter}</span>
												<span
													class="text-[11px]"
													class:text-error={entry.delta > 0}
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
					<div class="py-12 text-center text-on-surface-variant italic">
						Match history coming soon.
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
