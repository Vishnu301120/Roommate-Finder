import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Share2,
  AlertTriangle,
  Star,
  UserPlus,
  Home,
  Check,
  Flag,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { listingService, reviewService } from '../services/api';
import ConnectModal from '../components/ConnectModal';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const ListingDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], count: 0, averageRating: 0 });
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [connectOpen, setConnectOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchListingData = async () => {
    try {
      const [listingRes, reviewRes] = await Promise.all([
        listingService.getListingById(id),
        reviewService.getListingReviews(id),
      ]);
      setListing(listingRes.data);
      setReviewsData(reviewRes.data);
    } catch (err) {
      console.error('Error fetching listing details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingData();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div className="card skeleton" style={{ height: 400, maxWidth: 800, margin: '0 auto', borderRadius: 'var(--radius-2xl)' }} />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <h2>Accommodation not found</h2>
        <Link to="/listings" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Listings
        </Link>
      </div>
    );
  }

  const photos =
    listing.photos && listing.photos.length > 0
      ? listing.photos.map((p) => (p.startsWith('/uploads') ? `http://localhost:5000${p}` : p))
      : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'];

  const hostAvatar =
    listing.user?.avatar?.startsWith('/uploads')
      ? `http://localhost:5000${listing.user.avatar}`
      : listing.user?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
            fontWeight: 500,
          }}
        >
          <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>Home</Link> /{' '}
          <Link to="/listings" style={{ color: 'var(--primary)', fontWeight: 600 }}>Listings</Link> /{' '}
          <span>{listing.city}</span> /{' '}
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{listing.locality}</span>
        </div>

        {/* Title & Basic Specs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{listing.roomType}</span>
              <span className="badge badge-emerald">{listing.furnishingStatus}</span>
              <span className="badge badge-purple">{listing.preferredGender} Preferred</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', marginBottom: '0.45rem', fontWeight: 800 }}>
              {listing.title}
            </h1>
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-secondary)',
                fontSize: '0.975rem',
                fontWeight: 500,
              }}
            >
              <MapPin size={17} color="var(--primary)" /> {listing.locality}, {listing.city}{' '}
              {listing.address ? `• ${listing.address}` : ''}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setToastMessage('Link copied to clipboard!');
              }}
              className="btn btn-outline"
              title="Share listing link"
              style={{ padding: '0.55rem 1rem', fontSize: '0.875rem' }}
            >
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="btn btn-ghost"
              style={{ color: 'var(--accent-rose)', padding: '0.55rem 0.85rem', fontSize: '0.875rem' }}
            >
              <Flag size={16} /> Report
            </button>
          </div>
        </div>

        {/* Photo Gallery Viewer */}
        <div style={{ marginBottom: '2.5rem' }}>
          {/* Main Selected Photo with Left/Right Controls */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 480,
              borderRadius: 'var(--radius-2xl)',
              overflow: 'hidden',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: '#0f172a',
            }}
          >
            <img
              src={photos[selectedPhotoIndex] || photos[0]}
              alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="btn-icon"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 16,
                    transform: 'translateY(-50%)',
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    borderRadius: '50%',
                  }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={nextPhoto}
                  className="btn-icon"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: 16,
                    transform: 'translateY(-50%)',
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    borderRadius: '50%',
                  }}
                  aria-label="Next photo"
                >
                  <ChevronRight size={22} />
                </button>

                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedPhotoIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails row */}
          {photos.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {photos.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  style={{
                    width: 96,
                    height: 68,
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: selectedPhotoIndex === idx ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                    opacity: selectedPhotoIndex === idx ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                    boxShadow: selectedPhotoIndex === idx ? 'var(--shadow-sm)' : 'none',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid: Left Details vs Right Sticky Booking Card */}
        <div className="listing-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Left Column */}
          <div>
            {/* Rent & Deposit Overview Bar */}
            <div
              className="card"
              style={{
                padding: '1.75rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1.25rem',
                alignItems: 'center',
                marginBottom: '2rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                  MONTHLY RENT
                </span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                  ₹{listing.rent?.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>per month</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                  SECURITY DEPOSIT
                </span>
                <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{listing.deposit?.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>fully refundable</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                  AVAILABLE FROM
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {new Date(listing.availableFrom).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'block', fontWeight: 600 }}>Ready to move</span>
              </div>
            </div>

            {/* Description */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.85rem' }}>About the Accommodation</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-line' }}>
                {listing.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>Amenities & Facilities</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                  gap: '1rem',
                }}
              >
                {listing.amenities?.map((amenity, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      fontSize: '0.925rem',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-main)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 size={18} color="var(--accent-emerald)" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            {listing.rules && listing.rules.length > 0 && (
              <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem' }}>House Guidelines & Rules</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {listing.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                        fontSize: '0.925rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ color: 'var(--primary)', fontWeight: 800 }}>•</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={20} color="#f59e0b" fill="#f59e0b" />
                    Resident Reviews ({reviewsData.count})
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Overall rating: {reviewsData.averageRating} / 5.0
                  </span>
                </div>
                {user && (
                  <button
                    onClick={() => setReviewOpen(true)}
                    className="btn btn-outline btn-sm"
                    style={{ fontWeight: 700 }}
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {reviewsData.reviews?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviewsData.reviews.map((rev) => (
                    <div
                      key={rev._id}
                      style={{
                        padding: '1.15rem',
                        background: 'var(--bg-main)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img
                            src={rev.reviewer?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt={rev.reviewer?.name}
                            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>
                              {rev.reviewer?.name || 'Verified User'}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={15} color="#f59e0b" fill="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No reviews yet for this space. Be the first to share your experience!
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Host Card & Inquiry Box */}
          <aside className="sticky-sidebar" style={{ position: 'sticky', top: 'calc(var(--nav-height) + 1.5rem)' }}>
            <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', width: 84, height: 84, margin: '0 auto 0.85rem auto' }}>
                  <img
                    src={hostAvatar}
                    alt={listing.user?.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--border-light)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  {listing.user?.isVerified && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: 'var(--primary)',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: 3,
                        display: 'flex',
                        border: '2px solid var(--bg-surface)',
                      }}
                      title="Verified Host"
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{listing.user?.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                  {listing.user?.occupation || 'Resident Host'} • {listing.user?.age || 24} yrs
                </p>
                {listing.user?.isVerified && (
                  <span className="badge badge-emerald" style={{ fontWeight: 700 }}>
                    <ShieldCheck size={14} /> Verified Roomee Host
                  </span>
                )}
              </div>

              {listing.user?.bio && (
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    background: 'var(--bg-main)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    lineHeight: 1.55,
                    borderLeft: '3px solid var(--primary)',
                  }}
                >
                  "{listing.user.bio}"
                </p>
              )}

              {/* Host Lifestyle Preview */}
              {listing.user?.lifestyle && (
                <div style={{ marginBottom: '1.75rem', fontSize: '0.825rem' }}>
                  <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Host Living Style:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <span className="badge badge-gray">{listing.user.lifestyle.foodDiet}</span>
                    <span className="badge badge-gray">{listing.user.lifestyle.sleepSchedule}</span>
                    <span className="badge badge-gray">Smoke: {listing.user.lifestyle.smoking}</span>
                    <span className="badge badge-gray">{listing.user.lifestyle.pets}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setConnectOpen(true)}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '0.85rem', fontWeight: 800 }}
              >
                <UserPlus size={18} strokeWidth={2.4} /> Send Roommate Request
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Direct chat activates instantly once the host accepts your connect request.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Responsive details styles */}
      <style>{`
        @media (max-width: 900px) {
          .listing-detail-grid {
            grid-template-columns: 1fr !important;
          }
          .sticky-sidebar {
            position: static !important;
          }
        }
      `}</style>

      {/* Connect Modal */}
      <ConnectModal
        isOpen={connectOpen}
        onClose={() => setConnectOpen(false)}
        target={listing}
        onSuccess={(msg) => setToastMessage(msg)}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        targetType="listing"
        targetId={listing._id}
        targetName={listing.title}
        onSuccess={(msg) => {
          setToastMessage(msg);
          fetchListingData();
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="listing"
        targetId={listing._id}
        targetName={listing.title}
        onSuccess={(msg) => setToastMessage(msg)}
      />

      {/* Toast Alert */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default ListingDetailPage;
