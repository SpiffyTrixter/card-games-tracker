<script lang="ts">
	import type { Game } from '$lib/types/game';

	let { title, description, category, players, icon = 'style', props }: Game = $props();
</script>

<div
	class="bg-surface-felt border border-outline rounded-lg p-6 flex flex-col gap-4 hover:bg-surface-bright transition-colors duration-300 group cursor-pointer relative overflow-hidden"
>
	<div
		class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"
	></div>
	<div class="flex justify-between items-start z-10">
		<div
			class="w-12 h-12 rounded-full bg-surface border border-outline flex items-center justify-center text-primary-dark group-hover:text-primary transition-colors"
		>
			<span class="material-symbols-outlined" style='font-variation-settings: "FILL" 0;'>{icon}</span>
		</div>
		<div class="flex flex-col items-end gap-2">
			<span
				class="font-label-sm text-label-sm text-on-surface-variant bg-surface px-2 py-1 rounded-DEFAULT border border-outline"
				>{category}</span
			>
			{#if props?.deck}
				<span
					class="font-label-sm text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/20"
					>{props.deck.name}</span
				>
			{/if}
		</div>
	</div>
	<div class="z-10 mt-2">
		<h4 class="font-headline-lg text-[24px] leading-[32px] font-semibold text-on-surface mb-2">
			{title}
		</h4>
		<p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">
			{description}
		</p>
	</div>
	{#if props}
		<div class="z-10 flex flex-wrap gap-2 mt-2">
			{#if props.dice}
				<div class="flex items-center gap-1 text-[11px] text-on-surface-variant bg-surface/50 px-2 py-1 rounded border border-outline/30">
					<span class="material-symbols-outlined text-[14px]">casino</span>
					{props.dice.count}x {props.dice.name}
				</div>
			{/if}
			{#if props.board}
				<div class="flex items-center gap-1 text-[11px] text-on-surface-variant bg-surface/50 px-2 py-1 rounded border border-outline/30">
					<span class="material-symbols-outlined text-[14px]">grid_view</span>
					{props.board.name}
				</div>
			{/if}
		</div>
	{/if}
	<div class="mt-auto pt-4 border-t border-outline/50 flex justify-between items-center z-10">
		<div class="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
			<span class="material-symbols-outlined text-[16px]">group</span>
			{players.min}{#if players.max > players.min}-{players.max}{/if}
		</div>
		<a href="/games/{title.toLowerCase().replace(/ /g, '-')}" class="text-primary hover:text-primary-light font-label-lg text-label-lg transition-colors"
			>Play</a
		>
	</div>
</div>
