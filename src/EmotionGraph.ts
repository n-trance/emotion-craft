/**
 * EmotionGraph - A directed acyclic graph (DAG) representing emotion combinations
 * 
 * Structure:
 * - Nodes: Emotions (base and combined)
 * - Edges: Directed edges from [parent1, parent2] -> child emotion
 * 
 * This allows efficient queries like:
 * - What emotions combine to create X? (getParents)
 * - What can I create from X? (getChildren)
 * - What are the base components of X? (getBaseComponents)
 * - What level is this emotion? (getLevel)
 */

export interface EmotionNode {
  name: string
  level: number
  baseComponents: string[] // Base emotions that contribute to this
}

export interface CombinationEdge {
  from: [string, string] // The two parent emotions
  to: string // The resulting emotion
}

export class EmotionGraph {
  // Map of emotion name -> node data
  private nodes: Map<string, EmotionNode> = new Map()
  
  // Map of child emotion -> set of parent pairs that create it
  // Format: "child" -> Set<"parent1+parent2">
  private edges: Map<string, Set<string>> = new Map()
  
  // Reverse lookup: parent pair -> child
  // Format: "parent1+parent2" -> "child"
  private combinationMap: Map<string, string> = new Map()
  
  // Cache for base components
  private baseComponentsCache: Map<string, string[]> = new Map()
  
  // Cache for levels
  private levelCache: Map<string, number> = new Map()
  
  private baseEmotions: Set<string>

  constructor(baseEmotions: string[]) {
    this.baseEmotions = new Set(baseEmotions)
    
    // Initialize base emotion nodes
    baseEmotions.forEach(emotion => {
      this.nodes.set(emotion, {
        name: emotion,
        level: 0,
        baseComponents: [emotion]
      })
      this.levelCache.set(emotion, 0)
      this.baseComponentsCache.set(emotion, [emotion])
    })
  }

  /**
   * Add a combination rule: parent1 + parent2 -> child
   * @param skipPropertyUpdate If true, skip updating node properties (for faster bulk loading)
   */
  addCombination(parent1: string, parent2: string, child: string, skipPropertyUpdate: boolean = false): void {
    // Ensure parent nodes exist
    if (!this.nodes.has(parent1)) {
      this.addNode(parent1)
    }
    if (!this.nodes.has(parent2)) {
      this.addNode(parent2)
    }
    if (!this.nodes.has(child)) {
      this.addNode(child)
    }

    // Create edge key (normalized: always sort parents alphabetically)
    const edgeKey = [parent1, parent2].sort().join('+')
    
    // Add to combination map
    this.combinationMap.set(edgeKey, child)
    
    // Add reverse edge (child -> parents)
    if (!this.edges.has(child)) {
      this.edges.set(child, new Set())
    }
    this.edges.get(child)!.add(edgeKey)

    // Only update properties if not skipping (for performance during bulk loading)
    if (!skipPropertyUpdate) {
      // Invalidate caches for the child
      this.baseComponentsCache.delete(child)
      this.levelCache.delete(child)
      
      // Recalculate child's properties
      this.updateNodeProperties(child)
    }
  }

  /**
   * Add a node (emotion) to the graph
   */
  private addNode(emotion: string): void {
    if (!this.nodes.has(emotion)) {
      this.nodes.set(emotion, {
        name: emotion,
        level: -1, // Will be calculated
        baseComponents: [] // Will be calculated
      })
    }
  }

  /**
   * Update node properties (level, base components) based on graph structure
   */
  private updateNodeProperties(emotion: string): void {
    const node = this.nodes.get(emotion)!
    
    // Calculate base components
    const baseComponents = this.getBaseComponentsInternal(emotion)
    node.baseComponents = baseComponents
    
    // Calculate level
    const level = this.getLevelInternal(emotion)
    node.level = level
  }

  /**
   * Get the result of combining two emotions
   */
  getCombination(emotion1: string, emotion2: string): string | null {
    if (emotion1 === emotion2) {
      return null
    }
    
    const edgeKey = [emotion1, emotion2].sort().join('+')
    return this.combinationMap.get(edgeKey) || null
  }

