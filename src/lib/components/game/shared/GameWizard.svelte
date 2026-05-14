<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';

	import { Button } from '$components/ui/button/index.js';
	import * as Card from '$components/ui/card/index.js';
	import { m } from '$lib/paraglide/messages.js';
	import type { GameManager } from '$lib/state/gameManager.svelte';
	import type { WizardStep } from '$lib/types/game';
	import { unwrap } from '$lib/utils/i18n';

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
	let maxReachedStep = $state(0);
	let error = $state('');
	let direction = $state(1); // 1 for forward, -1 for backward

	$effect(() => {
		if (currentStepIndex > maxReachedStep) {
			maxReachedStep = currentStepIndex;
		}
	});

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
			direction = 1;
			currentStepIndex++;
		} else {
			onSubmit();
			currentStepIndex = 0; // Reset for next round
			maxReachedStep = 0;
			direction = 1;
		}
	}

	function handleBack() {
		if (currentStepIndex > 0) {
			direction = -1;
			currentStepIndex--;
			error = '';
		}
	}
</script>

<div class="flex flex-col gap-2 p-2 md:gap-4 md:p-6">
	<!-- Navigation -->
	<div
		class="flex items-center justify-between rounded-xl border bg-muted p-1 text-[9px] tracking-wider uppercase md:p-2 md:text-[10px]"
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
					if (i < currentStepIndex || i <= maxReachedStep) {
						direction = i > currentStepIndex ? 1 : -1;
						currentStepIndex = i;
						error = '';
					} else if (i === currentStepIndex + 1) {
						handleNext();
					}
				}}
				class="flex-1 rounded-lg transition-all duration-300"
			>
				{i + 1}. <span class="xs:inline hidden">{unwrap(step.shortTitle)}</span>
				<span class="xs:hidden">{unwrap(step.shortTitle).slice(0, 3)}...</span>
			</Button>
		{/each}
	</div>

	<!-- Step Content Container -->
	<div class="grid overflow-hidden">
		{#key currentStepIndex}
			<div
				in:fly={{ x: 20 * direction, duration: 400, delay: 200 }}
				out:fly={{ x: -20 * direction, duration: 200 }}
				class="col-start-1 row-start-1 space-y-6"
			>
				<div class="flex min-h-14 items-end justify-between md:min-h-[64px]">
					<h3 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
						<span class="material-symbols-outlined text-primary">{currentStep.icon}</span>
						{unwrap(currentStep.title)}
					</h3>
					{#if currentStep.extraUI}
						<div in:fade={{ delay: 400 }}>
							{@render currentStep.extraUI()}
						</div>
					{/if}
				</div>

				<div class="grid gap-2 md:gap-3">
					{#each filteredPlayers as { p: player, i: originalIndex }, idx (player.id)}
						<div in:fly={{ y: 10, duration: 300, delay: 300 + idx * 50 }}>
							<Card.Root size="xs" class="transition-all hover:border-primary/30">
								<Card.Content
									class="flex flex-col justify-between gap-3 p-3 sm:flex-row sm:items-center"
								>
									{@render currentStep.playerAction(player, originalIndex)}
								</Card.Content>
							</Card.Root>
						</div>
					{/each}
				</div>
			</div>
		{/key}
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

	<div class="flex pt-4">
		{#if currentStepIndex > 0}
			<div transition:slide={{ axis: 'x', duration: 400 }} class="overflow-hidden pr-4">
				<Button
					variant="outline"
					onclick={handleBack}
					class="w-24 py-6 transition-transform active:scale-95 sm:w-32 md:w-48"
				>
					{m.back()}
				</Button>
			</div>
		{/if}
		<Button
			onclick={handleNext}
			class="flex-1 py-6 text-lg font-bold shadow-lg transition-all active:scale-95"
		>
			{unwrap(currentStep.buttonText)}
		</Button>
	</div>
</div>
