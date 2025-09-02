// Basic game data used across pages
window.GameData = (function() {
  const featuredGames = [
    { id: 1, title: "Cyberpunk 2077", price: 199.99, originalPrice: 299.99, image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg", rating: 4.8, platform: ["PC", "PS5", "Xbox"], genre: "RPG / Ação", discount: 33 },
    { id: 2, title: "The Witcher 3: Wild Hunt", price: 89.99, originalPrice: 149.99, image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg", rating: 4.9, platform: ["PC", "PS5"], genre: "RPG / Aventura", discount: 40 },
    { id: 3, title: "Red Dead Redemption 2", price: 159.99, image: "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg", rating: 4.7, platform: ["PC", "PS4"], genre: "Ação / Aventura" },
    { id: 4, title: "Grand Theft Auto V", price: 79.99, originalPrice: 119.99, image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg", rating: 4.6, platform: ["PC", "PS5", "Xbox"], genre: "Ação / Mundo Aberto", discount: 33 }
  ];

  const allGames = [
    { id: 1, title: "Cyberpunk 2077", price: 199.99, originalPrice: 299.99, image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg", rating: 4.8, platform: ["PC", "PS5", "Xbox"], genre: "RPG" , discount: 33 },
    { id: 2, title: "The Witcher 3: Wild Hunt", price: 89.99, originalPrice: 149.99, image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg", rating: 4.9, platform: ["PC", "PS5"], genre: "RPG", discount: 40 },
    { id: 3, title: "Red Dead Redemption 2", price: 159.99, image: "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg", rating: 4.7, platform: ["PC", "PS4"], genre: "Ação" },
    { id: 4, title: "Grand Theft Auto V", price: 79.99, originalPrice: 119.99, image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg", rating: 4.6, platform: ["PC", "PS5", "Xbox"], genre: "Ação", discount: 33 },
    { id: 5, title: "FIFA 24", price: 249.99, image: "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg", rating: 4.3, platform: ["PC", "PS5", "Xbox"], genre: "Esportes" },
    { id: 6, title: "Call of Duty: Modern Warfare III", price: 299.99, image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg", rating: 4.5, platform: ["PC", "PS5", "Xbox"], genre: "Ação" },
    { id: 7, title: "Assassin's Creed Mirage", price: 179.99, originalPrice: 229.99, image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg", rating: 4.4, platform: ["PC", "PS5"], genre: "Aventura", discount: 22 },
    { id: 8, title: "Spider-Man 2", price: 269.99, image: "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg", rating: 4.8, platform: ["PS5"], genre: "Ação" }
  ];

  function getById(id) {
    return allGames.find(g => g.id === Number(id));
  }

  return { featuredGames, allGames, getById };
})(); 