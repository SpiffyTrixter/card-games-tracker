<script lang="ts">
	import { base } from '$app/paths';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { getRulesContext } from '$state/rulesContext';
	import type { Game } from '$types/game';

	let {
		id,
		title,
		description,
		category,
		players,
		icon = 'style',
		props,
		rules,
		logic,
		uiComponent
	}: Game = $props();

	const { openRules } = getRulesContext();
</script>

<Card.Root
	class="group relative flex h-full flex-col overflow-hidden border-border transition-colors duration-300 hover:bg-muted/50"
>
	<div
		class="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-primary/5 blur-3xl transition-colors group-hover:bg-primary/10"
	></div>

	<Card.Header class="z-10 flex flex-row items-start justify-between pb-2">
		<div
			class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-primary/70 transition-colors group-hover:text-primary md:h-12 md:w-12"
		>
			<span
				class="material-symbols-outlined text-[20px] md:text-[24px]"
				style="font-variation-settings: 'FILL' 0;">{icon}</span
			>
		</div>
		<div class="flex flex-col items-end gap-1.5 md:gap-2">
			<Badge
				variant="outline"
				class="font-label-sm md:text-label-sm bg-background text-[10px] text-muted-foreground"
				>{category}</Badge
			>
			{#if props?.deck}
				<Badge
					variant="secondary"
					class="font-label-sm border border-primary/20 bg-primary/10 text-[9px] text-primary hover:bg-primary/20 md:text-[10px]"
					>{props.deck.name}</Badge
				>
			{/if}
		</div>
	</Card.Header>

	<Card.Content class="z-10 flex grow flex-col gap-2">
		<Card.Title
			class="font-headline-sm md:font-headline-lg text-[20px] leading-tight text-foreground md:text-[24px] md:leading-[32px]"
		>
			{title}
		</Card.Title>
		<Card.Description
			class="font-body-sm md:font-body-md line-clamp-2 text-sm text-muted-foreground md:text-body-md"
		>
			{description}
		</Card.Description>

		{#if props}
			<div class="mt-2 flex flex-wrap gap-2">
				{#if props.dice}
					<Badge
						variant="outline"
						class="gap-1 bg-background/50 text-[11px] font-normal text-muted-foreground"
					>
						<span class="material-symbols-outlined text-[14px]">casino</span>
						{props.dice.count}x {props.dice.name}
					</Badge>
				{/if}
				{#if props.board}
					<Badge
						variant="outline"
						class="gap-1 bg-background/50 text-[11px] font-normal text-muted-foreground"
					>
						<span class="material-symbols-outlined text-[14px]">grid_view</span>
						{props.board.name}
					</Badge>
				{/if}
			</div>
		{/if}
	</Card.Content>

	<Card.Footer
		class="z-10 mt-auto flex items-center justify-between border-t border-border/50 pt-4"
	>
		<div class="font-label-sm text-label-sm flex items-center gap-1 text-muted-foreground">
			<span class="material-symbols-outlined text-[16px]">group</span>
			{players.min}{#if players.max > players.min}-{players.max}{/if}
		</div>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onclick={(e: MouseEvent) => {
					e.preventDefault();
					e.stopPropagation();
					openRules({
						id,
						title,
						description,
						category,
						players,
						icon,
						props,
						rules,
						logic,
						uiComponent
					});
				}}
				class="gap-1 border-border bg-background/30 text-primary hover:border-primary"
			>
				<span class="material-symbols-outlined text-[14px]">info</span>
				Rules
			</Button>
			<Button size="sm" href="{base}/games/{id}" class="gap-1">
				<span
					class="material-symbols-outlined text-[14px]"
					style="font-variation-settings: 'FILL' 1;">play_arrow</span
				>
				Tracker
			</Button>
		</div>
	</Card.Footer>
</Card.Root>
