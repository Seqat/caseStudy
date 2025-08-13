import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import Footer from './Footer'
import Navbar from './Navbar'

const Dashboard = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { logout, token } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError('')
      try {
        const profileData = await authAPI.getProfile(token)
        if (profileData) {
          setProfile(profileData)
        } else {
          setError('Failed to fetch profile')
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchProfile()
    }
  }, [token])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
    }
  }

  if (loading || !profile) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <main>
        <div className="dashboard-container">
          <div className="dashboard-card">
            <div className="dashboard-header">
              <h1>Welcome to Your Dashboard</h1>
            </div>

            {error && (
              <div className="error-message">{error}</div>
            )}

            {profile && (
              <div className="profile-info" data-testid="profile-info">
                <h3>Profile Information</h3>
                <div className="profile-details">
                  <div className="profile-item">
                    <label>Email:</label>
                    <span>{profile.email}</span>
                  </div>
                  <div className="profile-item">
                    <label>Member since:</label>
                    <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                  {profile.lastLoginAt && (
                    <div className="profile-item">
                      <label>Last login:</label>
                      <span>{new Date(profile.lastLoginAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="dashboard-content">
              <h3>Protected Content</h3>
              <p>🎉 Congratulations! You have successfully logged in and can access this protected area.</p>
              <p>This page is only accessible to authenticated users with valid JWT tokens.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