  /**
   * Get all parent pairs that create this emotion
   */
  getParents(emotion: string): Array<[string, string]> {
    const parentPairs = this.edges.get(emotion)
    if (!parentPairs) {
      return []
    }
    
    return Array.from(parentPairs).map(pair => {
      const [p1, p2] = pair.split('+')
      return [p1, p2] as [string, string]
    })
  }

  /**
   * Get all emotions that can be created from this emotion (with any other)
   */
  getChildren(emotion: string): string[] {
    const children: Set<string> = new Set()
    
    // Check all possible combinations with this emotion
    for (const [edgeKey, child] of this.combinationMap.entries()) {
      const [p1, p2] = edgeKey.split('+')
      if (p1 === emotion || p2 === emotion) {
        children.add(child)
      }
    }
    
    return Array.from(children)
  }

  /**
   * Get all base emotions that contribute to this emotion
   */
  getBaseComponents(emotion: string): string[] {
    if (this.baseComponentsCache.has(emotion)) {
      return this.baseComponentsCache.get(emotion)!
    }
    
    const result = this.getBaseComponentsInternal(emotion)
    this.baseComponentsCache.set(emotion, result)
    return result
  }

  /**
   * Internal method to calculate base components using BFS
   */
  private getBaseComponentsInternal(emotion: string): string[] {
    // Base emotions are their own components
    if (this.baseEmotions.has(emotion)) {
      return [emotion]
    }

    const components = new Set<string>()
    const visited = new Set<string>()
    const queue: string[] = [emotion]

    while (queue.length > 0) {
      const current = queue.shift()!
      if (visited.has(current)) continue
      visited.add(current)

      // If it's a base emotion, add it
      if (this.baseEmotions.has(current)) {
        components.add(current)
        continue
      }

      // Find parents and add them to queue
      const parents = this.getParents(current)
      for (const [p1, p2] of parents) {
        if (!visited.has(p1)) {
          queue.push(p1)
        }
        if (!visited.has(p2)) {
          queue.push(p2)
        }
      }
    }

    return Array.from(components).sort()
  }

  /**
   * Get the combination level of an emotion (0 = base, 1 = first combination, etc.)
   */
  getLevel(emotion: string): number {
    if (this.levelCache.has(emotion)) {
      return this.levelCache.get(emotion)!
    }
    
    const result = this.getLevelInternal(emotion)
    this.levelCache.set(emotion, result)
    return result
  }

  /**
   * Internal method to calculate level using BFS
   */
  private getLevelInternal(emotion: string): number {
    if (this.baseEmotions.has(emotion)) {
      return 0
    }

    // Use BFS to find shortest path from base emotions
    const visited = new Set<string>()
    const queue: Array<{ emotion: string; level: number }> = []

    // Initialize queue with base emotions
    this.baseEmotions.forEach(base => {
      queue.push({ emotion: base, level: 0 })
      visited.add(base)
    })

    while (queue.length > 0) {
      const current = queue.shift()!
      
      if (current.emotion === emotion) {
        return current.level
      }

      // Check all combinations that can be created from current emotion
      const children = this.getChildren(current.emotion)
      for (const child of children) {
        if (!visited.has(child)) {
          visited.add(child)
          // Level is parent's level + 1
          const childLevel = current.level + 1
          queue.push({ emotion: child, level: childLevel })
        }
      }
    }

    // If not found, return a high number (shouldn't happen in a well-formed graph)
    return 10
  }

  /**
   * Get all emotions that can combine with the given emotion
   */
  getCombinableEmotions(emotion: string): string[] {
    const combinable: Set<string> = new Set()
    
    // Check all emotions to see if they combine with this one
    for (const otherEmotion of this.nodes.keys()) {
      if (otherEmotion !== emotion) {
        const result = this.getCombination(emotion, otherEmotion)
        if (result) {
          combinable.add(otherEmotion)
        }
      }
    }
    
    return Array.from(combinable)
  }

  /**
   * Get all emotions in the graph
   */
  getAllEmotions(): string[] {
    return Array.from(this.nodes.keys())
  }

  /**
   * Check if an emotion exists in the graph
   */
  hasEmotion(emotion: string): boolean {
    return this.nodes.has(emotion)
  }

