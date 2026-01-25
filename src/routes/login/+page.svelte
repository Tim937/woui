<script lang="ts">
  import { enhance } from '$app/forms';

  let { form } = $props();
  let loading = $state(false);
</script>

<h1>Accéder à votre espace de connexion</h1>

<form method="POST" use:enhance={() => {
  loading = true;
  return async ({ update }) => {
    loading = false;
    await update();
  };
}}>
  <input type="email" name="email" value={form?.email ?? ''} placeholder="Email" required />
  <input type="password" name="password" placeholder="Mot de passe" required />
  <button type="submit" disabled={loading}>
    {loading ? 'Connexion...' : 'Se connecter'}
  </button>
  {#if form?.message}
    <p>{form.message}</p>
  {/if}
</form>
