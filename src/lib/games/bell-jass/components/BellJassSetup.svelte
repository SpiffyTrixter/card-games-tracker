<script lang="ts">
	import { Input } from '$components/ui/input/index.js';
	import { Label } from '$components/ui/label/index.js';
	import { Switch } from '$components/ui/switch/index.js';
	import GameSetup from '$lib/components/game/shared/GameSetup.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import type { Players } from '$lib/types/game';

	let {
		gameManager,
		playersLimit,
		onStart
	}: {
		gameManager: GameManager;
		playersLimit: Players;
		onStart: () => void;
	} = $props();

	let useRounds = $state(true);
	let maxRounds = $state<number>(12);

	function handleStart() {
		gameManager.session.settings = { maxRounds: useRounds ? maxRounds : undefined };
		onStart();
	}
</script>

<GameSetup {gameManager} {playersLimit} onStart={handleStart}>
	{#snippet extraSettings()}
		<div class="space-y-4 border-t border-border/30 pt-4 md:pt-6">
			<div class="flex items-center justify-between">
				<div class="space-y-1">
					<Label
						for="use-rounds"
						class="font-headline-sm md:font-headline-md flex cursor-pointer items-center gap-2 text-primary"
					>
						<span class="material-symbols-outlined">settings</span>
						{m.bell_jass_settings_rounds()}
					</Label>
					<p class="max-w-[250px] text-[10px] text-muted-foreground md:max-w-md md:text-xs">
						{m.bell_jass_rounds_help()}
					</p>
				</div>
				<Switch id="use-rounds" bind:checked={useRounds} />
			</div>

			<div
				class="flex items-center gap-4 pt-2 transition-opacity duration-300"
				class:opacity-40={!useRounds}
			>
				<Label for="max-rounds" class="text-muted-foreground">{m.bell_jass_max_rounds()}</Label>
				<Input
					id="max-rounds"
					type="number"
					min="1"
					max="100"
					bind:value={maxRounds}
					class="w-24"
					disabled={!useRounds}
				/>
			</div>
		</div>
	{/snippet}
</GameSetup>
