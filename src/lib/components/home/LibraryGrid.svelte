<script lang="ts">
	import GameCard from '$components/home/GameCard.svelte';
	import { libraryGames } from '$lib/games';
	import { m } from '$lib/paraglide/messages.js';
	import { gameStatus } from '$lib/state/gameStatus.svelte';
	import { unwrap } from '$lib/utils/i18n';

	const filteredGames = $derived(
		libraryGames.filter((game) => {
			const query = gameStatus.searchQuery.toLowerCase().trim();
			if (!query) return true;

			const title = unwrap(game.title).toLowerCase();
			const description = unwrap(game.description).toLowerCase();
			const category = unwrap(game.category).toLowerCase();

			return title.includes(query) || description.includes(query) || category.includes(query);
		})
	);
</script>

<section class="flex flex-col gap-8">
	{#if filteredGames.length > 0}
		<div class="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
			{#each filteredGames as game (game.id)}
				<GameCard {...game} />
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-20 text-center">
			<div
				class="bg-surface-container mb-4 flex h-16 w-16 items-center justify-center rounded-full text-muted-foreground"
			>
				<span class="material-symbols-outlined text-3xl">search_off</span>
			</div>
			<h3 class="text-xl font-bold">{m.no_games_found()}</h3>
			<p class="mt-1 text-muted-foreground">{m.no_games_found_description()}</p>
		</div>
	{/if}
</section>
