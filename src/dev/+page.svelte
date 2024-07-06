<script>
	import bannerLogo from '$lib/assets/banner_logo.svg';
</script>

<div class="flex flex-col items-center">
	<img class="size-3/4" src={bannerLogo} alt="Banner"/>
</div>

{#each {length: 40} as _, i}
	<p>test</p>
{/each}
