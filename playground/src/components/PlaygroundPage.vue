<template>
	<div class="playground-page">
		<h1>gib-validate Playground</h1>
		<p>Quick demos showing basic usage and nested validation.</p>
		<ul>
			<li><router-link to="/playground/form">Form demo</router-link></li>
			<li><router-link to="/playground/nested">Nested validation demo</router-link></li>
			<li><router-link to="/playground/named">Named validation demo</router-link></li>
			<li><router-link to="/playground/components">Form components demo</router-link></li>
		</ul>
	</div>
</template>

<style scoped>
	.playground-page {
		max-width: 720px;
		margin: 32px auto;
		text-align: left;
	}

	.playground-page h1 {
		margin-bottom: 8px;
		font-size: 28px;
	}

	.playground-page ul {
		padding: 0;
		list-style: none;
	}

	.playground-page li {
		margin: 8px 0;
	}

	.playground-page a {
		display: inline-block;

		padding: 8px 16px;
		border-radius: 4px;

		color: white;
		text-decoration: none;

		background-color: rgb(66 153 225);

		transition: background-color 0.2s;
	}

	.playground-page a:hover {
		background-color: rgb(49 130 206);
	}
</style>
