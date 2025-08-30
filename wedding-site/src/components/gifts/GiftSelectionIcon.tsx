import React from 'react';
import { Link } from 'react-router-dom';
import { useGiftSelection } from '../../context/GiftSelectionContext';

const GiftSelectionIcon: React.FC = () => {
  const { getItemCount } = useGiftSelection();
  const itemCount = getItemCount();

  return (
    <Link to="/selection" className="cart-icon">
      <i className="fas fa-gift"></i>
      {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
    </Link>
  );
};

export default GiftSelectionIcon;