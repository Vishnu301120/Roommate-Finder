import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, Check, Home, Image as ImageIcon, MapPin, IndianRupee, Sparkles, X } from 'lucide-react';
import { listingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const PostListingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    roomType: 'Single Private Room',
    rent: '',
    deposit: '',
    city: user?.city || 'Chennai',
    locality: user?.locality || '',
    address: '',
    furnishingStatus: 'Fully Furnished',
    amenities: ['High Speed Wifi', 'Modular Kitchen', 'Washing Machine'],
    preferredGender: 'Any',
    preferredOccupation: 'Any',
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
    ],
    rulesText: 'Quiet hours after 11 PM\nMaintain cleanliness in common spaces\nVisitors welcome with prior notice',
    availableFrom: new Date().toISOString().split('T')[0],
  });

  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const amenitiesList = [
    'High Speed Wifi',
    'AC',
    'Attached Washroom',
    'Modular Kitchen',
    'Power Backup',
    'Washing Machine',
    'Refrigerator',
    'Gym',
    'Swimming Pool',
    '24/7 Security',
    'Balcony',
    'Parking',
    'Cook/Maid Available',
  ];

  if (!isAuthenticated) {
    return (
      <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div
          className="card"
          style={{ maxWidth: 460, margin: '0 auto', padding: '3rem', borderRadius: 'var(--radius-2xl)' }}
        >
          <Home size={44} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Sign in to List a Space</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.75rem 0', lineHeight: 1.6 }}>
            You need an active account to post accommodations, verify your profile, and receive roommate match requests.
          </p>
          <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ fontWeight: 700 }}>
            Log In Now
          </button>
        </div>
      </div>
    );
  }

  const handleAmenityToggle = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((a) => a !== amenity),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
  };

  const handleAddPhoto = () => {
    if (customPhotoUrl.trim()) {
      setFormData({
        ...formData,
        photos: [...formData.photos, customPhotoUrl.trim()],
      });
      setCustomPhotoUrl('');
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const data = new FormData();
    files.forEach((file) => {
      data.append('photos', file);
    });

    try {
      setUploading(true);
      setError('');
      const res = await listingService.uploadPhotos(data);
      if (res.data && res.data.urls) {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...res.data.urls],
        }));
        setToastMessage(`${files.length} photo(s) uploaded successfully!`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photos');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (idx) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        rent: Number(formData.rent),
        deposit: Number(formData.deposit) || 0,
        rules: formData.rulesText.split('\n').filter((r) => r.trim().length > 0),
      };

      const res = await listingService.createListing(payload);
      setToastMessage('Accommodation published successfully!');
      setTimeout(() => {
        navigate(`/listings/${res.data._id}`);
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish accommodation listing');
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">
              <Sparkles size={14} /> Zero Brokerage Listing
            </span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>List Your Accommodation</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 580, margin: '0 auto' }}>
            Find compatible, verified flatmates for your spare room or shared apartment in minutes.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.85rem 1.15rem',
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

        <form
          onSubmit={handleSubmit}
          className="card"
          style={{ padding: '2.5rem', borderRadius: 'var(--radius-2xl)', background: 'var(--bg-surface)' }}
        >
          {/* Section 1: Basic Information */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={22} color="var(--primary)" /> 1. Basic Details
          </h3>

          <div className="form-group">
            <label className="form-label">Listing Headline / Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sunny Private Room in 3BHK Gated Society, Indiranagar"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select
                className="form-control"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              >
                <option value="Apartment">Apartment / Flat</option>
                <option value="Gated Community">Gated Community Society</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villa</option>
                <option value="PG/Hostel">PG / Hostel</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Room Type *</label>
              <select
                className="form-control"
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                required
              >
                <option value="Single Private Room">Single Private Room</option>
                <option value="Shared Room">Shared Room (2-Sharing / 3-Sharing)</option>
                <option value="Entire Flat">Entire Flat (1BHK / 2BHK / 3BHK)</option>
                <option value="Studio">Studio Apartment</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Describe the flat, current flatmates, neighborhood vibe, connectivity, and who would be an ideal fit..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              style={{ lineHeight: 1.6 }}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2rem 0' }} />

          {/* Section 2: Pricing & Availability */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={22} color="var(--primary)" /> 2. Pricing & Move-In Date
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Monthly Rent (₹) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="15000"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security Deposit (₹)</label>
              <input
                type="number"
                className="form-control"
                placeholder="30000"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Move-In Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.availableFrom}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2rem 0' }} />

          {/* Section 3: Location */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={22} color="var(--primary)" /> 3. Property Location
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">City *</label>
              <select
                className="form-control"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
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
              <label className="form-label">Locality / Sector *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. OMR, Velachery, Peelamedu, KK Nagar"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Building / Society Name & Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Prestige Acropolis, 20th Main Rd"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2rem 0' }} />

          {/* Section 4: Furnishing & Amenities */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>4. Amenities & Furnishing</h3>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Furnishing Status</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Fully Furnished', 'Semi-Furnished', 'Unfurnished'].map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setFormData({ ...formData, furnishingStatus: status })}
                  className={`btn ${formData.furnishingStatus === status ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontWeight: 700, padding: '0.5rem 1.15rem' }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '0.75rem' }}>
              Select Included Amenities
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '0.65rem',
              }}
            >
              {amenitiesList.map((item) => {
                const isChecked = formData.amenities.includes(item);
                return (
                  <div
                    key={item}
                    onClick={() => handleAmenityToggle(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.95rem',
                      borderRadius: 'var(--radius-md)',
                      background: isChecked ? 'var(--primary-light)' : 'var(--bg-main)',
                      border: isChecked ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: isChecked ? 700 : 500,
                      color: isChecked ? 'var(--primary)' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                    />
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2rem 0' }} />

          {/* Section 5: Preferences & Rules */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>5. Roommate Preferences & Rules</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Preferred Gender</label>
              <select
                className="form-control"
                value={formData.preferredGender}
                onChange={(e) => setFormData({ ...formData, preferredGender: e.target.value })}
              >
                <option value="Any">Any Gender</option>
                <option value="Male">Male Preferred</option>
                <option value="Female">Female Preferred</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Occupation</label>
              <select
                className="form-control"
                value={formData.preferredOccupation}
                onChange={(e) => setFormData({ ...formData, preferredOccupation: e.target.value })}
              >
                <option value="Any">Any Profession</option>
                <option value="Working Professional">Working Professional</option>
                <option value="Student">Student</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">House Guidelines & Rules (1 rule per line)</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.rulesText}
              onChange={(e) => setFormData({ ...formData, rulesText: e.target.value })}
              placeholder="e.g. Quiet hours after 11 PM&#10;Maintain common room cleanliness"
              style={{ lineHeight: 1.6 }}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2rem 0' }} />

          {/* Section 6: Photos */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={22} color="var(--primary)" /> 6. Accommodation Photos
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <label
                className="btn btn-primary"
                style={{
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  opacity: uploading ? 0.7 : 1,
                }}
              >
                <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Photos from Computer'}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Or add image URL:</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Paste direct high-res image URL (e.g. Unsplash URL)..."
                className="form-control"
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="btn btn-outline"
                style={{ whiteSpace: 'nowrap', fontWeight: 700 }}
              >
                Add URL
              </button>
            </div>
          </div>

          {/* Photo Previews */}
          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {formData.photos.map((url, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  width: 140,
                  height: 100,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1.5px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <img
                  src={url.startsWith('/uploads') ? `http://localhost:5000${url}` : url}
                  alt={`Listing ${i}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/listings')}
              className="btn btn-outline"
              disabled={loading}
              style={{ fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ fontWeight: 800, padding: '0.85rem 2.25rem' }}
            >
              {loading ? (
                'Publishing Room...'
              ) : (
                <>
                  <PlusCircle size={18} strokeWidth={2.4} /> Publish Accommodation
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default PostListingPage;
