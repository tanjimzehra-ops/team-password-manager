import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured, type MatrixCell, type MatrixData } from '@/lib/supabase'

type MatrixType = 'contribution' | 'convergence' | 'development'

/**
 * Hook to fetch all matrix cells for a system
 */
export function useAllMatrixCells(systemId: string | null) {
  return useQuery({
    queryKey: ['matrix-cells', systemId],
    queryFn: async () => {
      if (!systemId) return []

      const { data, error } = await supabase
        .from('matrix_cells')
        .select('*')
        .eq('system_id', systemId)
        .order('row_index')
        .order('col_index')

      if (error) {
        console.error('Error fetching matrix cells:', error)
        throw error
      }

      return data as MatrixCell[]
    },
    enabled: isSupabaseConfigured && !!systemId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to fetch matrix cells by type
 */
export function useMatrixCells(systemId: string | null, matrixType: MatrixType) {
  return useQuery({
    queryKey: ['matrix-cells', systemId, matrixType],
    queryFn: async () => {
      if (!systemId) return []

      const { data, error } = await supabase
        .from('matrix_cells')
        .select('*')
        .eq('system_id', systemId)
        .eq('matrix_type', matrixType)
        .order('row_index')
        .order('col_index')

      if (error) {
        console.error(`Error fetching ${matrixType} cells:`, error)
        throw error
      }

      return data as MatrixCell[]
    },
    enabled: isSupabaseConfigured && !!systemId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Convenience hook for Contribution Map cells (Outcomes × Value Chain)
 */
export function useContributionMapCells(systemId: string | null) {
  return useMatrixCells(systemId, 'contribution')
}

/**
 * Convenience hook for Convergence Map cells (External × Internal)
 */
export function useConvergenceMapCells(systemId: string | null) {
  return useMatrixCells(systemId, 'convergence')
}

/**
 * Convenience hook for Development Pathways cells (Resources × Value Chain)
 */
export function useDevelopmentPathwaysCells(systemId: string | null) {
  return useMatrixCells(systemId, 'development')
}

/**
 * Hook to get matrix cells grouped by type
 */
export function useMatrixCellsGrouped(systemId: string | null): {
  data: MatrixData | null
  isLoading: boolean
  error: Error | null
} {
  const { data: allCells, isLoading, error } = useAllMatrixCells(systemId)

  if (!allCells) {
    return {
      data: null,
      isLoading,
      error,
    }
  }

  return {
    data: {
      contribution: allCells.filter((c) => c.matrix_type === 'contribution'),
      convergence: allCells.filter((c) => c.matrix_type === 'convergence'),
      development: allCells.filter((c) => c.matrix_type === 'development'),
    },
    isLoading,
    error,
  }
}

/**
 * Helper to get cell content at specific position
 */
export function getCellContent(
  cells: MatrixCell[],
  rowIndex: number,
  colIndex: number
): string | null {
  const cell = cells.find((c) => c.row_index === rowIndex && c.col_index === colIndex)
  return cell?.content ?? null
}

/**
 * Helper to convert cells array to 2D grid
 */
export function cellsToGrid(
  cells: MatrixCell[],
  rows: number,
  cols: number
): (string | null)[][] {
  const grid: (string | null)[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null))

  cells.forEach((cell) => {
    if (cell.row_index < rows && cell.col_index < cols) {
      grid[cell.row_index][cell.col_index] = cell.content
    }
  })

  return grid
}

