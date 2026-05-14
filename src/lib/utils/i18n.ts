export function unwrap(value: string | (() => string)): string {
	return typeof value === 'function' ? value() : value;
}
