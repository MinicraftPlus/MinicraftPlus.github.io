<script>
	import bannerLogo from '$lib/assets/banner_logo.svg';
</script>

<div class="flex flex-col items-center justify-center w-full h-screen box-border">
	<div class="flex flex-col bg-green-600 w-full py-8">
		<div class="flex flex-col items-center">
			<img class="size-3/4" src={bannerLogo} alt="Banner"/>
		</div>
	</div>

	<div class="min-h-0 w-full flex-grow items-center bg-sky-200">
		<div class="mx-auto text-center space-y-6 place-items-center h-full p-10 rounded-xl shadow-2xl my-20 sm:my-auto bg-green-200 border-4 border-green-900">
			<h1 class="text-6xl">
				Under Construction
			</h1>
			<h2 class="text-5xl">
				Coming Soon
			</h2>
			<p>
				New page is under construction<br/>
				Meanwhile take a look at <a data-sveltekit-reload rel="external" href="./old/index.html">our old site</a>
			</p>
		</div>
	</div>
</div>
