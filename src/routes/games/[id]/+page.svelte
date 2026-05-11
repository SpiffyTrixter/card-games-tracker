<script lang="ts">
	import { untrack } from 'svelte';

	import { page } from '$app/state';
	import GameLayout from '$lib/components/game/shared/GameLayout.svelte';
	import GameOver from '$lib/components/game/shared/GameOver.svelte';
	import GameSetup from '$lib/components/game/shared/GameSetup.svelte';
	import Scoreboard from '$lib/components/game/shared/Scoreboard.svelte';
	import ScoreTable from '$lib/components/game/shared/ScoreTable.svelte';
	import { getGameById } from '$lib/data/games/registry';
	import { GameManager } from '$lib/state/gameManager.svelte';

	const id = $derived(page.params.id as string);
	const game = $derived(getGameById(id));

	let gm = $state<GameManager | null>(null);

	// Recreate GM only when game ID actually changes
	$effect(() => {
		const currentGameId = game?.id;

		// Use untrack to ensure that changes to gm.session (like state)
		// don't trigger this effect to re-run and recreate the manager.
		untrack(() => {
			if (currentGameId) {
				if (!gm || gm.session.gameId !== currentGameId) {
					gm = new GameManager(game!);
				}
			} else {
				gm = null;
			}
		});
	});

	function startGame() {
		if (gm && game) {
			gm.startGame(game.initialScore || 0);
		}
	}
</script>

{#if !game}
	<div class="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
		<h1 class="text-4xl font-bold">Game Not Found</h1>
		<p class="mt-4 text-muted-foreground">The game you are looking for does not exist.</p>
		<a href="/" class="mt-8 text-primary hover:underline">Return to Library</a>
	</div>
{:else if gm}
	<GameLayout {game} gameManager={gm}>
		{#if gm.session.state === 'setup'}
			{@const Setup = game.components?.setup || GameSetup}
			<Setup gameManager={gm} playersLimit={game.players} onStart={startGame} />
		{:else if gm.session.state === 'playing'}
			{@const ScoreboardComp = game.components?.scoreboard || Scoreboard}
			{@const ScoreTableComp = game.components?.scoreTable || ScoreTable}
			<div class="flex flex-col gap-6 md:gap-8">
				<ScoreboardComp gameManager={gm} />
				<ScoreTableComp gameManager={gm} />

				{#if game.components?.play}
					{@const Play = game.components.play}
					<div class="grow">
						<Play gameManager={gm} />
					</div>
				{:else}
					<div class="flex flex-col items-center gap-4 py-24 text-center">
						<div
							class="bg-surface-container flex h-16 w-16 items-center justify-center rounded-full"
						>
							<span class="material-symbols-outlined text-3xl text-on-surface-variant"
								>construction</span
							>
						</div>
						<div>
							<h3 class="text-xl font-bold text-on-surface">Under Development</h3>
							<p class="mt-1 text-on-surface-variant">
								The specialized tracking UI for {game.title} is being refined.
							</p>
						</div>
					</div>
				{/if}
			</div>
		{:else if gm.session.state === 'finished'}
			<GameOver gameManager={gm} />
		{/if}
	</GameLayout>
{/if}
