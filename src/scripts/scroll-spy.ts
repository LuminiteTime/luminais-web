/** Marks the nav link of the section in the middle of the viewport with aria-current. */
export function initScrollSpy(links: HTMLAnchorElement[]): void {
  const byId = new Map(links.map((link) => [link.hash.slice(1), link]));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        byId.forEach((link, id) => {
          if (id === entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );

  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}
