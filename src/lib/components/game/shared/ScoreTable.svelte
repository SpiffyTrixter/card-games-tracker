<script lang="ts">
	import { slide } from 'svelte/transition';

	import * as Table from '$lib/components/ui/table/index.js';
	import type { GameManager } from '$lib/state/gameManager.svelte';

	let { gameManager }: { gameManager: GameManager } = $props();

	let isExpanded = $state(false);

	const players = $derived(gameManager.session.players);
	const roundCount = $derived(
		players.length > 0 ? Math.max(...players.map((p) => p.history.length)) : 0
	);
</script>

<div class="flex flex-col gap-2 p-4 pt-0 md:p-8 md:pt-0">
	<button
		onclick={() => (isExpanded = !isExpanded)}
		class="flex items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 text-muted-foreground transition-colors hover:bg-muted"
	>
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-primary">analytics</span>
			<span class="font-label-lg tracking-wider uppercase">Score Table</span>
		</div>
		<span
			class="material-symbols-outlined transition-transform duration-300"
			style="transform: rotate({isExpanded ? '180deg' : '0deg'})"
		>
			expand_more
		</span>
	</button>

	{#if isExpanded}
		<div transition:slide class="overflow-hidden">
			<div class="mt-2 overflow-x-auto rounded-xl border border-border bg-muted/30">
				<Table.Root>
					<Table.Header class="bg-muted/50">
						<Table.Row class="border-b border-border">
							<Table.Head
								class="font-label-sm text-[10px] tracking-widest text-muted-foreground uppercase md:px-6"
								>Round</Table.Head
							>
							{#each players as player (player.id)}
								<Table.Head
									class="font-label-sm text-[10px] tracking-widest text-muted-foreground uppercase md:px-6"
									>{player.name}</Table.Head
								>
							{/each}
						</Table.Row>
					</Table.Header>
					<Table.Body class="font-body-sm text-sm md:text-base">
						{#each Array.from({ length: roundCount }) as _, roundIndex (roundIndex)}
							<Table.Row class="border-b border-border/30 transition-colors hover:bg-muted/50">
								<Table.Cell class="font-medium text-muted-foreground md:px-6"
									>{roundIndex + 1}</Table.Cell
								>
								{#each players as player (player.id)}
									{@const entry = player.history[roundIndex]}
									<Table.Cell class="md:px-6">
										{#if entry}
											<div class="flex flex-col">
												<span
													class="font-display-sm"
													class:text-destructive={entry.delta > 0}
													class:text-primary={entry.delta < 0}
												>
													{entry.delta > 0 ? '+' : ''}{entry.delta}
												</span>
												<span class="text-[10px] text-muted-foreground/60">
													Score: {entry.scoreAfter}
												</span>
											</div>
										{:else}
											<span class="text-muted-foreground/20">—</span>
										{/if}
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					</Table.Body>
					<Table.Footer class="bg-primary/5 font-bold text-primary">
						<Table.Row>
							<Table.Cell class="font-label-md tracking-widest uppercase md:px-6">Total</Table.Cell>
							{#each players as player (player.id)}
								<Table.Cell class="md:px-6">
									<div class="flex flex-col">
										<span class="font-display-md text-lg md:text-xl">
											{player.score}
										</span>
									</div>
								</Table.Cell>
							{/each}
						</Table.Row>
					</Table.Footer>
				</Table.Root>
			</div>
		</div>
	{/if}
</div>
