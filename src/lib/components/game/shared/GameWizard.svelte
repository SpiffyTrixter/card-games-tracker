<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import { Button } from '$components/ui/button/index.js';
	import * as Card from '$components/ui/card/index.js';
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import type { WizardStep } from '$lib/types/game';

	let {
		steps,
		gameManager,
		onSubmit
	}: {
		steps: WizardStep[];
		gameManager: GameManager;
		onSubmit: () => void;
	} = $props();

	let currentStepIndex = $state(0);
	let error = $state('');

	const currentStep = $derived(steps[currentStepIndex]);
	const players = $derived(gameManager.session.players);
	const filteredPlayers = $derived(
		currentStep.filterPlayers
			? players.map((p, i) => ({ p, i })).filter(({ p, i }) => currentStep.filterPlayers!(p, i))
			: players.map((p, i) => ({ p, i }))
	);

	function handleNext() {
		if (currentStep.validate) {
			const validationError = currentStep.validate();
			if (validationError) {
				error = validationError;
				return;
			}
		}

		error = '';
		if (currentStepIndex < steps.length - 1) {
			currentStepIndex++;
		} else {
			onSubmit();
			currentStepIndex = 0; // Reset for next round
		}
	}

	function handleBack() {
		if (currentStepIndex > 0) {
			currentStepIndex--;
			error = '';
		}
	}
</script>

<div class="space-y-6 p-4 md:space-y-8 md:p-8">
	<!-- Navigation -->
	<div
		class="flex items-center justify-between rounded-xl border bg-muted p-1 text-[9px] tracking-wider uppercase md:mb-8 md:p-2 md:text-[10px]"
	>
		{#each steps as step, i (step.id)}
			{#if i > 0}
				<span
					class="material-symbols-outlined mx-0.5 text-[12px] text-muted-foreground md:mx-1 md:text-[14px]"
					>chevron_right</span
				>
			{/if}
			<Button
				variant={currentStepIndex === i ? 'default' : 'ghost'}
				size="sm"
				onclick={() => {
					// Only allow jumping back, or jumping forward if valid
					if (i < currentStepIndex) {
						currentStepIndex = i;
						error = '';
					}
				}}
				class="flex-1 rounded-lg"
			>
				{i + 1}. <span class="xs:inline hidden">{step.shortTitle}</span>
				<span class="xs:hidden">{step.shortTitle.slice(0, 3)}...</span>
			</Button>
		{/each}
	</div>

	<!-- Step Content -->
	<div class="space-y-4" in:fade={{ duration: 200 }}>
		<div class="flex min-h-14 items-end justify-between md:min-h-[64px]">
			<h3 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
				<span class="material-symbols-outlined text-primary">{currentStep.icon}</span>
				{currentStep.title}
			</h3>
			{#if currentStep.extraUI}
				{@render currentStep.extraUI()}
			{/if}
		</div>

		<div class="space-y-2 md:space-y-3">
			{#each filteredPlayers as { p: player, i: originalIndex } (player.id)}
				<Card.Root size="xs">
					<Card.Content class="flex flex-col justify-between gap-3 p-3 sm:flex-row sm:items-center">
						{@render currentStep.playerAction(player, originalIndex)}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		{#if error}
			<div
				class="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
				transition:slide
			>
				<span class="material-symbols-outlined">error</span>
				{error}
			</div>
		{/if}

		<div class="flex gap-4 pt-4">
			{#if currentStepIndex > 0}
				<Button variant="outline" onclick={handleBack} class="flex-1 py-6">Back</Button>
			{/if}
			<Button
				onclick={handleNext}
				class="{currentStepIndex === 0 ? 'w-full' : 'flex-2'} py-6 text-lg font-bold shadow-lg"
			>
				{currentStep.buttonText}
			</Button>
		</div>
	</div>
</div>
