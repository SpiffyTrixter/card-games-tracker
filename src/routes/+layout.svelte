<script lang="ts">
	import './layout.css';

	import MetaTags from '$components/shared/MetaTags.svelte';
	import RulesModal from '$components/shared/RulesModal.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { setRulesContext } from '$state/rulesContext';
	import type { Game } from '$types/game';

	let { children } = $props();

	let isRulesOpen = $state(false);
	let selectedGameForRules = $state<Game | null>(null);

	setRulesContext({
		openRules: (game: Game) => {
			selectedGameForRules = game;
			isRulesOpen = true;
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<MetaTags />

{@render children()}

{#if selectedGameForRules}
	<RulesModal
		bind:isOpen={isRulesOpen}
		title={selectedGameForRules.title}
		rules={selectedGameForRules.rules}
	/>
{/if}
