<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import GameCard from '$lib/components/GameCard.svelte';
	import { libraryGames } from '$lib/data/games';
</script>

<Header />

<!-- Main Content Canvas -->
<main
	class="grow flex flex-col w-full px-margin-mobile md:px-margin-desktop py-12 max-w-max-width mx-auto gap-16"
>
	<!-- Hero Section: Featured Game -->
	<section class="relative w-full rounded-xl overflow-hidden border border-outline bg-surface-felt group">
		<div
			class="relative z-10 flex flex-col md:flex-row items-end md:items-center justify-between p-8 md:p-16 min-h-125"
		>
			<div class="max-w-2xl flex flex-col gap-6">
				<span
					class="font-label-lg text-label-lg text-primary uppercase tracking-widest bg-surface/50 backdrop-blur-sm px-3 py-1 rounded-DEFAULT self-start border border-primary/20"
					>Featured Experience</span
				>
				<h2 class="font-display-lg text-display-lg text-primary-light drop-shadow-md">
					Rumba Jass
				</h2>
				<p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
					A captivating synthesis of traditional strategy and modern flair. Engage in a battle of
					wits where every card played alters the rhythmic flow of the game. Designed for the
					discerning player seeking depth and elegance.
				</p>
				<div class="flex gap-4 mt-4">
					<a
						href="/games/rumba"
						class="bg-primary hover:bg-primary-light text-surface font-label-lg text-label-lg px-8 py-4 rounded-DEFAULT transition-all duration-300 shadow-[0_0_15px_rgba(230,195,100,0.2)] hover:shadow-[0_0_25px_rgba(230,195,100,0.4)] flex items-center gap-2"
					>
						<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 1;'
							>play_arrow</span
						>
						Start Playing
					</a>
					<button
						class="border border-outline hover:border-primary text-primary font-label-lg text-label-lg px-8 py-4 rounded-DEFAULT transition-colors duration-300 flex items-center gap-2 bg-surface/30 backdrop-blur-md"
					>
						<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 0;'
							>info</span
						>
						Rules
					</button>
				</div>
			</div>
			<div class="hidden md:flex flex-col items-end gap-2 text-right">
				<div class="font-display-md text-headline-lg text-primary-container">4-6</div>
				<div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
					Players
				</div>
				<div class="w-12 h-px bg-outline my-2"></div>
				<div class="font-display-md text-headline-lg text-primary-container">45m</div>
				<div class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
					Avg. Duration
				</div>
			</div>
		</div>
	</section>

	<!-- Secondary Games Grid -->
	<section class="flex flex-col gap-8">
		<div class="flex justify-between items-end border-b border-outline pb-4">
			<h3 class="font-headline-lg text-headline-lg text-primary">The Library</h3>
			<button
				class="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm flex items-center gap-1"
			>
				View All <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
			</button>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
			{#each libraryGames as game (game.title)}
				<GameCard {...game} />
			{/each}
		</div>
	</section>
</main>

<Footer />
