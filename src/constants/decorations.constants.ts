import { DecorationItem } from '../types/decoration.types';

export const DECORATIONS: Record<string, DecorationItem> = {
  PET_BED: {
    id: 'PET_BED',
    name: 'Pet Bed',
    description: 'A cozy bed for your pet to sleep on.',
    cost: 0,
    image: '/src/assets/images/items/pet-bed.png',
    type: 'floor',
    width: 60,
    height: 40
  },
  COZY_RUG: {
    id: 'COZY_RUG',
    name: 'Cozy Rug',
    description: 'A soft rug in pinks and creams.',
    cost: 30,
    image: '/src/assets/images/decorations/rug.png',
    type: 'floor',
    width: 60,
    height: 40
  },
  FOOD_BOWL: {
    id: 'FOOD_BOWL',
    name: 'Food Bowl',
    description: 'Ceramic bowl with flower details.',
    cost: 20,
    image: '/src/assets/images/decorations/pet-bowl.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  TOY_BASKET: {
    id: 'TOY_BASKET',
    name: 'Toy Basket',
    description: 'Wicker basket for holding toys.',
    cost: 25,
    image: '/src/assets/images/decorations/toy-basket.png',
    type: 'floor',
    width: 32,
    height: 32
  },
  WALL_ART: {
    id: 'WALL_ART',
    name: 'Wall Art',
    description: 'Bone illustration in a cute frame.',
    cost: 35,
    image: '/src/assets/images/decorations/bone-painting.png',
    type: 'wall',
    width: 24,
    height: 24
  },
  HANGING_PLANT: {
    id: 'HANGING_PLANT',
    name: 'Hanging Plant',
    description: 'Fresh greenery for your pet.',
    cost: 40,
    image: '/src/assets/images/decorations/hanging-plant.png',
    type: 'ceiling',
    width: 32,
    height: 48
  },
  CUSHION: {
    id: 'CUSHION',
    name: 'Cushion',
    description: 'A round blush pink cushion.',
    cost: 15,
    image: '/src/assets/images/decorations/pet-cushion.png',
    type: 'floor',
    width: 32,
    height: 32
  },
  LAMP: {
    id: 'LAMP',
    name: 'Warm Lamp',
    description: 'Adds a cozy glow to the room.',
    cost: 50,
    image: '/src/assets/images/decorations/pet-lamp.png',
    type: 'floor',
    width: 16,
    height: 32
  },
  apple_slice: {
    id: 'apple_slice',
    name: 'Apple Slice',
    description: 'A fresh, sweet slice of crisp local apple.',
    cost: 15,
    image: '/src/assets/images/items/apple-slice.png',
    type: 'floor',
    width: 20,
    height: 20
  },
  bird_seed: {
    id: 'bird_seed',
    name: 'Organic Bird Seed',
    description: 'A rich mixture of sunflower seeds, millet, and oats.',
    cost: 10,
    image: '/src/assets/images/items/bird-seed.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  carrot: {
    id: 'carrot',
    name: 'Crispy Sweet Carrot',
    description: 'Crunchy orange garden carrot.',
    cost: 12,
    image: '/src/assets/images/items/carrot.png',
    type: 'floor',
    width: 16,
    height: 24
  },
  cat_treat: {
    id: 'cat_treat',
    name: 'Savory Salmon Bites',
    description: 'Melt-in-the-mouth gourmet salmon bites.',
    cost: 18,
    image: '/src/assets/images/items/cat-treat.png',
    type: 'floor',
    width: 18,
    height: 18
  },
  hay_strands: {
    id: 'hay_strands',
    name: 'Fragrant Timothy Hay',
    description: 'Sweet-smelling dry hay.',
    cost: 8,
    image: '/src/assets/images/items/hay-strands.png',
    type: 'floor',
    width: 24,
    height: 20
  },
  lettuce_leaf: {
    id: 'lettuce_leaf',
    name: 'Crisp Lettuce Leaf',
    description: 'Hydrating, crisp green leaf.',
    cost: 6,
    image: '/src/assets/images/items/lettuce-leaf.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  cream_food_bowl: {
    id: 'cream_food_bowl',
    name: 'Ceramic Cream Bowl',
    description: 'Beige cream pottery bowl.',
    cost: 25,
    image: '/src/assets/images/items/cream-food-bowl.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  pet_food_bowl_pink: {
    id: 'pet_food_bowl_pink',
    name: 'Petal Pink Bowl',
    description: 'Dainty pink food dish.',
    cost: 25,
    image: '/src/assets/images/items/pet-food-bowl-pink.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  metal_pet_bowl: {
    id: 'metal_pet_bowl',
    name: 'Stainless Steel Bowl',
    description: 'Durable, non-slip metal plate.',
    cost: 20,
    image: '/src/assets/images/items/metal-pet-bowl.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  water_bowl: {
    id: 'water_bowl',
    name: 'Splashy Water Bowl',
    description: 'Blue ceramic bowl containing fresh water.',
    cost: 20,
    image: '/src/assets/images/items/water-bowl.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  raised_feeder_stand: {
    id: 'raised_feeder_stand',
    name: 'Raised Wooden Feeder',
    description: 'Cedarwood joint-friendly elevated stand.',
    cost: 65,
    image: '/src/assets/images/items/raised-feeder-stand.png',
    type: 'floor',
    width: 36,
    height: 24
  },
  catnip_mouse_toy: {
    id: 'catnip_mouse_toy',
    name: 'Catnip Plusha Mouse',
    description: 'Fabric toy stuffed with organic catnip.',
    cost: 20,
    image: '/src/assets/images/items/catnip-mouse-toy.png',
    type: 'floor',
    width: 24,
    height: 16
  },
  mylar_ball: {
    id: 'mylar_ball',
    name: 'Sparkly Mylar Ball',
    description: 'Crunchy sparkly ball.',
    cost: 15,
    image: '/src/assets/images/items/mylar-ball.png',
    type: 'floor',
    width: 20,
    height: 20
  },
  feather_toy: {
    id: 'feather_toy',
    name: 'Chasing Feather Stick',
    description: 'Feather wand for kittens.',
    cost: 25,
    image: '/src/assets/images/items/feather-toy.png',
    type: 'floor',
    width: 28,
    height: 28
  },
  tennis_ball: {
    id: 'tennis_ball',
    name: 'Sunny Tennis Ball',
    description: 'Bouncy neon green ball.',
    cost: 10,
    image: '/src/assets/images/items/tennis-ball.png',
    type: 'floor',
    width: 18,
    height: 18
  },
  rope_dog_toy: {
    id: 'rope_dog_toy',
    name: 'Knotted Cotton Rope',
    description: 'Cotton rope for chewing.',
    cost: 22,
    image: '/src/assets/images/items/rope-dog-toy.png',
    type: 'floor',
    width: 32,
    height: 16
  },
  heavy_tug_rope: {
    id: 'heavy_tug_rope',
    name: 'Heavy Duty Tug Rope',
    description: 'Strong thick pull chord.',
    cost: 45,
    image: '/src/assets/images/items/heavy-tug-rope.png',
    type: 'floor',
    width: 36,
    height: 16
  },
  kong_toy: {
    id: 'kong_toy',
    name: 'Cozy Stuffable Cone',
    description: 'Stuffable durable rubber cone.',
    cost: 40,
    image: '/src/assets/images/items/kong-toy.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  treat_ball: {
    id: 'treat_ball',
    name: 'Roll-and-Seek Toy',
    description: 'Rollable puzzle treat ball.',
    cost: 50,
    image: '/src/assets/images/items/treat-ball.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  rubber_duck: {
    id: 'rubber_duck',
    name: 'Squeaky Rubber Duck',
    description: 'Cheerful squeaking yellow bathing buddy.',
    cost: 18,
    image: '/src/assets/images/items/rubber-duck.png',
    type: 'floor',
    width: 24,
    height: 24
  },
  laser_pointer: {
    id: 'laser_pointer',
    name: 'Twinkling Laser',
    description: 'Interactive red chasing dot.',
    cost: 55,
    image: '/src/assets/images/items/laser-pointer.png',
    type: 'floor',
    width: 20,
    height: 20
  }
};
