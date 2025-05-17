// Fix for the eleventy-navigation plugin to prevent stack overflow
const MAX_DEPTH = 10;
const navCache = new Map();

export function findNavigationEntries(nodes, activeKey, options = {}) {
  // Create a unique cache key based on the parent
  const cacheKey = `nav-${options.parentKey || "root"}`;
  
  // Check if we've already computed this subtree
  if (navCache.has(cacheKey)) {
    return navCache.get(cacheKey);
  }
  
  // Track the path we're currently exploring to detect cycles
  const pathStack = options._pathStack || new Set();
  const currentPath = options.parentKey || "root";
  
  // Check for cycles - if we've seen this path before, we have a cycle
  if (pathStack.has(currentPath)) {
    console.warn(`[11ty] Navigation cycle detected at: ${currentPath}`);
    return [];
  }
  
  // Add current path to stack
  const newPathStack = new Set(pathStack);
  newPathStack.add(currentPath);
  
  // Check for stack overflow
  if (newPathStack.size > MAX_DEPTH) {
    console.warn(`[11ty] Navigation maximum depth exceeded at: ${currentPath}`);
    return [];
  }
  
  // Function implementation
  let entries = [];
  if (!nodes || !nodes.length) {
    return entries;
  }

  let key = options.parentKey;
  for (let node of nodes) {
    if (!node || !node.data) {
      continue;
    }

    let nav = node.data.eleventyNavigation;
    if (!nav || nav.exclude === true) {
      continue;
    }

    let entry = {
      ...nav,
      url: node.url,
      pluginType: "eleventy-navigation",
      parentKey: options.parentKey || undefined,
    };

    if (
      (key === undefined && (nav.parent === undefined || nav.parent === false)) ||
      (key !== undefined && nav.parent === key)
    ) {
      // Find child entries with cycle protection
      let childEntries = findNavigationEntries(nodes, activeKey, {
        ...options,
        parentKey: nav.key,
        _pathStack: newPathStack
      });
      
      if (childEntries && childEntries.length) {
        entry.children = childEntries;
      }

      entries.push(entry);
    }
  }

  // Sort entries by order
  entries.sort((a, b) => {
    let defaultOrder = 50; // Default order if not specified
    let aOrder = a.order === undefined ? defaultOrder : a.order;
    let bOrder = b.order === undefined ? defaultOrder : b.order;
    return aOrder - bOrder;
  });

  // Cache results to avoid recomputation
  navCache.set(cacheKey, entries);
  return entries;
}

export function findBreadcrumbEntries(nodes, activeKey, options = {}) {
  if (!activeKey) {
    return [];
  }

  // First pass: create a map of all entries by key
  let entriesMap = new Map();
  
  function addEntryToMap(entry) {
    entriesMap.set(entry.key, entry);
    if (entry.children) {
      entry.children.forEach(addEntryToMap);
    }
  }
  
  // Get all entries and add them to the map
  findNavigationEntries(nodes, activeKey, options).forEach(addEntryToMap);
  
  // Second pass: find the breadcrumb trail
  let entries = [];
  
  function findBreadcrumb(key) {
    let entry = entriesMap.get(key);
    if (!entry) return false;
    
    entries.unshift(entry);
    
    if (entry.parentKey) {
      return findBreadcrumb(entry.parentKey);
    }
    
    return true;
  }
  
  let found = findBreadcrumb(activeKey);
  
  return found ? entries : [];
}

export function toHtml(pages, options = {}) {
  if (!pages) {
    return "";
  }

  options = Object.assign({
    listElement: "ul",
    listItemElement: "li",
    listClass: "",
    listItemClass: "",
    listItemHasChildrenClass: "",
    activeKey: "",
    activeListItemClass: "",
    anchorClass: "",
    activeAnchorClass: ""
  }, options);

  return `<${options.listElement}${options.listClass ? ` class="${options.listClass}"` : ""}>
    ${pages.map(entry => {
      let liClass = [];
      let aClass = [];

      if (options.listItemClass) {
        liClass.push(options.listItemClass);
      }

      if (options.anchorClass) {
        aClass.push(options.anchorClass);
      }

      if (options.activeKey && options.activeKey === entry.key) {
        if (options.activeListItemClass) {
          liClass.push(options.activeListItemClass);
        }
        if (options.activeAnchorClass) {
          aClass.push(options.activeAnchorClass);
        }
      }

      if (entry.children && entry.children.length) {
        if (options.listItemHasChildrenClass) {
          liClass.push(options.listItemHasChildrenClass);
        }
      }

      return `<${options.listItemElement}${liClass.length ? ` class="${liClass.join(" ")}"` : ""}>
        <a href="${entry.url}"${aClass.length ? ` class="${aClass.join(" ")}"` : ""}>${entry.title || entry.key}</a>
        ${(entry.children && entry.children.length) ? toHtml.call(this, entry.children, options) : ""}
      </${options.listItemElement}>`;
    }).join("\n")}
  </${options.listElement}>`;
}

export function toMarkdown(pages, options = {}) {
  if (!pages) {
    return "";
  }

  options = Object.assign({
    activeKey: undefined,
    indent: 2
  }, options);

  if (options._level === undefined) {
    options._level = 0;
  }

  return pages.map(entry => {
    let line = "";
    if (options._level > 0) {
      line += " ".repeat(options._level * options.indent);
    }
    line += `- [${entry.title || entry.key}](${entry.url})`;
    
    if (entry.children && entry.children.length) {
      let childOptions = {...options};
      childOptions._level = options._level + 1;
      line += "\n" + toMarkdown.call(this, entry.children, childOptions);
    }
    
    return line;
  }).join("\n");
}

export function getDependencyGraph() {
  return {};
}

export default {
  findNavigationEntries,
  findBreadcrumbEntries,
  toHtml,
  toMarkdown,
  getDependencyGraph
};
