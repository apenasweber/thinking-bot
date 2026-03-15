import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useToast, toast, clearToasts } from './use-toast'
import React from 'react'

// Test component to use the hook
function TestComponent() {
  const { toasts, dismiss } = useToast()

  return (
    <div>
      <button onClick={() => toast({ title: 'Test Toast', description: 'Test message' })}>
        Show Toast
      </button>
      <button onClick={() => dismiss()}>
        Dismiss All
      </button>
      {toasts.map(({ id, title, description }) => (
        <div key={id} data-testid={`toast-${id}`}>
          <h3>{title}</h3>
          <p>{description}</p>
          <button onClick={() => dismiss(id)}>Close</button>
        </div>
      ))}
    </div>
  )
}

describe('Simplified Toast Architecture', () => {
  beforeEach(() => {
    clearToasts()
  })

  // TEST 1: Direct toast() calls should work without wrapper
  test('toast() function creates toast that appears in useToast hook', () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Show Toast'))

    expect(screen.getByText('Test Toast')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  // TEST 2: Multiple toasts should be managed correctly
  test('multiple toast calls create multiple toasts', () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Show Toast'))
    fireEvent.click(screen.getByText('Show Toast'))

    const toasts = screen.getAllByText('Test Toast')
    expect(toasts).toHaveLength(1) // TOAST_LIMIT = 1, so only latest
  })

  // TEST 3: Dismiss functionality should work
  test('dismiss removes specific toast', async () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Show Toast'))
    expect(screen.getByText('Test Toast')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Close'))

    await waitFor(() => {
      expect(screen.queryByText('Test Toast')).not.toBeInTheDocument()
    }, { timeout: 200 })
  })

  // TEST 4: No toaster.tsx wrapper needed
  test('useToast provides everything needed for rendering', () => {
    function MinimalToastComponent() {
      const { toasts } = useToast()
      return (
        <div>
          {toasts.length === 0 && <div data-testid="no-toasts">No toasts</div>}
          {toasts.map(toast => (
            <div key={toast.id} data-testid="toast-item">
              {toast.title}
            </div>
          ))}
          <button onClick={() => toast({ title: 'Direct call' })}>
            Add Toast
          </button>
        </div>
      )
    }

    const { rerender } = render(<MinimalToastComponent />)
    expect(screen.getByTestId('no-toasts')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Add Toast'))
    rerender(<MinimalToastComponent />)
    expect(screen.getByText('Direct call')).toBeInTheDocument()
  })

  // TEST 5: Current API should still work (backward compatibility)
  test('existing toast calls still work after refactor', () => {
    const result = toast({
      title: 'Legacy Toast',
      description: 'Should still work'
    })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('dismiss')
    expect(result).toHaveProperty('update')
  })
})