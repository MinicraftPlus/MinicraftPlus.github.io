<script lang="ts">
	import { page } from '$app/stores';
	export let msg = $page.error!.message;
	export let status = $page.status;
</script>

<div class="flex flex-col h-screen">
	<!-- Reference: https://tailwindcomponents.com/component/simple-404-page-template -->
	<div class="flex items-center justify-center bg-green-400 py-48">
		<div class="flex flex-col">
			<div class="flex flex-col items-center">
				<div class="text-green-700 font-bold text-7xl">
					{status}
				</div>

				<div class="font-bold text-3xl xl:text-7xl lg:text-6xl md:text-5xl mt-10">
					{msg}
				</div>
			</div>
		</div>
	</div>

	<footer class="bg-green-200" aria-labelledby="footer-heading">
		<div class="flex p-12 flex-col items-center m-auto px-6 text-3xl">
			<a href="/">Go back to home</a>
		</div>
	</footer>
</div>
