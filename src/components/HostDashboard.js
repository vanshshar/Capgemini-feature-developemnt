import { useEffect, useState } from 'react';
import apartments from '../data/apartments';
import ApartmentCard from './ApartmentCard';
import Modal from './Modal';

const amenityOptions = [
  'WiFi',
  'Parking',
  'Air Conditioning',
  'Kitchen',
  'Swimming Pool',
  'Washing Machine',
];

const emptyForm = {
  title: '',
  guests: '',
  description: '',
  amenities: [],
  price: '',
};

function HostDashboard() {
  const [hostedApartments, setHostedApartments] = useState(apartments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [hasInteracted, setHasInteracted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if(formData.title.length > 30) {
      newErrors.title = 'Title must be 30 characters or less';
    }

    const guests = Number(formData.guests);

    if(formData.guests === '' || guests < 1 || guests > 20) {
      newErrors.guests = 'Guests must be between 1 and 20';
    }

    if(formData.description.length < 20 || formData.description.length > 200) {
      newErrors.description = 'Description must be between 20 and 200 characters';
    }

    if(formData.amenities.length === 0) {
      newErrors.amenities = 'Please select at least one amenity';
    }

    const price = Number(formData.price);

    if(formData.price === '' || price < 10 || price > 1000) {
      newErrors.price = 'Price must be between $10 and $1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (hasInteracted) validateForm();
  }, [formData, hasInteracted]);

  const openHostForm = () => {
    setIsModalOpen(true);
    setFormData(emptyForm);
    setErrors({});
    setHasInteracted(false);
  };

  const closeHostForm = () => {
    setIsModalOpen(false);
    setFormData(emptyForm);
    setErrors({});
    setHasInteracted(false);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setHasInteracted(true);
  };

  const handleAmenityChange = (event) => {
    const { value, checked } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      amenities: checked
        ? [...currentData.amenities, value]
        : currentData.amenities.filter((amenity) => amenity !== value),
    }));
    setHasInteracted(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formIsValid = validateForm();

    if (formIsValid === false) return;

    setHostedApartments((currentApartments) => [
      {
        ...formData,
        id: Date.now(),
        guests: Number(formData.guests),
        price: Number(formData.price),
        accent: 'coral',
      },
      ...currentApartments,
    ]);
    closeHostForm();
  };

  return (
    <main className="dashboard-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="StayNest home">
          <span className="brand__mark" aria-hidden="true">⌂</span>
          <span>stay<span>Nest</span></span>
        </a>
        <div className="topbar__actions">
          <button className="help-link" type="button">Help centre</button>
          <button className="avatar" type="button" aria-label="Open host profile">SM</button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">HOST MANAGEMENT</p>
          <h1>Welcome back, <em>Sarah.</em></h1>
          <p className="hero__copy">Keep your spaces ready for every kind of stay.</p>
        </div>
        <button className="primary-button" type="button" onClick={openHostForm}>
          <span aria-hidden="true">+</span> Add Apartment
        </button>
      </section>

      <section className="dashboard-summary" aria-label="Hosting summary">
        <div className="summary-card">
          <span className="summary-card__icon">⌂</span>
          <div><strong>{hostedApartments.length}</strong><span>Active listings</span></div>
        </div>
        <div className="summary-card">
          <span className="summary-card__icon">★</span>
          <div><strong>4.9</strong><span>Average rating</span></div>
        </div>
        <div className="summary-card">
          <span className="summary-card__icon">↗</span>
          <div><strong>82%</strong><span>Occupancy this month</span></div>
        </div>
      </section>

      <section className="listings-section" aria-labelledby="listings-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR PORTFOLIO</p>
            <h2 id="listings-title">Your apartments</h2>
          </div>
          <button className="text-button" type="button">Manage listings <span aria-hidden="true">→</span></button>
        </div>
        <div className="apartment-grid">
          {hostedApartments.map((apartment) => <ApartmentCard key={apartment.id} apartment={apartment} />)}
        </div>
      </section>

      {isModalOpen && (
        <Modal title="Host Your Apartment" onClose={closeHostForm}>
          <form className="host-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="title">Apartment title</label>
              <input id="title" name="title" type="text" placeholder="e.g. Calm city hideaway" value={formData.title} onChange={handleFieldChange} />
              {errors.title && <p className="field-error" data-testid="titleerror">{errors.title}</p>}
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="guests">Number of guests</label>
                <input id="guests" name="guests" type="number" placeholder="2" value={formData.guests} onChange={handleFieldChange} />
                {errors.guests && <p className="field-error" data-testid="guesterror">{errors.guests}</p>}
              </div>
              <div className="form-field">
                <label htmlFor="price">Price per night <span>USD</span></label>
                <div className="price-input"><span>$</span><input id="price" name="price" type="number" placeholder="120" value={formData.price} onChange={handleFieldChange} /></div>
                {errors.price && <p className="field-error" data-testid="price-error">{errors.price}</p>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="3" placeholder="Tell guests what makes this place special..." value={formData.description} onChange={handleFieldChange} />
              {errors.description && <p className="field-error" data-testid="desc-error">{errors.description}</p>}
            </div>

            <fieldset className="form-field amenities-field">
              <legend>Amenities</legend>
              <div className="checkbox-grid">
                {amenityOptions.map((amenity) => (
                  <label className="checkbox-option" key={amenity}>
                    <input type="checkbox" value={amenity} checked={formData.amenities.includes(amenity)} onChange={handleAmenityChange} />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
              {errors.amenities && <p className="field-error" data-testid="amenity-error">{errors.amenities}</p>}
            </fieldset>

            <footer className="form-actions">
              <button className="secondary-button" type="button" onClick={closeHostForm}>Cancel</button>
              <button className="primary-button" type="submit">Host Apartment <span aria-hidden="true">→</span></button>
            </footer>
          </form>
        </Modal>
      )}
    </main>
  );
}

export default HostDashboard;
