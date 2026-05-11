import Swal from 'sweetalert2';

export const confirmDialog = async (options: {
	title?: string;
	text: string;
	icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
	confirmButtonText?: string;
	cancelButtonText?: string;
}) => {
	const result = await Swal.fire({
		title: options.title || 'Are you sure?',
		text: options.text,
		icon: options.icon || 'question',
		showCancelButton: true,
		confirmButtonColor: 'var(--color-primary, #e6c364)',
		cancelButtonColor: 'transparent',
		confirmButtonText: options.confirmButtonText || 'Confirm',
		cancelButtonText: options.cancelButtonText || 'Cancel',
		background: 'var(--color-surface-container-high, #2d2a23)',
		color: 'var(--color-on-surface, #f0e6d0)',
		backdrop: `rgba(0,0,0,0.6)`,
		customClass: {
			popup:
				'rounded-2xl border border-outline/10 shadow-2xl font-body-md bg-surface-container-high',
			title: 'font-display-md text-on-surface pt-4',
			htmlContainer: 'text-on-surface-variant font-body-md',
			confirmButton:
				'rounded-full px-8 py-2.5 font-label-lg transition-all hover:brightness-110 active:scale-95 bg-primary text-on-primary border-none mx-2',
			cancelButton:
				'rounded-full px-8 py-2.5 font-label-lg transition-all hover:bg-surface-variant text-primary border border-primary/20 mx-2'
		},
		buttonsStyling: false
	});

	return result.isConfirmed;
};
