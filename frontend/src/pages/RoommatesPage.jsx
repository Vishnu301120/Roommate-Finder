import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Filter,
  X,
  MapPin,
  Utensils,
  Moon,
  Dog,
  Cigarette,
} from 'lucide-react';
import { userService } from '../services/api';
import RoommateCard from '../components/RoommateCard';
import ConnectModal from '../components/ConnectModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const RoommatesPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Filters
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [gender, setGender] = useState('All');
  const [occupation, setOccupation] = useState('All');
  const [foodDiet, setFoodDiet] = useState('All');
  const [sleepSchedule, setSleepSchedule] = useState('All');
  const [smoking, setSmoking] = useState('All');
  const [pets, setPets] = useState('All');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  // Data
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modal
  const [connectTarget, setConnectTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const quickCities = ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'];

  const fetchRoommates = async () => {
    setLoading(true);
    try {
      const params = {
        city: city !== 'All' ? city : undefined,
        gender: gender !== 'All' ? gender : undefined,
        occupation: occupation !== 'All' ? occupation : undefined,
        foodDiet: foodDiet !== 'All' ? foodDiet : undefined,
        sleepSchedule: sleepSchedule !== 'All' ? sleepSchedule : undefined,
        smoking: smoking !== 'All' ? smoking : undefined,
        pets: pets !== 'All' ? pets : undefined,
        minBudget: minBudget || undefined,
        maxBudget: maxBudget || undefined,
        keyword: keyword || undefined,
      };

      const res = await userService.getRoommates(params);
      setRoommates(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching roommates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoommates();
  }, [city, gender, occupation, foodDiet, sleepSchedule, smoking, pets]);

  const handleResetFilters = () => {
    setCity('All');
    setGender('All');
    setOccupation('All');
    setFoodDiet('All');
    setSleepSchedule('All');
    setSmoking('All');
    setPets('All');
    setMinBudget('');
    setMaxBudget('');
    setKeyword('');
  };

  const activeFilterCount =
    (city !== 'All' ? 1 : 0) +
    (gender !== 'All' ? 1 : 0) +
    (occupation !== 'All' ? 1 : 0) +
    (foodDiet !== 'All' ? 1 : 0) +
    (sleepSchedule !== 'All' ? 1 : 0) +
    (smoking !== 'All' ? 1 : 0) +
    (pets !== 'All' ? 1 : 0) +
    (minBudget || maxBudget ? 1 : 0);

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-purple">
              <Sparkles size={14} /> Lifestyle Compatibility Engine
            </span>
            <span className="badge badge-emerald">Verified Profiles</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Find Compatible Roommates</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 680 }}>
            Connect with verified flatmates across Tamil Nadu who match your budget range, daily routines, dietary preferences, and habits.
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

        {/* Content Layout */}
        <div className="roommates-layout" style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Filters Sidebar */}
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
                <SlidersHorizontal size={18} color="var(--primary)" /> Lifestyle Filters
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMobileFilterOpen(false);
                fetchRoommates();
              }}
            >
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

              {/* Gender Preference */}
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="All">Any Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Diet & Kitchen Habits */}
              <div className="form-group">
                <label className="form-label">Food & Diet</label>
                <select className="form-control" value={foodDiet} onChange={(e) => setFoodDiet(e.target.value)}>
                  <option value="All">Any Diet</option>
                  <option value="Vegetarian">Strict Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              {/* Sleep Schedule */}
              <div className="form-group">
                <label className="form-label">Sleep Schedule</label>
                <select
                  className="form-control"
                  value={sleepSchedule}
                  onChange={(e) => setSleepSchedule(e.target.value)}
                >
                  <option value="All">Flexible / Any</option>
                  <option value="Early Bird">Early Bird (Sleeps before 11 PM)</option>
                  <option value="Night Owl">Night Owl (Active late nights)</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              {/* Smoking Habits */}
              <div className="form-group">
                <label className="form-label">Smoking Policy</label>
                <select className="form-control" value={smoking} onChange={(e) => setSmoking(e.target.value)}>
                  <option value="All">Any</option>
                  <option value="No">Non-Smoker (Strict)</option>
                  <option value="Outside Only">Outside / Balcony Only</option>
                  <option value="Yes">Smoker Friendly</option>
                </select>
              </div>

              {/* Pet Friendliness */}
              <div className="form-group">
                <label className="form-label">Pet Preference</label>
                <select className="form-control" value={pets} onChange={(e) => setPets(e.target.value)}>
                  <option value="All">Any</option>
                  <option value="Pet Friendly">Pet Friendly (Loves Pets)</option>
                  <option value="Has Pets">Has Pets Currently</option>
                  <option value="No Pets">Strictly No Pets</option>
                </select>
              </div>

              {/* Monthly Budget Range */}
              <div className="form-group">
                <label className="form-label">Budget Range (₹)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    className="form-control"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="form-control"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', fontWeight: 700 }}
              >
                Apply Lifestyle Filters
              </button>
            </form>
          </aside>

          {/* Roommates Grid Content */}
          <div>
            {/* Top Search Toolbar */}
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
                  placeholder="Search by name, profession, locality, or habits..."
                  className="form-control"
                  style={{ paddingLeft: '2.6rem', height: 46 }}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchRoommates()}
                />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="btn btn-outline mobile-filter-btn"
                style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }}
              >
                <Filter size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>

            {/* Total Count */}
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
                Found <strong>{roommates.length}</strong> matching flatmate seekers in{' '}
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

            {/* Roommate Cards Grid */}
            {loading ? (
              <div className="grid-roommates">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="card skeleton"
                    style={{ height: 380, borderRadius: 'var(--radius-xl)' }}
                  />
                ))}
              </div>
            ) : roommates.length > 0 ? (
              <div className="grid-roommates">
                {roommates.map((rm) => (
                  <RoommateCard
                    key={rm._id}
                    roommate={rm}
                    onConnect={(target) => setConnectTarget(target)}
                    currentUserId={user?._id}
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
                  <Users size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  No roommate seekers found
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: 420, margin: '0 auto 1.75rem auto' }}>
                  Try relaxing your dietary or sleep schedule filters, or search for other locations.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary">
                  Reset Lifestyle Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Filter Drawer styles */}
      <style>{`
        @media (max-width: 900px) {
          .roommates-layout {
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

export default RoommatesPage;
