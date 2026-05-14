<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$components/ui/button/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$components/ui/dropdown-menu/index.js';
	import { Input } from '$components/ui/input/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import { getLocaleForUrl, locales, setLocale } from '$lib/paraglide/runtime.js';
	import { gameStatus } from '$lib/state/gameStatus.svelte';
	import { confirmDialog } from '$lib/utils/dialogs';

	let searchInput = $state<HTMLInputElement | null>(null);

	$effect(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			// Cmd/Ctrl + K
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				searchInput?.focus();
			}
			// Forward slash (only if not already in an input)
			if (
				e.key === '/' &&
				document.activeElement?.tagName !== 'INPUT' &&
				document.activeElement?.tagName !== 'TEXTAREA'
			) {
				e.preventDefault();
				searchInput?.focus();
			}
		};

		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	async function handleStopGame() {
		const confirmed = await confirmDialog({
			text: m.stop_game_confirm_text(),
			confirmButtonText: m.stop_game(),
			cancelButtonText: m.continue_playing()
		});
		if (confirmed) {
			if (gameStatus.stopGame) {
				gameStatus.stopGame();
			}
			gameStatus.isGameInProgress = false;
			gameStatus.currentGameId = null;
			gameStatus.headerState = { title: m.games(), showSearch: true };
			goto('/');
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
				text: m.leave_confirm_text(),
				confirmButtonText: m.leave(),
				cancelButtonText: m.stay()
			});
			if (confirmed) {
				gameStatus.isGameInProgress = false;
				if (to) await goto(to.url.pathname);
			}
		}
	});

	const currentLang = $derived(getLocaleForUrl(page.url));
</script>

<header
	class="sticky top-0 z-50 border-b border-outline bg-surface dark:border-outline dark:bg-surface"
>
	<div
		class="mx-auto flex w-full max-w-max-width items-center justify-between gap-4 px-margin-mobile py-4 md:px-margin-desktop md:py-8"
	>
		<div class="flex min-w-0 items-center gap-2 md:gap-6">
			<a href="/" class="shrink-0 transition-opacity hover:opacity-80">
				<h1
					class="text-headline-sm font-display-md overflow-hidden tracking-tight text-ellipsis whitespace-nowrap text-primary md:text-display-md dark:text-primary"
				>
					{gameStatus.headerState.title || m.games()}
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
						bind:ref={searchInput}
						class="font-body-sm md:font-body-md block w-32 rounded-full border-border bg-secondary py-1.5 pr-4 pl-10 text-sm transition-all duration-300 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary sm:w-48 md:w-64 md:py-2 md:pl-12 md:text-body-md"
						placeholder={m.search_placeholder()}
						type="text"
						bind:value={gameStatus.searchQuery}
					/>
					<div
						class="pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-3 md:flex"
					>
						<kbd
							class="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none"
						>
							<span class="text-xs">⌘</span>K
						</kbd>
					</div>
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
					<span class="hidden sm:inline">{m.stop()}</span>
				</Button>
			{/if}

			<DropdownMenu>
				<DropdownMenuTrigger
					class="inline-flex h-8 items-center gap-2 rounded-4xl px-2 hover:bg-muted hover:text-foreground md:px-4"
					aria-haspopup="menu"
				>
					<span class="material-symbols-outlined text-[20px]">language</span>
					<span class="hidden text-sm uppercase md:inline">{currentLang.toUpperCase()}</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					{#each locales as lang (lang)}
						<DropdownMenuItem
							onSelect={() => {
								setLocale(lang);
							}}
						>
							<span class="uppercase">{lang}</span>
						</DropdownMenuItem>
					{/each}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</div>
</header>
