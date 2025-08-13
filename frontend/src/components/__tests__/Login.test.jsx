import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Login from '../login.jsx'
import { AuthProvider } from '../../context/AuthContext'

// Mock the auth API
vi.mock('../../services/api', () => ({
  authAPI: {
    login: vi.fn(),
    getProfile: vi.fn(),
  }
}))

const MockAuthProvider = ({ children, mockLogin }) => {
  const mockContext = {
    user: null,
    token: null,
    loading: false,
    isAuthenticated: false,
    login: mockLogin || vi.fn(),
    register: vi.fn(),
    logout: vi.fn()
  }

  return (
    <AuthProvider value={mockContext}>
      {children}
    </AuthProvider>
  )
}

const renderLogin = (mockLogin) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider mockLogin={mockLogin}>
        <Login />
      </MockAuthProvider>
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders login form', () => {
    renderLogin()
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
    expect(screen.getByTestId('login-button')).toBeInTheDocument()
  })

  test('displays error message on failed login', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ 
      success: false, 
      message: 'Invalid credentials' 
    })
    
    renderLogin(mockLogin)
    
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrongpassword' }
    })
    
    fireEvent.click(screen.getByTestId('login-button'))
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials')
    })
  })

  test('submits form with correct data', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true })
    
    renderLogin(mockLogin)
    
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' }
    })
    
    fireEvent.click(screen.getByTestId('login-button'))
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })
})