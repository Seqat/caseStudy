import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MIN_LOADING_MS = 400 // prevents flashy quick error
const ERROR_DISPLAY_TIME = 4000 // Show error for 4 seconds minimum

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorAnimation, setErrorAnimation] = useState('') // For animation control

  const { login } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const errorTimeoutRef = useRef(null)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    
    // Only hide error after user starts typing AND minimum display time has passed
    if (showError && errorTimeoutRef.current) {
      // Don't immediately hide - let the timeout handle it
      return
    }
    
    if (showError) {
      setShowError(false)
      setError('')
      setErrorAnimation('')
    }
  }

  const showErrorMessage = (message) => {
    setError(message)
    setShowError(true)
    setErrorAnimation('slideIn')
    
    // Clear any existing timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
    }
    
    // Auto-hide after minimum display time
    errorTimeoutRef.current = setTimeout(() => {
      setErrorAnimation('slideOut')
      setTimeout(() => {
        setShowError(false)
        setError('')
        setErrorAnimation('')
      }, 300) // Wait for slide out animation
    }, ERROR_DISPLAY_TIME)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // start loading and clear any previous error
    setLoading(true)
    setError('')
    setShowError(false)
    setErrorAnimation('')

    // Clear any existing error timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
    }

    const start = Date.now()

    try {
      const result = await login(formData.email, formData.password)

      // ensure a minimum loading time to avoid flicker
      const elapsed = Date.now() - start
      if (elapsed < MIN_LOADING_MS) {
        await new Promise(res => setTimeout(res, MIN_LOADING_MS - elapsed))
      }

      if (result && result.success) {
        // optional: ensure loading is off before navigation
        setLoading(false)
        setShowError(false)
        navigate('/dashboard')
      } else {
        // handle missing message by providing a default
        const errorMsg = (result && result.message) || 'Incorrect email or password.'
        showErrorMessage(errorMsg)
        setLoading(false)
        // focus password input so user can correct it quickly
        passwordRef.current?.focus()
      }
    } catch (err) {
      // network / unexpected errors
      const msg = err?.message || 'Something went wrong. Please try again.'
      // minimum loading time again
      const elapsed = Date.now() - start
      if (elapsed < MIN_LOADING_MS) {
        await new Promise(res => setTimeout(res, MIN_LOADING_MS - elapsed))
      }
      showErrorMessage(msg)
      setLoading(false)
      // focus email so user can retry
      emailRef.current?.focus()
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              data-testid="email-input"
              aria-invalid={showError ? true : undefined}
              className={showError ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              data-testid="password-input"
              aria-invalid={showError ? true : undefined}
              className={showError ? 'error' : ''}
            />
          </div>

          {showError && error && (
            <div
              className={`error-message ${errorAnimation}`}
              data-testid="error-message"
              role="alert"
              aria-live="assertive"
            >
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
            data-testid="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login