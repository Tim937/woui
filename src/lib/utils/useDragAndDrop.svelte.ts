interface SortableOptions {
  onReorder: (group: string, newOrder: string[]) => Promise<void>;
}

export function useSortable(options: SortableOptions) {
  const { onReorder } = options;

  let draggedKey = $state<string | null>(null);
  let draggedGroup = $state<string | null>(null);
  let dragOverKey = $state<string | null>(null);

  let ghost: HTMLElement | null = null;
  let offsetX = 0;
  let offsetY = 0;

  function getItemFromEvent(e: Event): HTMLElement | null {
    return (e.target as HTMLElement).closest('[data-drag-key][data-drag-group]');
  }

  function getGroupFromItem(item: HTMLElement | null): string | null {
    return item?.dataset.dragGroup ?? null;
  }

  function getKeyFromItem(item: HTMLElement | null): string | null {
    return item?.dataset.dragKey ?? null;
  }

  function isFixed(item: HTMLElement | null): boolean {
    return item?.dataset.dragFixed === 'true';
  }

  function getAllKeysInGroup(container: HTMLElement, group: string): string[] {
    const selector = `[data-drag-key][data-drag-group="${group}"]:not([data-drag-fixed="true"])`;
    const items = container.querySelectorAll(selector);
    return Array.from(items).map((el) => (el as HTMLElement).dataset.dragKey!);
  }

  function createGhost(source: HTMLElement, x: number, y: number) {
    const rect = source.getBoundingClientRect();

    // Calcul de l'ancrage sous le curseur
    offsetX = x - rect.left;
    offsetY = y - rect.top;

    ghost = document.createElement('div');

    Object.assign(ghost.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: `${rect.width}px`,
      height: `${rect.height}px`,

      // --- Pattern en data URL (pas de fichier externe) ---
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='10' height='10' fill='rgba(255,255,255,0.4)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '10px 10px',
      borderRadius: getComputedStyle(source.firstElementChild as HTMLElement).borderRadius,


      // --- Style du Ghost ---
      opacity: '0.4',
      pointerEvents: 'none',
      zIndex: '9999',
      willChange: 'transform',
      borderStyle:'1px solid rgba(255,255,255,10)',

      // Positionnement initial
      transform: `translate3d(${rect.left}px, ${rect.top}px, 0) scale(1.02)`
    });

    console.log(rect)
    document.body.appendChild(ghost);
  }

  function moveGhost(x: number, y: number) {
    if (!ghost) return;
    ghost.style.transform = `translate3d(${x - offsetX}px, ${y - offsetY}px, 0) scale(1.02)`;
  }

  function destroyGhost() {
    if (ghost) {
      ghost.remove();
      ghost = null;
    }
  }

  function reset() {
    draggedKey = null;
    draggedGroup = null;
    dragOverKey = null;
    destroyGhost();
  }

  function sortable(container: HTMLElement) {

    function onPointerDown(e: PointerEvent) {
      const item = getItemFromEvent(e);
      const handle = (e.target as HTMLElement).closest('[data-drag-handle]');
      if(!handle) return;
      
      if (!item || isFixed(item)) return;
      if (e.button !== 0) return;

      draggedKey = getKeyFromItem(item);
      draggedGroup = getGroupFromItem(item);

      container.setPointerCapture(e.pointerId);
      createGhost(item, e.clientX, e.clientY);

      e.preventDefault();
    }

    function onPointerMove(e: PointerEvent) {
      if (!draggedKey) return;

      moveGhost(e.clientX, e.clientY);

      const elBelow = document.elementFromPoint(e.clientX, e.clientY);
      if (!elBelow) { dragOverKey = null; return; }

      const itemBelow = elBelow.closest('[data-drag-key][data-drag-group]') as HTMLElement | null;
      if (!itemBelow) { dragOverKey = null; return; }

      const belowKey = getKeyFromItem(itemBelow);
      const belowGroup = getGroupFromItem(itemBelow);

      if (belowGroup === draggedGroup && belowKey !== draggedKey && !isFixed(itemBelow)) {
        dragOverKey = belowKey;
      } else {
        dragOverKey = null;
      }
    }

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

  return {
    sortable,
    get draggedKey() { return draggedKey; },
    get draggedGroup() { return draggedGroup; },
    get dragOverKey() { return dragOverKey; },
    isDragging: (key: string) => key === draggedKey,
    isDragOver: (key: string) => key === dragOverKey,
  };
}
