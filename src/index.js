const itemSelector = "button";

export function segmentedControl(root, options = {}) {
  if (!(root instanceof Element)) {
    throw new TypeError("Segmented control root must be an Element.");
  }

  const items = [...root.querySelectorAll(itemSelector)];
  if (items.length === 0) {
    throw new Error("Segmented control requires at least one button.");
  }

  const values = new Set();
  for (const item of items) {
    const value = item.dataset.value;
    if (!value) {
      throw new Error("Every segmented control button requires a data-value.");
    }
    if (values.has(value)) {
      throw new Error("Segmented control data-value attributes must be unique.");
    }
    values.add(value);
  }

  const enabledItems = items.filter((item) => !item.disabled);
  if (enabledItems.length === 0) {
    throw new Error("Segmented control requires at least one enabled button.");
  }

  if (options.onChange !== undefined && typeof options.onChange !== "function") {
    throw new TypeError("Segmented control onChange must be a function.");
  }
  if (options.animated !== undefined && typeof options.animated !== "boolean") {
    throw new TypeError("Segmented control animated must be a boolean.");
  }

  const rootRole = root.getAttribute("role");
  const rootWasAnimated = root.classList.contains("is-animated");
  const itemState = items.map((item) => ({
    role: item.getAttribute("role"),
    selected: item.getAttribute("aria-selected"),
    tabindex: item.getAttribute("tabindex"),
    active: item.classList.contains("is-active"),
  }));

  let activeItem = enabledItems[0];
  if (options.value !== undefined) {
    const requestedItem = items.find((item) => item.dataset.value === options.value);
    if (!requestedItem) {
      throw new Error(`Unknown segmented control value "${options.value}".`);
    }
    if (requestedItem.disabled) {
      throw new Error(`Cannot select disabled value "${options.value}".`);
    }
    activeItem = requestedItem;
  }

  function renderSelection() {
    for (const item of items) {
      const isActive = item === activeItem;
      item.setAttribute("role", "tab");
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
      item.classList.toggle("is-active", isActive);
    }
  }

  function itemForValue(value) {
    const item = items.find((candidate) => candidate.dataset.value === value);
    if (!item) {
      throw new Error(`Unknown segmented control value "${value}".`);
    }
    if (item.disabled) {
      throw new Error(`Cannot select disabled value "${value}".`);
    }
    return item;
  }

  function select(item, notify = false) {
    if (item === activeItem) return;
    activeItem = item;
    renderSelection();
    positionIndicator();
    if (notify) options.onChange?.(activeItem.dataset.value);
  }

  function onClick(event) {
    const item = event.target.closest(itemSelector);
    if (!item || !root.contains(item) || item.disabled) return;
    select(item, true);
  }

  function onKeyDown(event) {
    const item = event.target.closest(itemSelector);
    if (!item || !root.contains(item) || item.disabled) return;

    let nextItem;
    const currentIndex = enabledItems.indexOf(item);
    if (event.key === "ArrowRight") {
      nextItem = enabledItems[(currentIndex + 1) % enabledItems.length];
    } else if (event.key === "ArrowLeft") {
      nextItem = enabledItems[(currentIndex - 1 + enabledItems.length) % enabledItems.length];
    } else if (event.key === "Home") {
      nextItem = enabledItems[0];
    } else if (event.key === "End") {
      nextItem = enabledItems.at(-1);
    } else if (event.key === "Enter" || event.key === " ") {
      nextItem = item;
    } else {
      return;
    }

    event.preventDefault();
    select(nextItem, true);
    nextItem.focus();
  }

  const indicator = document.createElement("span");
  indicator.className = "segmented-control__indicator";
  indicator.setAttribute("aria-hidden", "true");

  function positionIndicator() {
    const rootRect = root.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    indicator.style.width = `${itemRect.width}px`;
    indicator.style.height = `${itemRect.height}px`;
    indicator.style.transform = `translate3d(${itemRect.left - rootRect.left}px, ${itemRect.top - rootRect.top}px, 0)`;
  }

  root.setAttribute("role", "tablist");
  root.classList.toggle("is-animated", options.animated === true);
  root.prepend(indicator);
  renderSelection();
  positionIndicator();
  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);

  let resizeObserver;
  if (typeof globalThis.ResizeObserver === "function") {
    resizeObserver = new ResizeObserver(positionIndicator);
    resizeObserver.observe(root);
  } else {
    window.addEventListener("resize", positionIndicator);
  }

  let destroyed = false;

  function restoreAttribute(element, name, value) {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }

  return {
    get value() {
      return activeItem.dataset.value;
    },
    set(value) {
      select(itemForValue(value));
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", positionIndicator);
      indicator.remove();
      restoreAttribute(root, "role", rootRole);
      root.classList.toggle("is-animated", rootWasAnimated);

      items.forEach((item, index) => {
        const state = itemState[index];
        restoreAttribute(item, "role", state.role);
        restoreAttribute(item, "aria-selected", state.selected);
        restoreAttribute(item, "tabindex", state.tabindex);
        item.classList.toggle("is-active", state.active);
      });
    },
  };
}
