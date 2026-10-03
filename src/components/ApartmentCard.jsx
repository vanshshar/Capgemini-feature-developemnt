const amenityIcons = {
  WiFi: '⌁',
  Parking: 'P',
  'Air Conditioning': '✦',
  Kitchen: '⌂',
  'Swimming Pool': '◌',
  'Washing Machine': '◍',
};

function ApartmentCard({ apartment }) {
  return (
    <article className="apartment-card">
      <div className={`apartment-card__image apartment-card__image--${apartment.accent || 'coral'}`}>
        <span className="apartment-card__window" />
        <span className="apartment-card__plant">⌁</span>
        <span className="apartment-card__label">ACTIVE</span>
      </div>
      <div className="apartment-card__content">
        <div className="apartment-card__heading">
          <div>
            <h3>{apartment.title}</h3>
            <p>Up to {apartment.guests} guests</p>
          </div>
          <strong>${apartment.price}<small>/night</small></strong>
        </div>
        <p className="apartment-card__description">{apartment.description}</p>
        <div className="amenity-pills" aria-label="Apartment amenities">
          {apartment.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="amenity-pill">
              <span aria-hidden="true">{amenityIcons[amenity]}</span> {amenity}
            </span>
          ))}
          {apartment.amenities.length > 3 && <span className="amenity-pill">+{apartment.amenities.length - 3}</span>}
        </div>
      </div>
    </article>
  );
}

export default ApartmentCard;
