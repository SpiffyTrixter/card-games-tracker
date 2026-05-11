<script lang="ts">
	import GameCard from '$components/home/GameCard.svelte';
	import { libraryGames } from '$data/games';
</script>

<section class="flex flex-col gap-8">
	<div class="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
		{#each libraryGames as game (game.title)}
			<GameCard {...game} />
		{/each}
	</div>
</section>