  /**
   * Get node data for an emotion
   */
  getNode(emotion: string): EmotionNode | undefined {
    return this.nodes.get(emotion)
  }

  /**
   * Find all paths from one emotion to another
   */
  getAllPaths(from: string, to: string): string[][] {
    const paths: string[][] = []
    const visited = new Set<string>()
    
    const dfs = (current: string, path: string[]): void => {
      if (current === to) {
        paths.push([...path])
        return
      }
      
      if (visited.has(current)) {
        return
      }
      
      visited.add(current)
      path.push(current)
      
      const children = this.getChildren(current)
      for (const child of children) {
        dfs(child, [...path])
      }
      
      visited.delete(current)
      path.pop()
    }
    
    dfs(from, [])
    return paths
  }

  /**
   * Get shortest path from one emotion to another
   */
  getShortestPath(from: string, to: string): string[] | null {
    const paths = this.getAllPaths(from, to)
    if (paths.length === 0) {
      return null
    }
    
    return paths.reduce((shortest, path) => 
      path.length < shortest.length ? path : shortest
    )
  }

  /**
   * Finalize graph by calculating all node properties in a single efficient pass.
   * Call this after adding all combinations to avoid redundant calculations.
   */
  finalizeGraph(): void {
    // Clear all caches to ensure fresh calculation
    this.baseComponentsCache.clear()
    this.levelCache.clear()

    // Calculate levels using BFS from base emotions (single pass for all nodes)
    const visited = new Set<string>()
    const queue: Array<{ emotion: string; level: number }> = []

    // Initialize queue with base emotions
    this.baseEmotions.forEach(base => {
      queue.push({ emotion: base, level: 0 })
      visited.add(base)
      this.levelCache.set(base, 0)
    })

    // BFS to calculate levels for all nodes
    while (queue.length > 0) {
      const current = queue.shift()!
      
      // Update node level
      const node = this.nodes.get(current.emotion)
      if (node) {
        node.level = current.level
      }

      // Check all combinations that can be created from current emotion
      const children = this.getChildren(current.emotion)
      for (const child of children) {
        if (!visited.has(child)) {
          visited.add(child)
          const childLevel = current.level + 1
          queue.push({ emotion: child, level: childLevel })
          this.levelCache.set(child, childLevel)
        }
      }
    }

    // Calculate base components for all nodes
    // Process nodes in level order (base emotions first, then level 1, etc.)
    // This allows us to build base components from parents efficiently
    const nodesByLevel = new Map<number, string[]>()
    for (const [emotion, node] of this.nodes.entries()) {
      const level = node.level >= 0 ? node.level : 10 // Fallback for unreachable nodes
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, [])
      }
      nodesByLevel.get(level)!.push(emotion)
    }

    // Sort levels and process from lowest to highest
    const sortedLevels = Array.from(nodesByLevel.keys()).sort((a, b) => a - b)
    for (const level of sortedLevels) {
      const emotionsAtLevel = nodesByLevel.get(level)!
      for (const emotion of emotionsAtLevel) {
        // Base emotions are their own components
        if (this.baseEmotions.has(emotion)) {
          const node = this.nodes.get(emotion)!
          node.baseComponents = [emotion]
          this.baseComponentsCache.set(emotion, [emotion])
        } else {
          // For non-base emotions, combine base components from all parents
          const baseComponentsSet = new Set<string>()
          const parents = this.getParents(emotion)
          
          for (const [p1, p2] of parents) {
            // Get base components of parent1 (should already be calculated since we process by level)
            const p1Components = this.baseComponentsCache.get(p1) || this.getBaseComponentsInternal(p1)
            p1Components.forEach(comp => baseComponentsSet.add(comp))
            
            // Get base components of parent2
            const p2Components = this.baseComponentsCache.get(p2) || this.getBaseComponentsInternal(p2)
            p2Components.forEach(comp => baseComponentsSet.add(comp))
          }
          
          const baseComponents = Array.from(baseComponentsSet).sort()
          const node = this.nodes.get(emotion)!
          node.baseComponents = baseComponents
          this.baseComponentsCache.set(emotion, baseComponents)
        }
      }
    }
  }
}

