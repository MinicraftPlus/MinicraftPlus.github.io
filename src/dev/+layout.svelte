<script>
	import "../app.css";
	import "./+layout.scss";
</script>

<!-- Source: https://www.material-tailwind.com/docs/html/navbar#sticky-navbar and
 https://tailwindui.com/components/application-ui/navigation/navbars#component-70a9bdf83ef2c8568c5cddf6c39c2331 -->
<nav class="sticky top-0 z-10 block w-full max-w-full px-4 py-2 text-white bg-gray-800 shadow-md h-max bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
	<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
		<div class="relative flex h-14 items-center justify-between">
			<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
				<!-- Mobile menu button-->
				<button type="button" class="w-7 h-5 m-2 menu-toggle relative flex flex-wrap items-center justify-center text-green-300 hover:text-green-100" aria-controls="mobile-menu" aria-expanded="false" on:click={(e) => {
					let b = /** @type {HTMLElement} */ (document.getElementById(/** @type {string} */ (e.currentTarget.getAttribute("aria-controls"))));
					if (e.currentTarget.getAttribute("aria-expanded") === "false") {
						b.classList.remove("hidden")
						b.classList.add("block");
						e.currentTarget.classList.add("active");
						e.currentTarget.setAttribute("aria-expanded", "true");
					} else {
						b.classList.remove("block");
						b.classList.add("hidden");
						e.currentTarget.classList.remove("active");
						e.currentTarget.setAttribute("aria-expanded", "false");
					}
				}}>
					<span class="absolute -inset-0.5"></span>
					<span class="sr-only">Open main menu</span>
				</button>
			</div>
			<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
				<a href="/static" class="flex flex-shrink-0 items-center mr-4">
					<img class="h-8 w-auto" src="" alt="Minicraft+">
				</a>
				<div class="hidden sm:ml-6 sm:block">
					<div class="flex space-x-4">
						<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
						<a class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</a>
						<a class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
						<a class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
						<a class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
					</div>
				</div>
			</div>
			<div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
				<!-- Right elements -->
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	<div class="hidden sm:hidden" id="mobile-menu">
		<div class="space-y-1 px-2 pb-3 pt-2">
			<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
			<a href="#" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
			<a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
			<a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
			<a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
		</div>
	</div>
</nav>

<slot />
