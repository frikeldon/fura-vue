export function getExpandedTreeIds (childProp, elements, prefix = []) {
  const ids = []
  for (let index = 0; index < elements.length; index += 1) {
    const element = elements[index]
    const id = [...prefix, index]
    if (element.expanded) {
      ids.push(id.join(','))
    }
    if (Array.isArray(element[childProp]) && element[childProp].length > 0) {
      ids.push(...getExpandedTreeIds(childProp, element[childProp], id))
    }
  }
  return ids
}

export function cloneStateWithTreeExpands (childProp, elements, expanded, prefix = []) {
  const cloneElements = []
  for (let index = 0; index < elements.length; index += 1) {
    const element = elements[index]
    const id = [...prefix, index]
    cloneElements.push({
      ...element,
      expanded: expanded.has(id.join(',')),
      [childProp]: Array.isArray(element[childProp]) && element[childProp].length > 0
        ? cloneStateWithTreeExpands(childProp, element[childProp], expanded, id)
        : undefined
    })
  }
  return cloneElements
}

export function getExpandedIds (childProp, items) {
  const expanded = []
  let current = items
  let found = true
  while (found && Array.isArray(current)) {
    found = false
    for (let index = 0; index < current.length; index += 1) {
      if (current[index].expanded) {
        expanded.push(index)
        current = current[index][childProp]
        found = true
        break
      }
    }
  }
  return expanded
}

export function cloneStateWithExpands (childProp, items, expanded) {
  const cloneItems = []
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]
    const isExpanded = expanded[0] === index
    cloneItems.push({
      ...item,
      expanded: isExpanded && Array.isArray(item[childProp]) && item[childProp].length > 0,
      childs: Array.isArray(item[childProp]) && item[childProp].length > 0
        ? cloneStateWithExpands(childProp, item[childProp], isExpanded ? expanded.slice(1) : [])
        : undefined
    })
  }
  return cloneItems
}

export function getExpandedIdsFromEvent (event) {
  const ids = []
  let current = event.path
  while (current) {
    ids.push(current.index)
    current = current.path
  }
  ids.push(event.index)
  return ids
}
