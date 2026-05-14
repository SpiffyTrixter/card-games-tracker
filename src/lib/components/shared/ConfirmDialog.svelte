<script lang="ts">
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '$lib/components/ui/alert-dialog/index.js';
	import { m } from '$lib/paraglide/messages.js';

	let {
		isOpen = $bindable(true),
		title = m.are_you_sure(),
		text,
		confirmButtonText = m.confirm(),
		cancelButtonText = m.cancel(),
		onConfirm,
		onCancel,
		destroy
	} = $props<{
		isOpen?: boolean;
		title?: string;
		text: string;
		confirmButtonText?: string;
		cancelButtonText?: string;
		onConfirm: () => void;
		onCancel: () => void;
		destroy: () => void;
	}>();

	function handleOpenChange(open: boolean) {
		if (!open) {
			onCancel();
			setTimeout(() => destroy(), 300); // Wait for animation before destroying
		}
	}

	function handleConfirm() {
		isOpen = false;
		onConfirm();
		setTimeout(() => destroy(), 300);
	}

	function handleCancel() {
		isOpen = false;
		onCancel();
		setTimeout(() => destroy(), 300);
	}
</script>

<AlertDialog bind:open={isOpen} onOpenChange={handleOpenChange}>
	<AlertDialogContent class="border-border bg-card">
		<AlertDialogHeader>
			<AlertDialogTitle class="text-foreground">{title}</AlertDialogTitle>
			<AlertDialogDescription class="text-muted-foreground">
				{text}
			</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel onclick={handleCancel} class="text-foreground hover:bg-muted"
				>{cancelButtonText}</AlertDialogCancel
			>
			<AlertDialogAction
				onclick={handleConfirm}
				class="bg-primary text-primary-foreground hover:bg-primary/90"
				>{confirmButtonText}</AlertDialogAction
			>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
