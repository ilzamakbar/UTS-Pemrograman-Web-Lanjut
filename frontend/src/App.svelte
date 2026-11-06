<script>
  import { onMount } from 'svelte';

  /** @type {any[]} */
  let recipes = [];

  /** @type {any} */
  let selectedRecipe = null;

  let loading = false;
  let error = '';

  async function fetchRecipes() {
      loading = true;
      try {
          const res = await fetch('http://localhost:3000/api/recipes');
          if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
          const result = await res.json();
          recipes = result.data || [];
      } catch (err) {
          error = 'Gagal memuat resep.';
      } finally {
          loading = false;
      }
  }

  /** @param {any} id */
  async function fetchDetail(id) {
      loading = true;
      try {
          const res = await fetch(`http://localhost:3000/api/recipes/${id}`);
          if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
          const result = await res.json();
          selectedRecipe = result.data;
      } catch (err) {
          error = 'Gagal memuat detail resep.';
      } finally {
          loading = false;
      }
  }

  onMount(() => {
      fetchRecipes();
  });
</script>

<main style="font-family: Arial, sans-serif; padding: 20px;">
    {#if error}
        <p style="color: red;">{error}</p>
    {/if}

    {#if selectedRecipe}
        <button on:click={() => selectedRecipe = null}>Kembali ke Daftar</button>
        <h2>{selectedRecipe.strMeal}</h2>
        <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} width="300" />
        <p><strong>Kategori:</strong> {selectedRecipe.strCategory}</p>
        
        <h3>Bahan-bahan:</h3>
        <ul>
            {#each Array(20) as _, i}
                {#if selectedRecipe[`strIngredient${i+1}`]}
                    <li>{selectedRecipe[`strIngredient${i+1}`]} - {selectedRecipe[`strMeasure${i+1}`]}</li>
                {/if}
            {/each}
        </ul>

        <h3>Instruksi:</h3>
        <p>{selectedRecipe.strInstructions}</p>
    {:else}
        <h2>Daftar Resep Seafood</h2>
        {#if loading}
            <p>Memuat data...</p>
        {:else}
            <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                {#each recipes as recipe}
                    <button 
                        type="button"
                        style="border: 1px solid #ccc; padding: 10px; cursor: pointer; width: 200px; text-align: left; background: none;" 
                        on:click={() => fetchDetail(recipe.idMeal)}
                    >
                        <img src={recipe.strMealThumb} alt={recipe.strMeal} width="100%" />
                        <h4 style="margin: 10px 0 0 0;">{recipe.strMeal}</h4>
                    </button>
                {/each}
            </div>
        {/if}
    {/if}
</main>