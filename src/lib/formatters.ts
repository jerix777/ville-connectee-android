
export const formatPrice = (price: number): string => {
  // Si le prix est inférieur à 1000, on considère que c'est un loyer
  if (price < 1000) {
    return `${price} CFA`;
  }
  
  // Sinon, on formate avec des espaces pour les milliers
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(price).replace('XOF', 'CFA');
};
