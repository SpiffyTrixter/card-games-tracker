<script lang="ts">
	import { untrack } from 'svelte';

	import { page } from '$app/state';
	import GameLayout from '$lib/components/game/shared/GameLayout.svelte';
	import GameOver from '$lib/components/game/shared/GameOver.svelte';
	import GameSetup from '$lib/components/game/shared/GameSetup.svelte';
	import Scoreboard from '$lib/components/game/shared/Scoreboard.svelte';
	import ScoreTable from '$lib/components/game/shared/ScoreTable.svelte';
	import { getGameById } from '$lib/games';
	import * as m from '$lib/paraglide/messages.js';
	import { GameManager } from '$lib/state/gameManager.svelte';

	const id = $derived(page.params.id as string);
	const game = $derived(getGameById(id));

	let gm = $state<GameManager | null>(null);

	$effect(() => {
		const currentGameId = game?.id;

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
		<h1 class="text-4xl font-bold">{m.game_not_found()}</h1>
		<p class="mt-4 text-muted-foreground">{m.game_not_found_description()}</p>
		<a href="/" class="mt-8 text-primary hover:underline">{m.return_to_library()}</a>
	</div>
{:else if gm}
	<GameLayout {game} gameManager={gm}>
		{#if gm.session.state === 'setup'}
			{#if game.components?.setup}
				{#await game.components.setup() then module}
					{@const Setup = module.default}
					<Setup gameManager={gm} playersLimit={game.players} onStart={startGame} />
				{/await}
			{:else}
				<GameSetup gameManager={gm} playersLimit={game.players} onStart={startGame} />
			{/if}
		{:else if gm.session.state === 'playing'}
			<div class="flex flex-col gap-2">
				{#if game.components?.scoreboard}
					{#await game.components.scoreboard() then module}
						{@const ScoreboardComp = module.default}
						<ScoreboardComp gameManager={gm} />
					{/await}
				{:else}
					<Scoreboard gameManager={gm} />
				{/if}

				{#if game.components?.scoreTable}
					{#await game.components.scoreTable() then module}
						{@const ScoreTableComp = module.default}
						<ScoreTableComp gameManager={gm} />
					{/await}
				{:else}
					<ScoreTable gameManager={gm} />
				{/if}

				{#if game.components?.play}
					{#await game.components.play()}
						<div class="p-4 text-center opacity-50">{m.loading_interface()}</div>
					{:then module}
						{@const Play = module.default}
						<div class="grow">
							<Play gameManager={gm} />
						</div>
					{/await}
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
							<h3 class="text-xl font-bold text-on-surface">{m.under_development()}</h3>
							<p class="mt-1 text-on-surface-variant">
								{m.under_development_description({
									title: typeof game.title === 'function' ? game.title() : game.title
								})}
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
