<script lang="ts">
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import type { Game } from '$lib/types/game';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import RulesModal from '$lib/components/RulesModal.svelte';
	import GameHistory from './GameHistory.svelte';
	import { isGameInProgress, headerState } from '$lib/stores/gameStatus';
	import { onMount, type Snippet } from 'svelte';

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
		isGameInProgress.set(inProgress);

		if (inProgress) {
			headerState.set({
				title: game.title,
				showSearch: false,
				actions: [
					{
						icon: 'history',
						label: 'History',
						onclick: () => (isHistoryOpen = true)
					},
					{
						icon: 'info',
						label: 'Rules',
						onclick: () => (isRulesOpen = true)
					}
				]
			});
		} else {
			headerState.set({
				title: 'Games',
				showSearch: true,
				actions: undefined
			});
		}
	});

	onMount(() => {
		return () => {
			isGameInProgress.set(false);
			headerState.set({ title: 'Games', showSearch: true, actions: undefined });
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
						class="font-display-md text-headline-lg text-primary-light drop-shadow-md md:font-display-lg md:text-display-lg"
					>
						{game.title}
					</h2>
					<p
						class="max-w-xl font-body-md text-body-md text-on-surface-variant md:font-body-lg md:text-body-lg"
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
							class="font-label-sm text-[10px] tracking-wider text-on-surface-variant uppercase md:text-label-sm"
						>
							Players
						</div>
					</div>
					<button
						onclick={() => (isRulesOpen = true)}
						class="flex items-center gap-2 rounded-DEFAULT border border-outline bg-surface/30 px-4 py-2 font-label-sm text-[10px] tracking-wider text-primary uppercase backdrop-blur-md transition-colors duration-300 hover:border-primary"
					>
						<span class="material-symbols-outlined text-[18px]">info</span>
						Rules
					</button>
				</div>
			</div>
		</section>
	{/if}

	<div
		class="relative flex w-full flex-col overflow-hidden rounded-xl border border-outline bg-surface-container/30 shadow-2xl backdrop-blur-sm"
	>
		{@render children()}
	</div>
</main>

<RulesModal bind:isOpen={isRulesOpen} title={game.title} rules={game.rules} />

<GameHistory {gameManager} bind:isOpen={isHistoryOpen} />

<Footer />
