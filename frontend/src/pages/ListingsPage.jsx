import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Bed,
  RotateCcw,
  Building,
  LayoutGrid,
  List,
  X,
  Check,
} from 'lucide-react';
import { listingService } from '../services/api';
import ListingCard from '../components/ListingCard';
import ConnectModal from '../components/ConnectModal';
import Toast from '../components/Toast';

const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || 'All');
  const [preferredGender, setPreferredGender] = useState('Any');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [furnishingStatus, setFurnishingStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  // Selected Amenities
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Data States
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modal & Toast
  const [connectTarget, setConnectTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const amenitiesOptions = [
    'High Speed Wifi',
    'AC',
    'Attached Washroom',
    'Modular Kitchen',
    'Power Backup',
    'Washing Machine',
    'Gym',
    'Swimming Pool',
    '24/7 Security',
    'Balcony',
    'Parking',
    'Cook/Maid Available',
  ];

  const quickCities = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        city: city !== 'All' ? city : undefined,
        locality: locality || undefined,
        roomType: roomType !== 'All' ? roomType : undefined,
        preferredGender: preferredGender !== 'Any' ? preferredGender : undefined,
        minRent: minRent || undefined,
        maxRent: maxRent || undefined,
        furnishingStatus: furnishingStatus !== 'All' ? furnishingStatus : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities.join(',') : undefined,
        keyword: keyword || undefined,
        sortBy,
      };

      const res = await listingService.getListings(params);
      setListings(res.data.listings || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [city, roomType, preferredGender, furnishingStatus, sortBy]);

  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setMobileFilterOpen(false);
    fetchListings();
  };

  const handleResetFilters = () => {
    setCity('All');
    setLocality('');
    setRoomType('All');
    setPreferredGender('Any');
    setMinRent('');
    setMaxRent('');
    setFurnishingStatus('All');
    setSelectedAmenities([]);
    setKeyword('');
    setSortBy('newest');
  };

  const activeFilterCount =
    (city !== 'All' ? 1 : 0) +
    (roomType !== 'All' ? 1 : 0) +
    (preferredGender !== 'Any' ? 1 : 0) +
    (furnishingStatus !== 'All' ? 1 : 0) +
    (minRent || maxRent ? 1 : 0) +
    selectedAmenities.length;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">
              <Building size={14} /> Verified Flatshares
            </span>
            <span className="badge badge-emerald">Direct Owner & Flatmate</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Explore Rooms & Shared Flats</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 680 }}>
            Discover verified private bedrooms, shared flats, and studios with zero brokerage across Tamil Nadu.
          </p>

          {/* Quick City Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.25rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
            }}
          >
            {quickCities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`filter-pill ${city === c ? 'active' : ''}`}
              >
                {c === 'All' ? 'All Cities' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Layout with Filters Sidebar & Listing Cards */}
        <div className="listings-layout" style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Filter Sidebar */}
          <aside
            className={`card ${mobileFilterOpen ? 'mobile-filter-drawer' : 'desktop-filter-sidebar'}`}
            style={{
              padding: '1.75rem',
              position: 'sticky',
              top: 'calc(var(--nav-height) + 1.5rem)',
              maxHeight: 'calc(100vh - var(--nav-height) - 3rem)',
              overflowY: 'auto',
              background: 'var(--bg-surface)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <SlidersHorizontal size={18} color="var(--primary)" /> Filters
                {activeFilterCount > 0 && (
                  <span className="badge badge-primary" style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}>
                    {activeFilterCount}
                  </span>
                )}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  style={{
                    background: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <RotateCcw size={13} /> Reset
                </button>
                {mobileFilterOpen && (
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="btn-icon"
                    style={{ width: 32, height: 32 }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleApplyFilters}>
              {/* City Selection */}
              <div className="form-group">
                <label className="form-label">City</label>
                <select className="form-control" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="All">All Tamil Nadu Cities</option>
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

              {/* Room Type */}
              <div className="form-group">
                <label className="form-label">Room Type</label>
                <select className="form-control" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                  <option value="All">Any Room Type</option>
                  <option value="Single Private Room">Single Private Room</option>
                  <option value="Shared Room">Shared Room</option>
                  <option value="Entire Flat">Entire Flat</option>
                  <option value="Studio">Studio Apartment</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div className="form-group">
                <label className="form-label">Preferred Gender</label>
                <select
                  className="form-control"
                  value={preferredGender}
                  onChange={(e) => setPreferredGender(e.target.value)}
                >
                  <option value="Any">Any Gender</option>
                  <option value="Male">Male Preferred</option>
                  <option value="Female">Female Preferred</option>
                </select>
              </div>

              {/* Budget Range */}
              <div className="form-group">
                <label className="form-label">Monthly Rent (₹)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    className="form-control"
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value)}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="form-control"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value)}
                  />
                </div>
              </div>

              {/* Furnishing */}
              <div className="form-group">
                <label className="form-label">Furnishing Status</label>
                <select
                  className="form-control"
                  value={furnishingStatus}
                  onChange={(e) => setFurnishingStatus(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              {/* Amenities checkboxes */}
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                  Must-Have Amenities
                </label>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    maxHeight: 180,
                    overflowY: 'auto',
                    paddingRight: '0.25rem',
                  }}
                >
                  {amenitiesOptions.map((amenity) => (
                    <label
                      key={amenity}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: selectedAmenities.includes(amenity) ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: selectedAmenities.includes(amenity) ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', fontWeight: 700 }}
              >
                Apply Filters
              </button>
            </form>
          </aside>

          {/* Listings Content */}
          <div>
            {/* Top Toolbar (Search, Filter Button for Mobile, Sorting, View Toggle) */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 300px' }}>
                <Search
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', top: 14, left: 14, pointerEvents: 'none' }}
                />
                <input
                  type="text"
                  placeholder="Search locality, building, or keywords..."
                  className="form-control"
                  style={{ paddingLeft: '2.6rem', height: 46 }}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* Mobile Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="btn btn-outline mobile-filter-btn"
                  style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Filter size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="form-control"
                    style={{ padding: '0.5rem 0.85rem', width: 'auto', height: 42, fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="rent_asc">Rent: Low to High</option>
                    <option value="rent_desc">Rent: High to Low</option>
                    <option value="views">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count & Active Tags */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
              }}
            >
              <span>
                Found <strong>{listings.length}</strong> {listings.length === 1 ? 'room' : 'rooms'} available in{' '}
                <strong>{city === 'All' ? 'all cities' : city}</strong>
              </span>

              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  style={{ background: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="grid-listings">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="card skeleton"
                    style={{ height: 380, borderRadius: 'var(--radius-xl)' }}
                  />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid-listings">
                {listings.map((item) => (
                  <ListingCard
                    key={item._id}
                    listing={item}
                    onConnect={(target) => setConnectTarget(target)}
                  />
                ))}
              </div>
            ) : (
              <div
                className="card"
                style={{
                  padding: '4.5rem 2rem',
                  textAlign: 'center',
                  background: 'var(--bg-surface)',
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
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  No matching accommodations found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: 420, margin: '0 auto 1.75rem auto' }}>
                  Try adjusting your budget range, expanding city filters, or searching for other localities.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Filter Drawer styles */}
      <style>{`
        @media (max-width: 900px) {
          .listings-layout {
            grid-template-columns: 1fr !important;
          }
          .desktop-filter-sidebar {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .mobile-filter-drawer {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            max-height: 100vh !important;
            z-index: 1001 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* Connect Modal */}
      {connectTarget && (
        <ConnectModal
          isOpen={!!connectTarget}
          onClose={() => setConnectTarget(null)}
          target={connectTarget}
          onSuccess={(msg) => setToastMessage(msg)}
        />
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default ListingsPage;
