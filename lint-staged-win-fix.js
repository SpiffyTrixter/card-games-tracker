import { execSync } from 'node:child_process';

const files = process.argv.slice(2);
if (files.length === 0) process.exit(0);

const CHUNK_SIZE = 20;

function chunk(arr, size) {
	const chunks = [];
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size));
	}
	return chunks;
}

const fileChunks = chunk(files, CHUNK_SIZE);

let errorOccurred = false;

for (const chunkFiles of fileChunks) {
	const fileList = chunkFiles.join(' ');

	// Separate files for eslint and prettier if needed, or just run both on all if they match
	const svelteJsTsFiles = chunkFiles.filter((f) => /\.(js|ts|svelte)$/.test(f)).join(' ');
	const otherFiles = chunkFiles.filter((f) => /\.(json|md|css)$/.test(f)).join(' ');

	try {
		if (svelteJsTsFiles) {
			console.log(
				`Linting ${chunkFiles.filter((f) => /\.(js|ts|svelte)$/.test(f)).length} files...`
			);
			execSync(`npx eslint --fix ${svelteJsTsFiles}`, { stdio: 'inherit' });
		}
		if (svelteJsTsFiles || otherFiles) {
			console.log(`Formatting ${chunkFiles.length} files...`);
			execSync(`npx prettier --write ${fileList}`, { stdio: 'inherit' });
		}
	} catch (_e) {
		errorOccurred = true;
	}
}

if (errorOccurred) {
	process.exit(1);
}
