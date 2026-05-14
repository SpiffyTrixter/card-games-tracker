<script lang="ts">
	import './layout.css';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import MetaTags from '$components/shared/MetaTags.svelte';
	import RulesModal from '$components/shared/RulesModal.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
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

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
