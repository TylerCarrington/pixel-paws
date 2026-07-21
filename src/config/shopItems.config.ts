export type ShopItemEffect = 
  | { type: 'ADD_DOG_SLOT'; value: number }
  | { type: 'ADD_CAT_SLOT'; value: number }
  | { type: 'SET_HOME_CAPACITY'; species: string; value: number }
  | { type: 'UNLOCK_ACTION'; value: string }
  | { type: 'RECOVERY_MODIFIER'; value: number }
  | { type: 'PASSIVE_DESIRABILITY_BOOST'; value: number }
  | { type: 'ADD_TO_INVENTORY'; value: string }
  | { type: 'UNLOCK_SHELTER'; value: string };

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'Essentials' | 'Supplies' | 'Activities' | 'Upgrades' | 'Decorations';
  requiredUnlock?: string;
  effect: ShopItemEffect;
  oneTime: boolean;
  image?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'fruit_bowl',
    name: 'Fruit Bowl',
    description: 'A colorful ceramic bowl for fresh snacks. Unlocks Fruit Catch activity.',
    cost: 40,
    category: 'Activities',
    effect: { type: 'ADD_TO_INVENTORY', value: 'fruitBowl' },
    oneTime: true,
    image: './src/assets/images/decorations/pet-bowl.png'
  },
  {
    id: 'chefs_apron',
    name: 'Chef\'s Apron',
    description: 'A tiny apron for your "helper". Unlocks Cooking Together activity.',
    cost: 90,
    category: 'Activities',
    effect: { type: 'ADD_TO_INVENTORY', value: 'chefsApron' },
    oneTime: true,
    image: '👕' // Emoji as placeholder for missing asset
  },
  {
    id: 'gourmet_treats',
    name: 'Gourmet Treats Set',
    description: 'Handcrafted artisan treats. Unlocks Taste Tester activity.',
    cost: 150,
    category: 'Activities',
    effect: { type: 'ADD_TO_INVENTORY', value: 'gourmetTreats' },
    oneTime: true,
    image: '🍖'
  },
  {
    id: 'squeaky_toy',
    name: 'Squeaky Toy',
    description: 'A noise-making rubber toy. Unlocks Fetch activity.',
    cost: 75,
    category: 'Activities',
    effect: { type: 'ADD_TO_INVENTORY', value: 'squeakyToy' },
    oneTime: true,
    image: '🎾'
  },
  {
    id: 'smart_feeder',
    name: 'Smart Puzzle Feeder',
    description: 'A high-tech feeder that requires thinking. Unlocks Puzzle Toy activity.',
    cost: 120,
    category: 'Activities',
    effect: { type: 'ADD_TO_INVENTORY', value: 'smartFeeder' },
    oneTime: true,
    image: '🧠'
  },
  {
    id: 'agility_set',
    name: 'Agility Set',
    description: 'Cones, hurdles, and tunnels for training. Unlocks Obstacle Course activity.',
    cost: 100,
    category: 'Activities',
    effect: { type: 'ADD_TO_INVENTORY', value: 'agilitySet' },
    oneTime: true,
    image: '🚧'
  },
  {
    id: 'champion_ribbon',
    name: 'Champion Ribbon',
    description: 'A mark of true talent. Unlocks Tricks Showcase activity.',
    cost: 300,
    category: 'Activities',
    effect: { type: 'ADD_TO_INVENTORY', value: 'championRibbon' },
    oneTime: true,
    image: '🏆'
  },
  {
    id: 'premium_bowl',
    name: 'Premium Food Bowl',
    description: 'A ceramic bowl that keeps food fresh. Increases desirability slightly.',
    cost: 30,
    category: 'Essentials',
    effect: { type: 'PASSIVE_DESIRABILITY_BOOST', value: 5 },
    oneTime: true,
    image: './src/assets/images/decorations/pet-bowl.png'
  },
  {
    id: 'grooming_brush',
    name: 'Grooming Brush',
    description: 'Allows you to brush animals to improve their mood and appearance.',
    cost: 45,
    category: 'Essentials',
    effect: { type: 'UNLOCK_ACTION', value: 'groom' },
    oneTime: true,
    image: '🪮'
  },
  {
    id: 'cozy_bed',
    name: 'Cozy Kennel Bed',
    description: 'A soft bed that helps animals rest better. +10% desirability.',
    cost: 50,
    category: 'Essentials',
    effect: { type: 'PASSIVE_DESIRABILITY_BOOST', value: 10 },
    oneTime: true,
    image: '🛌'
  },
  {
    id: 'enrichment_toy',
    name: 'Enrichment Toy',
    description: 'Interactive toys that keep animals mentally stimulated.',
    cost: 25,
    category: 'Essentials',
    effect: { type: 'PASSIVE_DESIRABILITY_BOOST', value: 3 },
    oneTime: true,
    image: '🧸'
  },
  {
    id: 'shelter_dog_slot',
    name: 'Extra Dog Kennel',
    description: 'Increases dog housing capacity by 1. Expansion limit based on facility size.',
    cost: 200,
    category: 'Upgrades',
    effect: { type: 'ADD_DOG_SLOT', value: 1 },
    oneTime: false,
    image: '🐕'
  },
  {
    id: 'shelter_cat_slot',
    name: 'Extra Cat Play-Bed',
    description: 'Increases cat housing capacity by 1. Expansion limit based on facility size.',
    cost: 150,
    category: 'Upgrades',
    effect: { type: 'ADD_CAT_SLOT', value: 1 },
    oneTime: false,
    image: '🐈'
  },
  {
    id: 'the_shelter',
    name: 'The Shelter',
    description: 'Purchase an abandoned warehouse to start a real shelter! Unlocks true shelter mode.',
    cost: 500,
    category: 'Upgrades',
    effect: { type: 'UNLOCK_SHELTER', value: '' },
    oneTime: true,
    image: '🏠'
  },
  {
    id: 'decor_cozy_rug',
    name: 'Cozy Rug',
    description: 'A soft rug in pinks and creams for your pet\'s house.',
    cost: 30,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'COZY_RUG' },
    oneTime: false,
    image: './src/assets/images/decorations/rug.png'
  },
  {
    id: 'decor_food_bowl',
    name: 'Food Bowl',
    description: 'A decorative ceramic bowl with flower details.',
    cost: 20,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'FOOD_BOWL' },
    oneTime: false,
    image: './src/assets/images/decorations/pet-bowl.png'
  },
  {
    id: 'decor_toy_basket',
    name: 'Toy Basket',
    description: 'A wicker basket to keep all those squeaky toys organized.',
    cost: 25,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'TOY_BASKET' },
    oneTime: false,
    image: './src/assets/images/decorations/toy-basket.png'
  },
  {
    id: 'decor_wall_art',
    name: 'Bone Wall Art',
    description: 'A cute framed illustration of a lucky bone.',
    cost: 35,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'WALL_ART' },
    oneTime: false,
    image: './src/assets/images/decorations/bone-painting.png'
  },
  {
    id: 'decor_hanging_plant',
    name: 'Hanging Plant',
    description: 'A cascading green plant in a ceramic pot.',
    cost: 40,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'HANGING_PLANT' },
    oneTime: false,
    image: './src/assets/images/decorations/hanging-plant.png'
  },
  {
    id: 'decor_cushion',
    name: 'Comfort Cushion',
    description: 'A soft round cushion for napping anywhere.',
    cost: 15,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'CUSHION' },
    oneTime: false,
    image: './src/assets/images/decorations/pet-cushion.png'
  },
  {
    id: 'decor_lamp',
    name: 'Warm Lamp',
    description: 'Provides a soft, comforting glow in the evenings.',
    cost: 50,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'LAMP' },
    oneTime: false,
    image: './src/assets/images/decorations/pet-lamp.png'
  },
  {
    id: 'bedroom_pet_bed',
    name: 'Bedroom Pet Bed',
    description: 'A cozy bed for the bedroom. Allows a second dog to live in your home.',
    cost: 150,
    category: 'Upgrades',
    effect: { type: 'SET_HOME_CAPACITY', species: 'DOG', value: 2 },
    oneTime: true,
    image: '🛏️'
  },
  {
    id: 'family_room_cat_bed',
    name: 'Family Room Cat Bed',
    description: 'A cozy bed for the living room. Allows you to bring a cat home.',
    cost: 200,
    category: 'Upgrades',
    effect: { type: 'SET_HOME_CAPACITY', species: 'CAT', value: 1 },
    oneTime: true,
    image: '🐱'
  },
  {
    id: 'shop_apple_slice',
    name: 'Apple Slice',
    description: 'Crisp, sweet, and nutritious fruit treat for small pets and birds.',
    cost: 15,
    category: 'Supplies',
    effect: { type: 'ADD_TO_INVENTORY', value: 'apple_slice' },
    oneTime: false,
    image: './src/assets/images/items/apple-slice.png'
  },
  {
    id: 'shop_bird_seed',
    name: 'Organic Bird Seed',
    description: 'Energetic blend of millet, oats, and sunflower seeds for birds.',
    cost: 10,
    category: 'Supplies',
    effect: { type: 'ADD_TO_INVENTORY', value: 'bird_seed' },
    oneTime: false,
    image: './src/assets/images/items/bird-seed.png'
  },
  {
    id: 'shop_carrot',
    name: 'Crispy Sweet Carrot',
    description: 'Fresh and crunchy, excellent for small animals to gnaw on.',
    cost: 12,
    category: 'Supplies',
    effect: { type: 'ADD_TO_INVENTORY', value: 'carrot' },
    oneTime: false,
    image: './src/assets/images/items/carrot.png'
  },
  {
    id: 'shop_cat_treat',
    name: 'Savory Salmon Bites',
    description: 'Fragrant gourmet salmon bites that any kitten will purr for.',
    cost: 18,
    category: 'Supplies',
    effect: { type: 'ADD_TO_INVENTORY', value: 'cat_treat' },
    oneTime: false,
    image: './src/assets/images/items/cat-treat.png'
  },
  {
    id: 'shop_hay_strands',
    name: 'Fragrant Timothy Hay',
    description: 'Digestion-friendly fragrant dry hay for rabbits and exotics.',
    cost: 8,
    category: 'Supplies',
    effect: { type: 'ADD_TO_INVENTORY', value: 'hay_strands' },
    oneTime: false,
    image: './src/assets/images/items/hay-strands.png'
  },
  {
    id: 'shop_lettuce_leaf',
    name: 'Crisp Lettuce Leaf',
    description: 'Hydrating, refreshing leafy greens for turtles and small critters.',
    cost: 6,
    category: 'Supplies',
    effect: { type: 'ADD_TO_INVENTORY', value: 'lettuce_leaf' },
    oneTime: false,
    image: './src/assets/images/items/lettuce-leaf.png'
  },
  {
    id: 'shop_cream_food_bowl',
    name: 'Ceramic Cream Bowl',
    description: 'Heavy pottery dish glaze in beautiful beige cream.',
    cost: 25,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'cream_food_bowl' },
    oneTime: false,
    image: './src/assets/images/items/cream-food-bowl.png'
  },
  {
    id: 'shop_pet_food_bowl_pink',
    name: 'Petal Pink Bowl',
    description: 'Adorable pink ceramic dish for a delicate dining experience.',
    cost: 25,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'pet_food_bowl_pink' },
    oneTime: false,
    image: './src/assets/images/items/pet-food-bowl-pink.png'
  },
  {
    id: 'shop_metal_pet_bowl',
    name: 'Stainless Steel Bowl',
    description: 'Unbreakable bowl with a non-skid rubber base.',
    cost: 20,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'metal_pet_bowl' },
    oneTime: false,
    image: './src/assets/images/items/metal-pet-bowl.png'
  },
  {
    id: 'shop_water_bowl',
    name: 'Splashy Water Bowl',
    description: 'Sky-blue dish designed to supply sparkling fresh water.',
    cost: 20,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'water_bowl' },
    oneTime: false,
    image: './src/assets/images/items/water-bowl.png'
  },
  {
    id: 'shop_raised_feeder_stand',
    name: 'Raised Wooden Feeder',
    description: 'Cedarwood elevated food stand supporting ergonomic dining.',
    cost: 65,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'raised_feeder_stand' },
    oneTime: false,
    image: './src/assets/images/items/raised-feeder-stand.png'
  },
  {
    id: 'shop_catnip_mouse_toy',
    name: 'Catnip Plusha Mouse',
    description: 'Filled with potent organic catnip to drive any feline wild.',
    cost: 20,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'catnip_mouse_toy' },
    oneTime: false,
    image: './src/assets/images/items/catnip-mouse-toy.png'
  },
  {
    id: 'shop_mylar_ball',
    name: 'Sparkly Mylar Ball',
    description: 'A glossy crinkle sphere cats love to bat and hunt.',
    cost: 15,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'mylar_ball' },
    oneTime: false,
    image: './src/assets/images/items/mylar-ball.png'
  },
  {
    id: 'shop_feather_toy',
    name: 'Chasing Feather Stick',
    description: 'A bouncy wand with natural feathers guiding soft interactive pursuits.',
    cost: 25,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'feather_toy' },
    oneTime: false,
    image: './src/assets/images/items/feather-toy.png'
  },
  {
    id: 'shop_tennis_ball',
    name: 'Sunny Tennis Ball',
    description: 'Irresistible bounce, neon green felt. A dog standard toy.',
    cost: 10,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'tennis_ball' },
    oneTime: false,
    image: './src/assets/images/items/tennis-ball.png'
  },
  {
    id: 'shop_rope_dog_toy',
    name: 'Knotted Cotton Rope',
    description: 'Durable woven thread toy designed for gentle chewing and tug-of-war.',
    cost: 22,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'rope_dog_toy' },
    oneTime: false,
    image: './src/assets/images/items/rope-dog-toy.png'
  },
  {
    id: 'shop_heavy_tug_rope',
    name: 'Heavy Duty Tug Rope',
    description: 'Sturdily spun thick chord for intense fetch and pull workouts.',
    cost: 45,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'heavy_tug_rope' },
    oneTime: false,
    image: './src/assets/images/items/heavy-tug-rope.png'
  },
  {
    id: 'shop_kong_toy',
    name: 'Cozy Stuffable Cone',
    description: 'Bouncy, ultra-durable red rubber food cup you can stuff with paste.',
    cost: 40,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'kong_toy' },
    oneTime: false,
    image: './src/assets/images/items/kong-toy.png'
  },
  {
    id: 'shop_treat_ball',
    name: 'Roll-and-Seek Toy',
    description: 'Interactive puzzle sphere that leaks savory treats when pushed around.',
    cost: 50,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'treat_ball' },
    oneTime: false,
    image: './src/assets/images/items/treat-ball.png'
  },
  {
    id: 'shop_rubber_duck',
    name: 'Squeaky Rubber Duck',
    description: 'Classic happy yellow bath toy that lets out a delightful squeak.',
    cost: 18,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'rubber_duck' },
    oneTime: false,
    image: './src/assets/images/items/rubber-duck.png'
  },
  {
    id: 'shop_laser_pointer',
    name: 'Twinkling Laser',
    description: 'An interactive red dot generator encouraging playful, rapid chases.',
    cost: 55,
    category: 'Decorations',
    effect: { type: 'ADD_TO_INVENTORY', value: 'laser_pointer' },
    oneTime: false,
    image: './src/assets/images/items/laser-pointer.png'
  }
];
