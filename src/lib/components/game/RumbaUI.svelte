<script lang="ts">
	import { getGameManager } from '$state/gameManager.svelte';

	const gameManager = getGameManager();

	let roundScore = $state(0);

	function submitRound() {
		if (gameManager.session.players.length > 0) {
			// Just giving points to the first player for the demo
			const input = {
				[gameManager.session.players[0].id]: { score: roundScore }
			};
			gameManager.addRoundFromInput(input);
			roundScore = 0;
		}
	}
</script>

<div class="rounded-xl border bg-surface p-4">
	<h3 class="mb-4 text-xl font-bold">Rumba Controls</h3>

	<div class="flex items-end gap-4">
		<label class="flex flex-col gap-2">
			<span>Points to Add</span>
			<input type="number" bind:value={roundScore} class="rounded border px-4 py-2" />
		</label>
		<button onclick={submitRound} class="rounded bg-primary px-6 py-2 text-white"
			>Submit Round</button
		>
	</div>
</div>
