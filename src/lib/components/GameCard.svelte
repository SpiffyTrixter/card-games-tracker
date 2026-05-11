<script lang="ts">
	import type { Game } from '$lib/types/game';
	import { base } from '$app/paths';

	let { title, description, category, players, icon = 'style', props, rules }: Game = $props();

	function handleCardClick() {
		if (rules) {
			window.dispatchEvent(new CustomEvent('open-rules', { detail: { title, rules } }));
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={handleCardClick}
	class="group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-lg border border-outline bg-surface-felt p-5 transition-colors duration-300 hover:bg-surface-bright md:gap-4 md:p-6"
>
	<div
		class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-colors group-hover:bg-primary/10"
	></div>
	<div class="z-10 flex items-start justify-between">
		<div
			class="flex h-10 w-10 items-center justify-center rounded-full border border-outline bg-surface text-primary-dark transition-colors group-hover:text-primary md:h-12 md:w-12"
		>
			<span
				class="material-symbols-outlined text-[20px] md:text-[24px]"
				style="font-variation-settings: 'FILL' 0;">{icon}</span
			>
		</div>
		<div class="flex flex-col items-end gap-1.5 md:gap-2">
			<span
				class="rounded-DEFAULT border border-outline bg-surface px-2 py-1 font-label-sm text-[10px] text-on-surface-variant md:text-label-sm"
				>{category}</span
			>
			{#if props?.deck}
				<span
					class="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 font-label-sm text-[9px] text-primary md:text-[10px]"
					>{props.deck.name}</span
				>
			{/if}
		</div>
	</div>
	<div class="z-10 mt-1 md:mt-2">
		<h4
			class="font-headline-sm mb-1 text-[20px] leading-tight font-semibold text-on-surface md:mb-2 md:font-headline-lg md:text-[24px] md:leading-[32px]"
		>
			{title}
		</h4>
		<p
			class="font-body-sm line-clamp-2 text-sm text-on-surface-variant md:font-body-md md:text-body-md"
		>
			{description}
		</p>
	</div>
	{#if props}
		<div class="z-10 mt-2 flex flex-wrap gap-2">
			{#if props.dice}
				<div
					class="flex items-center gap-1 rounded border border-outline/30 bg-surface/50 px-2 py-1 text-[11px] text-on-surface-variant"
				>
					<span class="material-symbols-outlined text-[14px]">casino</span>
					{props.dice.count}x {props.dice.name}
				</div>
			{/if}
			{#if props.board}
				<div
					class="flex items-center gap-1 rounded border border-outline/30 bg-surface/50 px-2 py-1 text-[11px] text-on-surface-variant"
				>
					<span class="material-symbols-outlined text-[14px]">grid_view</span>
					{props.board.name}
				</div>
			{/if}
		</div>
	{/if}
	<div class="z-10 mt-auto flex items-center justify-between border-t border-outline/50 pt-4">
		<div class="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
			<span class="material-symbols-outlined text-[16px]">group</span>
			{players.min}{#if players.max > players.min}-{players.max}{/if}
		</div>
		<a
			href="{base}/games/{title.toLowerCase().replace(/ /g, '-')}"
			class="font-label-lg text-label-lg text-primary transition-colors hover:text-primary-light"
			>Play</a
		>
	</div>
</div>
