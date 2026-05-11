<script lang="ts">
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import { slide } from 'svelte/transition';

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
		class="flex items-center justify-between rounded-xl border border-outline bg-surface-container-high px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container-highest"
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
			<div class="mt-2 overflow-x-auto rounded-xl border border-outline bg-surface-container/30">
				<table class="w-full border-collapse text-left">
					<thead>
						<tr class="border-b border-outline bg-surface-container-high/50">
							<th
								class="px-4 py-3 font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase md:px-6"
							>
								Round
							</th>
							{#each players as player (player.id)}
								<th
									class="px-4 py-3 font-label-sm text-[10px] tracking-widest text-on-surface-variant uppercase md:px-6"
								>
									{player.name}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody class="font-body-sm text-sm md:text-base">
						{#each Array.from({ length: roundCount }) as _, roundIndex (roundIndex)}
							<tr
								class="border-b border-outline/30 transition-colors hover:bg-surface-container/50"
							>
								<td class="px-4 py-3 font-medium text-on-surface-variant md:px-6">
									{roundIndex + 1}
								</td>
								{#each players as player (player.id)}
									{@const entry = player.history[roundIndex]}
									<td class="px-4 py-3 md:px-6">
										{#if entry}
											<div class="flex flex-col">
												<span
													class="font-display-sm"
													class:text-error={entry.delta > 0}
													class:text-primary={entry.delta < 0}
												>
													{entry.delta > 0 ? '+' : ''}{entry.delta}
												</span>
												<span class="text-[10px] text-on-surface-variant/60">
													Score: {entry.scoreAfter}
												</span>
											</div>
										{:else}
											<span class="text-on-surface-variant/20">—</span>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr class="bg-primary/5 font-bold text-primary">
							<td class="font-label-md px-4 py-4 tracking-widest uppercase md:px-6"> Total </td>
							{#each players as player (player.id)}
								<td class="px-4 py-4 md:px-6">
									<div class="flex flex-col">
										<span class="font-display-md text-lg md:text-xl">
											{player.score}
										</span>
									</div>
								</td>
							{/each}
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	{/if}
</div>
