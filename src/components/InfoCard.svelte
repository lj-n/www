<script lang="ts">
	import { onMount } from "svelte";
	import { spring } from "svelte/motion";

	/* Accessibility */
	let reducedMotion = false;
	onMount(() => {
		const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
		reducedMotion = window.matchMedia(reducedMotionQuery).matches;

		const updateReducedMotion = (ev: MediaQueryListEvent) => {
			reducedMotion = ev.matches;
		};

		const mediaQueryList = window.matchMedia(reducedMotionQuery);
		mediaQueryList.addEventListener("change", updateReducedMotion);

		return () => {
			mediaQueryList.removeEventListener("change", updateReducedMotion);
		};
	});

	/* Dom Element */
	let card: HTMLDivElement;
	$: rect = card?.getBoundingClientRect();

	/* Spring Animation */
	const coords = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.95 });

	function resetSpring() {
		coords.set({ y: 0, x: 0 }, { soft: 4, hard: reducedMotion });
	}

	function handleMove(ev: PointerEvent) {
		if (reducedMotion || !rect) {
			resetSpring();
			return;
		}

		coords.set({
			y: ((ev.clientX - rect.left) / rect.width - 0.5) * 18,
			x: -((ev.clientY - rect.top) / rect.height - 0.5) * 30,
		});
	}

	/* Dynamic CSS Variables */
	$: css = Object.entries($coords)
		.map(
			([key, value]) => `
			--${key}:${value * 0.8}deg;
			--bg-${key}:${value * 0.4}deg
			`
		)
		.join(";");
</script>

<div
	class="card"
	bind:this={card}
	on:pointerleave={resetSpring}
	on:pointermove={handleMove}
	style={css}
>
	<div class="wrapper">
		<slot />
	</div>
</div>

<style>
	div.card {
		margin: auto;
		border-radius: 0.25rem;
		transform-style: preserve-3d;
		transform: perspective(1000px) rotateX(var(--x, 0deg)) rotateY(var(--y, 0deg)) translateZ(0);
		backface-visibility: hidden;
		position: relative;
	}
	div.card::after {
		content: "";
		position: absolute;
		height: 105%;
		width: 110%;
		border-radius: 0.25rem;
		inset: 0;
		border: 2px solid var(--card-border);
		background: linear-gradient(45deg, var(--red) 0%, var(--blue) 100%);
		transform-style: preserve-3d;
		box-shadow: var(--shadow-big);
		transform: perspective(1000px) translate3d(-5%, -2.5%, -64px) rotateX(var(--bg-x))
			rotateY(var(--bg-y));
	}
	div.wrapper {
		padding: 2rem;
	}
</style>
