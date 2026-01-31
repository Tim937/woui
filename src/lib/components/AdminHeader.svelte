<script lang="ts">
	// Props pour personnaliser le header si besoin
	let { userName = "Admin" } = $props();
</script>

<header class="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between shadow-sm">
	<!-- Logo / Titre -->
	<div class="flex items-center gap-4">
		<div class="text-2xl font-bold text-primary">
			Admin Panel
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex gap-6">
		<a href="/admin/dashboard" class="text-gray-700 hover:text-primary transition-colors font-medium">
			Dashboard
		</a>
		<a href="/admin/tasks" class="text-gray-700 hover:text-primary transition-colors font-medium">
			Tâches
		</a>
		<a href="/admin/users" class="text-gray-700 hover:text-primary transition-colors font-medium">
			Utilisateurs
		</a>
		<a href="/admin/settings" class="text-gray-700 hover:text-primary transition-colors font-medium">
			Paramètres
		</a>
	</nav>

	<!-- User Info -->
	<div class="flex items-center gap-3">
		<div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
			{userName.charAt(0).toUpperCase()}
		</div>
		<span class="text-sm text-gray-700">{userName}</span>
		<button class="text-sm text-gray-600 hover:text-gray-900 ml-2 px-3 py-1 rounded hover:bg-gray-100 transition-colors">
			Déconnexion
		</button>
	</div>
</header>
