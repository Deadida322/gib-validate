<template>
	<div class="app-shell">
		<header class="topbar">
			<router-link
				class="brand"
				to="/">
				gib-validate
			</router-link>

			<nav class="nav">
				<router-link to="/playground/form">Basic</router-link>
				<router-link to="/playground/advanced">Advanced</router-link>
				<router-link to="/playground/nested">Nested</router-link>
				<router-link to="/playground/named">Named</router-link>
			</nav>
		</header>

		<main>
			<router-view />
		</main>
	</div>
</template>

<style>
	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		color: rgb(31 41 55);
		background: rgb(248 250 252);
	}

	button,
	input {
		font: inherit;
	}

	.app-shell {
		min-height: 100vh;
	}

	.topbar {
		position: sticky;
		z-index: 8;
		top: 0;

		display: flex;
		gap: 24px;
		align-items: center;
		justify-content: space-between;

		padding: 14px 28px;
		border-bottom: 1px solid rgb(226 232 240);

		background: rgb(255 255 255 / 92%);
		backdrop-filter: blur(12px);
	}

	.brand {
		font-weight: 800;
		color: rgb(15 23 42);
		text-decoration: none;
	}

	.nav {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: flex-end;
	}

	.nav a {
		padding: 8px 10px;
		border-radius: 6px;
		color: rgb(71 85 105);
		text-decoration: none;
	}

	.nav a.router-link-active {
		color: rgb(22 101 52);
		background: rgb(220 252 231);
	}

	main {
		width: min(1120px, calc(100vw - 32px));
		margin: 0 auto;
		padding: 32px 0 48px;
	}

	@media (width <= 720px) {
		.topbar {
			flex-direction: column;
			align-items: flex-start;
		}

		.nav {
			justify-content: flex-start;
		}
	}
</style>
