<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	import Footer from '$components/shared/Footer.svelte';
	import Header from '$components/shared/Header.svelte';
	import RulesModal from '$components/shared/RulesModal.svelte';
	import { PersistenceService } from '$lib/services/persistence';
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import { gameStatus } from '$lib/state/gameStatus.svelte';
	import type { Game } from '$lib/types/game';

	import GameHistory from './GameHistory.svelte';

	let {
		game,
		gameManager,
		children
	}: {
		game: Game;
		gameManager: GameManager;
		children: Snippet;
	} = $props();

	let isRulesOpen = $state(false);
	let isHistoryOpen = $state(false);

	$effect(() => {
		const inProgress = gameManager.session.state === 'playing';

		if (inProgress) {
			gameStatus.currentGameId = game.id;
			gameStatus.stopGame = () => {
				gameManager.reset();
				PersistenceService.clearSession(game.id);
			};
			gameStatus.headerState = {
				title: game.title,
				showSearch: false,
				actions: [
					{ icon: 'history', label: 'History', onclick: () => (isHistoryOpen = true) },
					{ icon: 'info', label: 'Rules', onclick: () => (isRulesOpen = true) }
				]
			};
			gameStatus.isGameInProgress = true;
		} else {
			gameStatus.headerState = { title: 'Games', showSearch: true, actions: undefined };
			gameStatus.isGameInProgress = false;
			gameStatus.currentGameId = null;
			gameStatus.stopGame = undefined;
		}
	});

	onMount(() => {
		return () => {
			gameStatus.isGameInProgress = false;
			gameStatus.currentGameId = null;
			gameStatus.stopGame = undefined;
			gameStatus.headerState = { title: 'Games', showSearch: true, actions: undefined };
		};
	});
</script>

<Header />

<main
	class="mx-auto flex w-full max-w-max-width grow flex-col gap-6 px-margin-mobile py-6 md:gap-8 md:px-margin-desktop md:py-12"
>
	<!-- Hero Header -->
	{#if gameManager.session.state === 'setup'}
		<section
			class="group relative w-full overflow-hidden rounded-xl border border-outline bg-surface-felt"
		>
			<div
				class="relative z-10 flex flex-col items-stretch justify-between gap-6 p-6 md:flex-row md:items-center md:p-16"
			>
				<div class="flex max-w-2xl flex-col gap-4 md:gap-6">
					<h2
						class="font-display-md text-primary-light md:font-display-lg text-headline-lg drop-shadow-md md:text-display-lg"
					>
						{game.title}
					</h2>
					<p
						class="font-body-md md:font-body-lg max-w-xl text-body-md text-on-surface-variant md:text-body-lg"
					>
						{game.description}
					</p>
				</div>
				<div
					class="flex items-center justify-between gap-4 self-stretch text-right md:flex-col md:items-end md:justify-end md:gap-6"
				>
					<div class="flex flex-col items-center md:mb-auto md:items-end">
						<div
							class="font-display-sm text-headline-md text-primary-container md:font-display-md md:text-headline-lg"
						>
							{game.players.min}-{game.players.max}
						</div>
						<div
							class="font-label-sm md:text-label-sm text-[10px] tracking-wider text-on-surface-variant uppercase"
						>
							Players
						</div>
					</div>
					<button
						onclick={() => (isRulesOpen = true)}
						class="font-label-sm flex items-center gap-2 rounded-DEFAULT border border-outline bg-surface/30 px-4 py-2 text-[10px] tracking-wider text-primary uppercase backdrop-blur-md transition-colors duration-300 hover:border-primary"
					>
						<span class="material-symbols-outlined text-[18px]">info</span>
						Rules
					</button>
				</div>
			</div>
		</section>
	{/if}

	<div
		class="bg-surface-container/30 relative flex w-full flex-col overflow-hidden rounded-xl border border-outline shadow-2xl backdrop-blur-sm"
	>
		{@render children()}
	</div>
</main>

<RulesModal bind:isOpen={isRulesOpen} title={game.title} rules={game.rules} />

<GameHistory {gameManager} bind:isOpen={isHistoryOpen} />

<Footer />
