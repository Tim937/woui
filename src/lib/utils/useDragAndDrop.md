# useSortable — Pointer Events + Ghost Clone

## Principe

On remplace le drag natif (`dragstart`, `dragover`, `drop`) par des **pointer events**
(`pointerdown`, `pointermove`, `pointerup`).

Au lieu de déplacer l'élément réel dans le DOM, on crée un **clone visuel** (`ghost`)
en `position: fixed` qui suit le curseur. L'élément original reste en place (opacité réduite).

### Avantages
- **Performance** : pas de reflow DOM pendant le drag
- **Contrôle total** : scale, rotation, opacité, transitions sur le ghost
- **Cross-browser** : pas de différences de rendu du drag image natif

---

## Code complet

```typescript
// src/lib/utils/useDragAndDrop.svelte.ts

interface SortableOptions {
  onReorder: (group: string, newOrder: string[]) => Promise<void>;
}

export function useSortable(options: SortableOptions) {
  const { onReorder } = options;

  // ─── État réactif (Svelte 5 runes) ───
  let draggedKey = $state<string | null>(null);
  let draggedGroup = $state<string | null>(null);
  let dragOverKey = $state<string | null>(null);

  // ─── Référence interne du ghost (non réactif, pas besoin) ───
  let ghost: HTMLElement | null = null;
  let offsetX = 0;
  let offsetY = 0;

  // ─── Helpers : lecture des data-attributes ───

  function getItemFromEvent(e: Event): HTMLElement | null {
    return (e.target as HTMLElement).closest('[data-drag-key][data-drag-group]');
  }

  function getKey(el: HTMLElement | null): string | null {
    return el?.dataset.dragKey ?? null;
  }

  function getGroup(el: HTMLElement | null): string | null {
    return el?.dataset.dragGroup ?? null;
  }

  function isFixed(el: HTMLElement | null): boolean {
    return el?.dataset.dragFixed === 'true';
  }

  function getAllKeysInGroup(container: HTMLElement, group: string): string[] {
    const selector = `[data-drag-key][data-drag-group="${group}"]:not([data-drag-fixed="true"])`;
    return Array.from(container.querySelectorAll(selector))
      .map((el) => (el as HTMLElement).dataset.dragKey!);
  }

  // ─── Ghost : création, déplacement, destruction ───

  /**
   * Crée un clone visuel de l'élément source.
   * - position: fixed → ne perturbe pas le layout
   * - pointer-events: none → les events traversent le ghost
   *   (permet à elementFromPoint de détecter les éléments en dessous)
   * - scale(1.03) → effet "soulevé"
   */
  function createGhost(source: HTMLElement, x: number, y: number) {
    const rect = source.getBoundingClientRect();

    // Offset = distance entre le coin haut-gauche de l'élément et le clic
    // Permet que le ghost reste aligné sous le curseur
    offsetX = x - rect.left;
    offsetY = y - rect.top;

    // Clone le noeud DOM complet (enfants inclus)
    ghost = source.cloneNode(true) as HTMLElement;

    Object.assign(ghost.style, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: '0',
      pointerEvents: 'none',       // CRITIQUE : les events passent à travers
      zIndex: '9999',
      opacity: '0.85',
      transform: 'scale(1.03)',    // Effet "soulevé"
      transition: 'transform 150ms ease, opacity 150ms ease',
      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
      borderRadius: getComputedStyle(source).borderRadius,
    });

    document.body.appendChild(ghost);
  }

  /** Déplace le ghost à la position du curseur */
  function moveGhost(x: number, y: number) {
    if (!ghost) return;
    ghost.style.left = `${x - offsetX}px`;
    ghost.style.top = `${y - offsetY}px`;
  }

  /** Supprime le ghost du DOM */
  function destroyGhost() {
    if (ghost) {
      ghost.remove();
      ghost = null;
    }
  }

  // ─── Reset ───

  function reset() {
    draggedKey = null;
    draggedGroup = null;
    dragOverKey = null;
    destroyGhost();
  }

  // ─── Action Svelte ───

  function sortable(container: HTMLElement) {

    /**
     * POINTERDOWN — Début du drag
     *
     * 1. Identifie l'élément via closest('[data-drag-key]')
     * 2. Capture le pointer (reçoit les events même hors du container)
     * 3. Crée le ghost
     */
    function onPointerDown(e: PointerEvent) {
      const item = getItemFromEvent(e);
      if (!item || isFixed(item)) return;
      if (e.button !== 0) return; // Clic gauche uniquement

      draggedKey = getKey(item);
      draggedGroup = getGroup(item);

      // setPointerCapture → pointermove/pointerup restent attachés
      // même si le curseur sort du container ou de la fenêtre
      container.setPointerCapture(e.pointerId);

      createGhost(item, e.clientX, e.clientY);

      e.preventDefault(); // Empêche la sélection de texte
    }

    /**
     * POINTERMOVE — Déplacement
     *
     * 1. Déplace le ghost
     * 2. Utilise elementFromPoint pour trouver l'élément SOUS le ghost
     *    (le ghost a pointer-events: none, donc il est ignoré)
     * 3. Met à jour dragOverKey si on survole un item du même groupe
     */
    function onPointerMove(e: PointerEvent) {
      if (!draggedKey) return;

      moveGhost(e.clientX, e.clientY);

      // elementFromPoint ignore le ghost (pointer-events: none)
      const elBelow = document.elementFromPoint(e.clientX, e.clientY);
      if (!elBelow) { dragOverKey = null; return; }

      const itemBelow = elBelow.closest('[data-drag-key][data-drag-group]') as HTMLElement | null;
      if (!itemBelow) { dragOverKey = null; return; }

      const belowKey = getKey(itemBelow);
      const belowGroup = getGroup(itemBelow);

      if (belowGroup === draggedGroup && belowKey !== draggedKey && !isFixed(itemBelow)) {
        dragOverKey = belowKey;
      } else {
        dragOverKey = null;
      }
    }

    /**
     * POINTERUP — Fin du drag
     *
     * 1. Libère le pointer
     * 2. Si dragOverKey existe → calcule le nouvel ordre
     * 3. Appelle onReorder
     * 4. Reset tout
     */
    async function onPointerUp(e: PointerEvent) {
      if (!draggedKey || !draggedGroup) { reset(); return; }

      container.releasePointerCapture(e.pointerId);

      if (dragOverKey) {
        const currentKeys = getAllKeysInGroup(container, draggedGroup);
        const fromIndex = currentKeys.indexOf(draggedKey);
        const toIndex = currentKeys.indexOf(dragOverKey);

        if (fromIndex !== -1 && toIndex !== -1) {
          const newOrder = [...currentKeys];
          newOrder.splice(fromIndex, 1);
          newOrder.splice(toIndex, 0, draggedKey);

          try {
            await onReorder(draggedGroup, newOrder);
          } catch (error) {
            console.error('Échec du réordonnancement :', error);
          }
        }
      }

      reset();
    }

    // ─── 3 listeners seulement ───
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);

    return {
      destroy() {
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        destroyGhost();
      },
    };
  }

  // ─── API publique ───
  return {
    sortable,
    get draggedKey() { return draggedKey; },
    get draggedGroup() { return draggedGroup; },
    get dragOverKey() { return dragOverKey; },
    isDragging: (key: string) => key === draggedKey,
    isDragOver: (key: string) => key === dragOverKey,
  };
}
```

