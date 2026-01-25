<script lang="ts">
  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    loading = false;

    if (data.success) {
      window.location.href = '/dashboard';
    } else {
      error = data.message;
    }
  }
</script>

<h1>Accéder à votre espace de connexion</h1>

<form onsubmit={handleSubmit}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Mot de passe" required />
  <button type="submit" disabled={loading}>
    {loading ? 'Connexion...' : 'Se connecter'}
  </button>
  {#if error}
    <p>{error}</p>
  {/if}
</form>
