import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, listingService } from '../services/api';
import {
  User,
  Sparkles,
  Building,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Save,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Camera,
  Utensils,
  Moon,
  Cigarette,
  Wine,
  Dog,
  PartyPopper,
  PlusCircle,
} from 'lucide-react';
import Toast from '../components/Toast';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || 24,
    gender: user?.gender || 'Not Specified',
    occupation: user?.occupation || 'Working Professional',
    bio: user?.bio || '',
    city: user?.city || 'Chennai',
    locality: user?.locality || '',
    budgetMin: user?.budgetMin || 8000,
    budgetMax: user?.budgetMax || 20000,
    lookingFor: user?.lookingFor || 'both',
    avatar: user?.avatar || '',
    lifestyle: {
      foodDiet: user?.lifestyle?.foodDiet || 'Non-Vegetarian',
      sleepSchedule: user?.lifestyle?.sleepSchedule || 'Flexible',
      smoking: user?.lifestyle?.smoking || 'No',
      drinking: user?.lifestyle?.drinking || 'Socially',
      pets: user?.lifestyle?.pets || 'Pet Friendly',
      partyHabits: user?.lifestyle?.partyHabits || 'Weekends Only',
    },
  });

  const [myListings, setMyListings] = useState([]);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'listings'
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await listingService.getMyListings();
        setMyListings(res.data || []);
      } catch (err) {
        console.error('Failed to fetch my listings:', err);
      }
    };
    if (user) fetchMyListings();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.updateProfile(formData);
      updateUser(res.data);
      setToastMessage('Profile and lifestyle preferences updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to remove this accommodation listing?')) return;
    try {
      await listingService.deleteListing(listingId);
      setMyListings(myListings.filter((l) => l._id !== listingId));
      setToastMessage('Listing deleted successfully');
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    try {
      setUploadingAvatar(true);
      setError('');
      const res = await authService.uploadAvatar(uploadData);
      if (res.data?.avatar) {
        setFormData((prev) => ({ ...prev, avatar: res.data.avatar }));
        setToastMessage('Profile avatar uploaded successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload avatar photo');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const avatarDisplay =
    formData.avatar?.startsWith('/uploads')
      ? `http://localhost:5000${formData.avatar}`
      : formData.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 940 }}>
        {/* Profile Banner */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid rgba(79, 70, 229, 0.15)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ position: 'relative' }}>
            <img
              src={avatarDisplay}
              alt={formData.name}
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--border-light)',
                boxShadow: 'var(--shadow-md)',
              }}
            />
            {user?.isVerified && (
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-surface)',
                }}
                title="Verified Roomee Member"
              >
                <ShieldCheck size={14} />
              </span>
            )}
            <label
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: uploadingAvatar ? 'not-allowed' : 'pointer',
                border: '2px solid var(--bg-surface)',
                boxShadow: 'var(--shadow-sm)',
              }}
              title="Upload new avatar"
            >
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>{formData.name}</h1>
              {user?.isVerified && (
                <span className="badge badge-emerald" style={{ fontWeight: 700 }}>
                  <ShieldCheck size={14} /> Verified Member
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>{user?.email}</span> • <span>{formData.occupation}</span> • <span>{formData.city}</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            background: 'var(--bg-main)',
            padding: '6px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            width: 'fit-content',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.925rem',
              background: activeTab === 'profile' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'profile' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <User size={16} /> Profile & Lifestyle Preferences
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.925rem',
              background: activeTab === 'listings' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'listings' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'listings' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Building size={16} /> My Posted Accommodations ({myListings.length})
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--accent-rose-light)',
              color: 'var(--accent-rose)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontWeight: 600,
              border: '1px solid #fecdd3',
            }}
          >
            {error}
          </div>
        )}

        {activeTab === 'profile' ? (
          <form
            onSubmit={handleSubmit}
            className="card"
            style={{ padding: '2.5rem', borderRadius: 'var(--radius-2xl)', background: 'var(--bg-surface)' }}
          >
            {/* 1. Personal Information */}
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>1. Personal Information</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  min={18}
                  max={99}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Occupation</label>
                <select
                  className="form-control"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                >
                  <option value="Working Professional">Working Professional</option>
                  <option value="Student">Student</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Current City</label>
                <select
                  className="form-control"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Tiruchirappalli">Tiruchirappalli (Trichy)</option>
                  <option value="Salem">Salem</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Erode">Erode</option>
                  <option value="Vellore">Vellore</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Neighborhood / Locality</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. OMR, Velachery, Peelamedu, KK Nagar"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Avatar Photo</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <label
                  className="btn btn-primary btn-sm"
                  style={{
                    cursor: uploadingAvatar ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 700,
                  }}
                >
                  <Camera size={15} /> {uploadingAvatar ? 'Uploading...' : 'Upload Photo from Device'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    style={{ display: 'none' }}
                  />
                </label>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Or enter image URL:</span>
              </div>
              <input
                type="text"
                className="form-control"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Personal Bio / Vibe</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Describe your lifestyle, working hours, weekends, and what kind of flatmate you get along with..."
                style={{ lineHeight: 1.6 }}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2rem 0' }} />

            {/* 2. Roommate Search & Budget */}
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              2. Roommate & Budget Alignment
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Looking For</label>
                <select
                  className="form-control"
                  value={formData.lookingFor}
                  onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                >
                  <option value="both">Both (Room or Roommate)</option>
                  <option value="roommate">Roommate (I have an extra room)</option>
                  <option value="room">Room (Looking for an open space)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Min Monthly Rent (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Monthly Rent (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2rem 0' }} />

            {/* 3. Lifestyle Compatibility Matrix */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Sparkles size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>3. Lifestyle Compatibility Matrix</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              These attributes power our real-time compatibility score algorithm shown on your profile.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Food Diet</label>
                <select
                  className="form-control"
                  value={formData.lifestyle.foodDiet}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lifestyle: { ...formData.lifestyle, foodDiet: e.target.value },
                    })
                  }
                >
                  <option value="Vegetarian">Strict Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sleep Schedule</label>
                <select
                  className="form-control"
                  value={formData.lifestyle.sleepSchedule}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lifestyle: { ...formData.lifestyle, sleepSchedule: e.target.value },
                    })
                  }
                >
                  <option value="Early Bird">Early Bird (Early Sleeper)</option>
                  <option value="Night Owl">Night Owl (Late Sleeper)</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Smoking Habit</label>
                <select
                  className="form-control"
                  value={formData.lifestyle.smoking}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lifestyle: { ...formData.lifestyle, smoking: e.target.value },
                    })
                  }
                >
                  <option value="No">No (Non-Smoker)</option>
                  <option value="Occasionally">Occasionally / Outside</option>
                  <option value="Regularly">Regularly</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Drinking Habit</label>
                <select
                  className="form-control"
                  value={formData.lifestyle.drinking}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lifestyle: { ...formData.lifestyle, drinking: e.target.value },
                    })
                  }
                >
                  <option value="No">No (Teetotaler)</option>
                  <option value="Socially">Socially on Weekends</option>
                  <option value="Regularly">Regularly</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pets Preference</label>
                <select
                  className="form-control"
                  value={formData.lifestyle.pets}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lifestyle: { ...formData.lifestyle, pets: e.target.value },
                    })
                  }
                >
                  <option value="Pet Friendly">Pet Friendly (Loves Pets)</option>
                  <option value="Dog Lover">Dog Lover</option>
                  <option value="Cat Lover">Cat Lover</option>
                  <option value="No Pets">Strictly No Pets</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Party Habits</label>
                <select
                  className="form-control"
                  value={formData.lifestyle.partyHabits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lifestyle: { ...formData.lifestyle, partyHabits: e.target.value },
                    })
                  }
                >
                  <option value="Quiet & Calm">Quiet & Calm</option>
                  <option value="Weekends Only">Weekends Only</option>
                  <option value="Social & Fun">Social & Fun</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ fontWeight: 800, padding: '0.85rem 2rem' }}
              >
                <Save size={18} strokeWidth={2.4} /> {loading ? 'Saving Preferences...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        ) : (
          /* Published Listings Tab */
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Your Published Spaces</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Manage and monitor inquiry requests for your accommodations
                </p>
              </div>
              <Link to="/post-listing" className="btn btn-primary" style={{ fontWeight: 700 }}>
                <PlusCircle size={17} /> Post New Room
              </Link>
            </div>

            {myListings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {myListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.25rem',
                      borderRadius: 'var(--radius-xl)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <img
                        src={
                          listing.photos?.[0] ||
                          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&q=80'
                        }
                        alt={listing.title}
                        style={{
                          width: 110,
                          height: 80,
                          borderRadius: 'var(--radius-lg)',
                          objectFit: 'cover',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                          {listing.title}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {listing.roomType} • {listing.locality}, {listing.city} • ₹
                          {listing.rent?.toLocaleString('en-IN')}/mo
                        </p>
                        <span className="badge badge-emerald" style={{ marginTop: '0.4rem', fontWeight: 700 }}>
                          Active & Listed
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                      <Link to={`/listings/${listing._id}`} className="btn btn-outline btn-sm" style={{ fontWeight: 700 }}>
                        View Listing
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="btn btn-danger btn-sm"
                        aria-label="Delete listing"
                        title="Delete listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="card"
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-2xl)',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'var(--bg-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Building size={32} />
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                  You haven't posted any accommodations yet
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: '0 auto 1.75rem auto', maxWidth: 400 }}>
                  Have a spare bedroom or looking for a replacement flatmate? Post your space for free.
                </p>
                <Link to="/post-listing" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  List a Space Now
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default ProfilePage;
