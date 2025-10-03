export const sampleProducts = [
  {
    id: 1,
    name: "Pulsera de Plata Artesanal",
    price: 45.99,
    category: "joyeria",
    gender: "mujer",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
    description: "Pulsera hecha a mano con plata 925"
  },
  {
    id: 2,
    name: "Reloj de Madera Natural",
    price: 89.99,
    category: "relojes",
    gender: "hombre",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400",
    description: "Reloj ecológico de bambú"
  },
  {
    id: 3,
    name: "Collar con Piedras Naturales",
    price: 35.5,
    category: "joyeria",
    gender: "mujer",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    description: "Collar con cuarzo rosa natural"
  },
  {
    id: 4,
    name: "Anillo de Cobre Martillado",
    price: 25,
    category: "joyeria",
    gender: "todos",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
    description: "Anillo unisex hecho a mano"
  },
  {
    id: 5,
    name: "Zapatos Artesanales de Cuero",
    price: 120,
    category: "zapatos",
    gender: "hombre",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400",
    description: "Zapatos 100% cuero genuino"
  },
  {
    id: 6,
    name: "Bolso Tejido a Mano",
    price: 65,
    category: "accesorios",
    gender: "mujer",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
    description: "Bolso artesanal de fibras naturales"
  },
  {
    id: 7,
    name: "Camisa Bordada Infantil",
    price: 40,
    category: "ropa",
    gender: "nino",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400",
    description: "Camisa con bordados tradicionales"
  },
  {
    id: 8,
    name: "Sombrero de Paja Artesanal",
    price: 55,
    category: "accesorios",
    gender: "todos",
    image: "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=400",
    description: "Sombrero tejido a mano"
  }
];

export const categories = [
  { id: "joyeria", label: "Joyería", icon: "fas fa-ring", description: "Anillos, pulseras y collares" },
  { id: "relojes", label: "Relojes", icon: "fas fa-clock", description: "Diseños únicos y elegantes" },
  { id: "accesorios", label: "Accesorios", icon: "fas fa-glasses", description: "Complementa tu estilo" },
  { id: "ropa", label: "Ropa", icon: "fas fa-tshirt", description: "Moda artesanal única" },
  { id: "zapatos", label: "Zapatos", icon: "fas fa-shoe-prints", description: "Calzado hecho a mano" },
  { id: "todos", label: "Ver Todo", icon: "fas fa-th", description: "Explora toda la colección" }
];

export function getProductById(id) {
  return sampleProducts.find((product) => product.id === id);
}