---

## Utilisation

**Aucun `draggable="true"` nécessaire** — les pointer events gèrent tout.

```svelte
<ul use:sortable>
  {#each tasks as task}
    <li
      data-drag-key={task.id}
      data-drag-group="tasks"
      class:opacity-50={isDragging(task.id)}
      class:ring-2={isDragOver(task.id)}
    >
      <Taskscard {task} />
    </li>
  {/each}
</ul>
```

---

## Personnalisation du Ghost

Modifie `Object.assign` dans `createGhost()` :

```typescript
// Rotation "papier soulevé"
transform: 'scale(1.03) rotate(1deg)',

// Plus transparent
opacity: '0.7',

// Flou léger
filter: 'blur(0.5px)',

// Ombre plus forte
boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
```

---

## Résumé des events

| Event | Rôle |
|---|---|
| `pointerdown` | Identifie l'item, crée le ghost, capture le pointer |
| `pointermove` | Déplace le ghost, détecte l'élément sous le curseur via `elementFromPoint` |
| `pointerup` | Calcule le nouvel ordre, appelle `onReorder`, nettoie |

## Pourquoi pointer events > drag natif

| | Drag natif | Pointer events |
|---|---|---|
| Ghost image | Opaque, pixelisé, non stylable | Clone DOM, full CSS |
| Events | 6 types (dragstart, drag, dragenter, dragleave, dragover, drop) | 3 types |
| Mobile | Partiel | Natif |
| Contrôle | Limité | Total |
