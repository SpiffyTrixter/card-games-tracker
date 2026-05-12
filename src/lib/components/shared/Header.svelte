<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$components/ui/button/index.js';
	import { Input } from '$components/ui/input/index.js';
	import { gameStatus } from '$lib/state/gameStatus.svelte';
	import { confirmDialog } from '$lib/utils/dialogs';

	async function handleStopGame() {
		const confirmed = await confirmDialog({
			text: 'A game is currently in progress. Do you really want to stop and return to the main menu?',
			confirmButtonText: 'Stop Game',
			cancelButtonText: 'Continue Playing'
		});
		if (confirmed) {
			if (gameStatus.stopGame) {
				gameStatus.stopGame();
			}
			gameStatus.isGameInProgress = false;
			gameStatus.currentGameId = null;
			gameStatus.headerState = { title: 'Games', showSearch: true };
			goto(resolve('/'));
		}
	}

	beforeNavigate(async ({ cancel, to, from }) => {
		if (
			gameStatus.isGameInProgress &&
			to?.route.id !== '/games/[id]' &&
			from?.url.pathname !== to?.url.pathname
		) {
			cancel();
			const confirmed = await confirmDialog({
				text: 'A game is currently in progress. Do you really want to leave?',
				confirmButtonText: 'Leave',
				cancelButtonText: 'Stay'
			});
			if (confirmed) {
				gameStatus.isGameInProgress = false;
				if (to) await goto(to.url.pathname);
			}
		}
	});
</script>

<header
	class="sticky top-0 z-50 border-b border-outline bg-surface dark:border-outline dark:bg-surface"
>
	<div
		class="mx-auto flex w-full max-w-max-width items-center justify-between gap-4 px-margin-mobile py-4 md:px-margin-desktop md:py-8"
	>
		<div class="flex min-w-0 items-center gap-2 md:gap-6">
			<a href={resolve('/')} class="shrink-0 transition-opacity hover:opacity-80">
				<h1
					class="text-headline-sm font-display-md overflow-hidden tracking-tight text-ellipsis whitespace-nowrap text-primary md:text-display-md dark:text-primary"
				>
					{gameStatus.headerState.title || 'Games'}
				</h1>
			</a>

			{#if gameStatus.headerState.actions}
				<div class="flex items-center gap-1 border-l border-outline/30 pl-2 md:gap-3 md:pl-6">
					{#each gameStatus.headerState.actions as action (action.label)}
						<Button
							variant="ghost"
							size="sm"
							onclick={action.onclick}
							class="gap-2 text-muted-foreground hover:bg-accent hover:text-primary"
							title={action.label}
						>
							<span class="material-symbols-outlined text-[20px]">{action.icon}</span>
							<span class="font-label-sm text-label-sm hidden tracking-wider uppercase sm:inline"
								>{action.label}</span
							>
						</Button>
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex shrink-0 items-center justify-end gap-2 md:gap-4">
			{#if gameStatus.headerState.showSearch}
				<div class="relative flex items-center">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
						<span class="material-symbols-outlined text-[18px] text-primary/70 md:text-[20px]"
							>search</span
						>
					</div>
					<Input
						class="font-body-sm md:font-body-md block w-32 rounded-full border-border bg-secondary py-1.5 pr-4 pl-10 text-sm transition-all duration-300 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary sm:w-48 md:w-64 md:py-2 md:pl-12 md:text-body-md"
						placeholder="Search..."
						type="text"
					/>
				</div>
			{/if}

			{#if gameStatus.isGameInProgress}
				<Button
					variant="destructive"
					size="sm"
					onclick={handleStopGame}
					class="font-label-sm md:text-label-sm gap-1 border border-destructive/20 bg-destructive/10 text-[10px] tracking-widest text-destructive uppercase hover:bg-destructive/20 md:gap-2"
				>
					<span class="material-symbols-outlined text-[16px] md:text-[18px]">stop_circle</span>
					<span class="xs:inline hidden">Stop</span><span class="hidden sm:inline"> Game</span>
				</Button>
			{/if}
		</div>
	</div>
</header>
