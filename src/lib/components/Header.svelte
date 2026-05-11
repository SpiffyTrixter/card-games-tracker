<script lang="ts">
	import { isGameInProgress, headerState } from '$lib/stores/gameStatus';
	import { beforeNavigate, goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { confirmDialog } from '$lib/utils/dialogs';

	async function handleGamesLinkClick(e: MouseEvent) {
		if ($isGameInProgress) {
			e.preventDefault();
			const confirmed = await confirmDialog({
				text: 'A game is currently in progress. Do you really want to leave?',
				confirmButtonText: 'Leave',
				cancelButtonText: 'Stay'
			});
			if (confirmed) {
				goto(`${base}/`);
			}
		}
	}

	async function handleStopGame() {
		const confirmed = await confirmDialog({
			text: 'A game is currently in progress. Do you really want to stop and return to the main menu?',
			confirmButtonText: 'Stop Game',
			cancelButtonText: 'Continue Playing'
		});

		if (confirmed) {
			isGameInProgress.set(false);
			headerState.set({ showSearch: true });
			goto(`${base}/`);
		}
	}

	beforeNavigate(async ({ cancel, to }) => {
		if ($isGameInProgress && to?.route.id && (to.route.id as string) !== '/games/[game]') {
			cancel();
			const confirmed = await confirmDialog({
				text: 'A game is currently in progress. Do you really want to leave?',
				confirmButtonText: 'Leave',
				cancelButtonText: 'Stay'
			});
			if (confirmed) {
				isGameInProgress.set(false);
				if (to) goto(to.url.pathname);
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
			<a
				href="{base}/"
				onclick={handleGamesLinkClick}
				class="flex-shrink-0 transition-opacity hover:opacity-80"
			>
				<h1
					class="text-headline-sm overflow-hidden font-display-md tracking-tight text-ellipsis whitespace-nowrap text-primary md:text-display-md dark:text-primary"
				>
					{$headerState.title || 'Games'}
				</h1>
			</a>

			{#if $headerState.actions}
				<div class="flex items-center gap-1 border-l border-outline/30 pl-2 md:gap-3 md:pl-6">
					{#each $headerState.actions as action (action.label)}
						<button
							onclick={action.onclick}
							class="flex items-center gap-2 rounded-DEFAULT px-2 py-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary md:px-3"
							title={action.label}
						>
							<span class="material-symbols-outlined text-[20px]">{action.icon}</span>
							<span class="hidden font-label-sm text-label-sm tracking-wider uppercase sm:inline"
								>{action.label}</span
							>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex flex-shrink-0 items-center justify-end gap-2 md:gap-4">
			{#if $headerState.showSearch}
				<div class="relative flex items-center">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
						<span class="material-symbols-outlined text-[18px] text-primary/70 md:text-[20px]"
							>search</span
						>
					</div>
					<input
						class="font-body-sm block w-32 rounded-full border border-outline bg-surface-container py-1.5 pr-4 pl-10 text-sm text-on-surface placeholder-on-surface-variant transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary sm:w-48 md:w-64 md:py-2 md:pl-12 md:font-body-md md:text-body-md"
						placeholder="Search..."
						type="text"
					/>
				</div>
			{/if}

			{#if $isGameInProgress}
				<button
					onclick={handleStopGame}
					class="flex items-center gap-1 rounded-DEFAULT border border-error/20 bg-error/10 px-2 py-1.5 font-label-sm text-[10px] tracking-widest text-error uppercase transition-all hover:bg-error/20 md:gap-2 md:px-4 md:py-2 md:text-label-sm"
				>
					<span class="material-symbols-outlined text-[16px] md:text-[18px]">stop_circle</span>
					<span class="xs:inline hidden">Stop</span><span class="hidden sm:inline"> Game</span>
				</button>
			{/if}
		</div>
	</div>
</header>
