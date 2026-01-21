/**
 * Utility functions for Colour Mode
 * Handles gradient-based opacity rendering based on gradient_value
 */

export type ElementType = 'outcome' | 'value' | 'resource'

/**
 * Get gradient color with opacity based on gradient_value
 * @param elementType - Type of element (outcome, value, resource)
 * @param gradientValue - Value from 0-100 (0 = lightest, 100 = full color)
 * @returns CSS style object with backgroundColor and opacity
 */
export function getGradientColor(
  elementType: ElementType,
  gradientValue: number
): { backgroundColor: string; opacity: number } {
  // Ensure gradientValue is within bounds
  const opacity = Math.min(Math.max(gradientValue / 100, 0), 1)
  
  // Base colors matching Jigsaw 1 color scheme
  const baseColors: Record<ElementType, string> = {
    'outcome': 'rgb(37, 99, 235)',     // blue-600
    'value': 'rgb(16, 185, 129)',      // emerald-500
    'resource': 'rgb(245, 158, 11)',   // amber-500
  }
  
  return {
    backgroundColor: baseColors[elementType],
    opacity
  }
}

/**
 * Get color class for element type (for non-colour mode)
 * @param elementType - Type of element
 * @returns Tailwind CSS class string
 */
export function getColorClass(elementType: ElementType): string {
  const colorMap: Record<ElementType, string> = {
    'outcome': 'bg-blue-100 dark:bg-blue-900/30',
    'value': 'bg-green-100 dark:bg-green-900/30',
    'resource': 'bg-amber-100 dark:bg-amber-900/30',
  }
  return colorMap[elementType]
}

/**
 * Get text color class based on opacity
 * @param opacity - Opacity value (0-1)
 * @returns Tailwind CSS class for text color
 */
export function getTextColorForOpacity(opacity: number): string {
  // Use white text for darker backgrounds (higher opacity)
  return opacity > 0.5 ? 'text-white' : 'text-foreground'
}

/**
 * Convert gradient value to display percentage
 * @param gradientValue - Value from 0-100
 * @returns Formatted percentage string
 */
export function formatGradientValue(gradientValue: number): string {
  return `${Math.round(gradientValue)}%`
}

