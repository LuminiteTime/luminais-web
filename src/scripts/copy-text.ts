const RESET_AFTER_MS = 1800;

/**
 * Buttons with `data-copy="text"` copy it to the clipboard and show `data-done` for a moment.
 * Falls back to `data-fallback` (a URL) when the Clipboard API is unavailable.
 */
export function initCopyButtons(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const label = button.textContent;
    const { copy = '', done = '', fallback } = button.dataset;

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copy);
        button.textContent = done;
        setTimeout(() => (button.textContent = label), RESET_AFTER_MS);
      } catch {
        if (fallback) location.href = fallback;
      }
    });
  });
}
