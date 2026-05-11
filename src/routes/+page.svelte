<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GameCard from '$lib/components/GameCard.svelte';
	import RulesModal from '$lib/components/RulesModal.svelte';
	import { libraryGames } from '$lib/data/games';
	import { rumba } from '$lib/data/games/rumba';

	import { onMount } from 'svelte';
	import type { Game } from '$lib/types/game';
	import { base } from '$app/paths';

	let isRulesOpen = $state(false);
	let selectedGameForRules = $state(rumba);

	function openRules(game = rumba) {
		selectedGameForRules = game;
		isRulesOpen = true;
	}

	onMount(() => {
		const handleOpenRules = (e: CustomEvent<Game>) => {
			selectedGameForRules = e.detail;
			isRulesOpen = true;
		};
		window.addEventListener('open-rules', handleOpenRules as EventListener);
		return () => window.removeEventListener('open-rules', handleOpenRules as EventListener);
	});
</script>

<Header />

<!-- Main Content Canvas -->
<main
	class="mx-auto flex w-full max-w-max-width grow flex-col gap-8 px-margin-mobile py-8 md:gap-16 md:px-margin-desktop md:py-12"
>
	<!-- Hero Section: Featured Game -->
	<section
		class="group relative w-full overflow-hidden rounded-xl border border-outline bg-surface-felt"
	>
		<div
			class="relative z-10 flex min-h-75 flex-col items-stretch justify-between gap-8 p-6 md:min-h-125 md:flex-row md:items-center md:p-16"
		>
			<div class="flex max-w-2xl flex-col gap-4 md:gap-6">
				<span
					class="self-start rounded-DEFAULT border border-primary/20 bg-surface/50 px-3 py-1 font-label-sm text-[10px] tracking-widest text-primary uppercase backdrop-blur-sm md:font-label-lg md:text-label-lg"
					>Featured Experience</span
				>
				<h2
					class="font-display-md text-headline-lg text-primary-light drop-shadow-md md:font-display-lg md:text-display-lg"
				>
					Rumba Jass
				</h2>
				<p
					class="max-w-xl font-body-md text-body-md text-on-surface-variant md:font-body-lg md:text-body-lg"
				>
					A captivating synthesis of traditional strategy and modern flair. Engage in a battle of
					wits where every card played alters the rhythmic flow of the game.
				</p>
				<div class="mt-2 flex flex-wrap gap-3 md:mt-4 md:gap-4">
					<a
						href="{base}/games/rumba"
						class="font-label-md flex flex-1 items-center justify-center gap-2 rounded-DEFAULT bg-primary px-6 py-3 text-sm text-surface shadow-[0_0_15px_rgba(230,195,100,0.2)] transition-all duration-300 hover:bg-primary-light hover:shadow-[0_0_25px_rgba(230,195,100,0.4)] sm:flex-none md:px-8 md:py-4 md:font-label-lg md:text-label-lg"
					>
						<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;"
							>play_arrow</span
						>
						Start Playing
					</a>
					<button
						onclick={() => openRules(rumba)}
						class="font-label-md flex flex-1 items-center justify-center gap-2 rounded-DEFAULT border border-outline bg-surface/30 px-6 py-3 text-sm text-primary backdrop-blur-md transition-colors duration-300 hover:border-primary sm:flex-none md:px-8 md:py-4 md:font-label-lg md:text-label-lg"
					>
						<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;"
							>info</span
						>
						Rules
					</button>
				</div>
			</div>

			<div
				class="flex items-center justify-around gap-4 rounded-xl border border-outline/10 bg-surface/20 p-4 text-center backdrop-blur-sm md:flex-col md:items-end md:justify-center md:gap-2 md:rounded-none md:border-none md:bg-transparent md:p-0 md:text-right"
			>
				<div class="flex flex-col items-center md:items-end">
					<div
						class="font-display-sm text-headline-md text-primary-container md:font-display-md md:text-headline-lg"
					>
						4-6
					</div>
					<div
						class="font-label-sm text-[10px] tracking-wider text-on-surface-variant uppercase md:text-label-sm"
					>
						Players
					</div>
				</div>
				<div class="my-2 hidden h-px w-12 bg-outline md:block"></div>
				<div class="flex flex-col items-center md:items-end">
					<div
						class="font-display-sm text-headline-md text-primary-container md:font-display-md md:text-headline-lg"
					>
						45m
					</div>
					<div
						class="font-label-sm text-[10px] tracking-wider text-on-surface-variant uppercase md:text-label-sm"
					>
						Avg. Duration
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Secondary Games Grid -->
	<section class="flex flex-col gap-8">
		<div class="flex items-end justify-between border-b border-outline pb-4">
			<h3 class="font-headline-lg text-headline-lg text-primary">The Library</h3>
			<button
				class="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-primary"
			>
				View All <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
			</button>
		</div>
		<div class="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
			{#each libraryGames as game (game.title)}
				<GameCard {...game} />
			{/each}
		</div>
	</section>
</main>

<RulesModal
	bind:isOpen={isRulesOpen}
	title={selectedGameForRules.title}
	rules={selectedGameForRules.rules}
/>

<Footer />
