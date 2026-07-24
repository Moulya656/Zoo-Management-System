// Run this ONCE with: npm run seed
// It fills your MongoDB database with the animals you already had in your
// original HTML files, so you don't have to re-type them all through the
// admin panel. Image files must exist in /public/images/ with these names
// (copy your original images folder into public/images/).

require('dotenv').config();
const connectDB = require('./config/db');
const Animal = require('./models/Animal');

const animals = [
  // ---------- Herbivores ----------
  { name: 'Panda', category: 'Herbivore', scientificName: 'Ailuropoda melanoleuca', species: 'Giant Panda', lifespan: '20 years in the wild', caption: 'Gentle bamboo-eating bear.', description: 'Pandas are native to China and are known for their love of bamboo. They are solitary and spend much of their time eating or sleeping.', imagePath: 'images/panda.jpeg' },
  { name: 'Deer', category: 'Herbivore', scientificName: 'Cervidae', species: 'Various (White-tailed Deer, Red Deer)', lifespan: '6-14 years in the wild', caption: 'Graceful herbivore with antlers.', description: 'Deer are agile, fast-running herbivores commonly found in forests and grasslands. Males often grow antlers for defense and display.', imagePath: 'images/deer.jpeg' },
  { name: 'Zebra', category: 'Herbivore', scientificName: 'Equus quagga', species: 'Plains Zebra', lifespan: '20-25 years', caption: 'Striped member of the horse family.', description: 'Zebras are known for their black-and-white stripes which help with camouflage and social bonding. They live in herds and graze on grasses.', imagePath: 'images/zebra.webp' },
  { name: 'Elephant', category: 'Herbivore', scientificName: 'Loxodonta africana', species: 'African Elephant', lifespan: '60-70 years', caption: 'Largest land herbivore.', description: 'Elephants are intelligent mammals known for their trunks, tusks, and strong social bonds. They feed on grasses, bark, and fruits.', imagePath: 'images/elephant.jpg' },
  { name: 'Porcupine', category: 'Herbivore', scientificName: 'Hystricidae / Erethizontidae', species: 'Various', lifespan: '5-7 years in the wild', caption: 'Rodent with defensive quills.', description: 'Porcupines are herbivorous rodents covered in sharp quills. They eat bark, leaves, and fruit and rely on their quills for protection.', imagePath: 'images/porcupine.jpeg' },
  { name: 'Giraffe', category: 'Herbivore', scientificName: 'Giraffa camelopardalis', species: 'Giraffe', lifespan: '25 years in the wild', caption: 'Tallest land animal.', description: 'Giraffes use their long necks to reach treetop leaves. They live in open savannas and woodlands and are social animals often seen in groups.', imagePath: 'images/giraffe.jpeg' },

  // ---------- Carnivores ----------
  { name: 'Cheetah', category: 'Carnivore', scientificName: 'Acinonyx jubatus', species: 'Cheetah', lifespan: '10-12 years in the wild', caption: 'The fastest land animal.', description: 'The cheetah is the fastest land animal, capable of reaching speeds up to 70 mph (112 km/h). It hunts using bursts of speed and thrives in African grasslands.', imagePath: 'images/cheetah.jpeg' },
  { name: 'Jaguar', category: 'Carnivore', scientificName: 'Panthera onca', species: 'Jaguar', lifespan: '12-15 years in the wild', caption: 'Powerful and stealthy hunter.', description: 'The jaguar is a powerful predator found in Central and South America. Known for its strong jaw and ability to swim, it preys on deer, capybaras, and even caimans.', imagePath: 'images/jagur.jpeg' },
  { name: 'Tiger', category: 'Carnivore', scientificName: 'Panthera tigris', species: 'Tiger', lifespan: '10-15 years in the wild', caption: 'The largest wild cat.', description: 'The tiger is the largest of the big cats, known for its orange coat with black stripes. Tigers are solitary hunters, typically found in Asian forests and grasslands.', imagePath: 'images/tiger.jpeg' },
  { name: 'Lion', category: 'Carnivore', scientificName: 'Panthera leo', species: 'Lion', lifespan: '10-14 years in the wild', caption: 'Social big cats living in prides.', description: "Lions are the only big cats that live in social groups called prides. Males are recognized by their large manes and are known as the 'king of the jungle'.", imagePath: 'images/lion.jpg' },
  { name: 'White Tiger', category: 'Carnivore', scientificName: 'Panthera tigris tigris (white variant)', species: 'Bengal Tiger (White Variant)', lifespan: '12-15 years in captivity', caption: 'Rare white-coated Bengal tiger.', description: 'White tigers are a rare color mutation of the Bengal tiger. They are not albino but have a recessive gene that gives them white fur and blue eyes. They are usually found in zoos and sanctuaries.', imagePath: 'images/white-tiger.jpeg' },

  // ---------- Omnivores ----------
  { name: 'Monkey', category: 'Omnivore', scientificName: 'Cercopithecidae / Cebidae', species: 'Various', lifespan: '10-30 years', caption: 'Agile and social primate.', description: 'Monkeys are intelligent, social mammals found in forests and jungles. They eat fruits, leaves, insects, and small animals.', imagePath: 'images/monkey.jpg' },
  { name: 'Chimpanzee', category: 'Omnivore', scientificName: 'Pan troglodytes', species: 'Chimpanzee', lifespan: '33-40 years in the wild', caption: 'Intelligent and tool-using primate.', description: 'Chimpanzees are highly intelligent, using tools and showing complex emotions. They eat fruits, nuts, insects, and sometimes meat.', imagePath: 'images/chimpanjii.jpeg' },
  { name: 'Bear', category: 'Omnivore', scientificName: 'Ursidae', species: 'Various (Brown Bear, Black Bear)', lifespan: '20-30 years', caption: 'Powerful omnivore with varied diet.', description: 'Bears are large mammals that eat plants, berries, fish, and small animals. They hibernate in colder climates during winter months.', imagePath: 'images/bear.jpeg' },
  { name: 'Fox', category: 'Omnivore', scientificName: 'Vulpes vulpes', species: 'Red Fox (most common)', lifespan: '3-6 years in the wild', caption: 'Cunning and adaptable hunter.', description: "Foxes eat fruits, small mammals, birds, and insects. They're found across many environments and are known for their agility and cunning.", imagePath: 'images/fox.jpeg' },
  { name: 'Raccoon', category: 'Omnivore', scientificName: 'Procyon lotor', species: 'Raccoon', lifespan: '2-5 years in the wild', caption: 'Nocturnal scavenger with dexterous paws.', description: 'Raccoons are clever, adaptable animals often found in urban and forest areas. They eat fruit, eggs, insects, and food scraps.', imagePath: 'images/raccol.jpeg' },

  // ---------- Birds ----------
  { name: 'White Peacock', category: 'Bird', scientificName: 'Pavo cristatus', species: 'Indian Peafowl (White Morph)', lifespan: '20 years', caption: 'Stunning white variant of the Indian peafowl.', description: 'The white peacock is not albino, but a genetic color variant of the Indian peafowl. It is admired for its pure white plumage and courtship display.', imagePath: 'images/white-peacock.webp' },
  { name: 'Owl', category: 'Bird', scientificName: 'Strigiformes', species: 'Varies (Barn Owl, Great Horned Owl)', lifespan: '10-15 years in the wild', caption: 'Nocturnal bird of prey with keen eyesight.', description: 'Owls are silent hunters known for their excellent night vision and ability to rotate their heads. They feed on rodents, insects, and other small animals.', imagePath: 'images/owls.jpeg' },
  { name: 'Ostrich', category: 'Bird', scientificName: 'Struthio camelus', species: 'Ostrich', lifespan: '30-40 years', caption: 'Largest and fastest-running bird.', description: 'The ostrich is a flightless bird native to Africa. It can sprint up to 70 km/h (43 mph) and uses its powerful legs for defense and running.', imagePath: 'images/ostrich.jpeg' },
  { name: 'Parrot', category: 'Bird', scientificName: 'Psittaciformes', species: 'Varies (Macaws, Cockatoos, Parakeets)', lifespan: '20-80 years depending on species', caption: 'Intelligent and colorful talkative bird.', description: 'Parrots are bright, social birds known for mimicking sounds and human speech. They thrive in tropical and subtropical regions worldwide.', imagePath: 'images/parrot.jpeg' },
  { name: 'Swan', category: 'Bird', scientificName: 'Cygnus', species: 'Varies (Mute Swan, Trumpeter Swan)', lifespan: '10-20 years in the wild', caption: 'Graceful waterfowl known for elegance.', description: 'Swans are large aquatic birds recognized by their long necks and beauty. They form strong pair bonds and are often found in lakes and rivers.', imagePath: 'images/swam.webp' },

  // ---------- Reptiles ----------
  { name: 'Crocodile', category: 'Reptile', scientificName: 'Crocodylus', species: 'Crocodile', lifespan: '70-100 years', caption: 'Powerful aquatic predator.', description: 'Crocodiles are large aquatic reptiles known for their powerful jaws and stealthy hunting in rivers and lakes.', imagePath: 'images/crocodile.jpeg' },
  { name: 'Cobra', category: 'Reptile', scientificName: 'Naja', species: 'Cobra', lifespan: '20 years in the wild', caption: 'Venomous snake with a hood.', description: 'Cobras are venomous snakes famous for their hood and threatening posture when disturbed.', imagePath: 'images/cobra.jpeg' },
  { name: 'Python', category: 'Reptile', scientificName: 'Pythonidae', species: 'Python', lifespan: '20-30 years in captivity', caption: 'Non-venomous constrictor.', description: 'Pythons are non-venomous constrictors that kill their prey by squeezing rather than biting.', imagePath: 'images/python.jpg' },
  { name: 'Tortoise', category: 'Reptile', scientificName: 'Testudinidae', species: 'Tortoise', lifespan: '50-100 years', caption: 'Slow-moving, long-lived reptile.', description: 'Tortoises are land-dwelling reptiles with hard shells and long lifespans, known for their slow movement.', imagePath: 'images/tortise.jpg' },
  { name: 'Green Snake', category: 'Reptile', scientificName: 'Opheodrys aestivus', species: 'Green Snake', lifespan: '6-10 years in the wild', caption: 'Small, excellent climber.', description: 'Green snakes are small, non-venomous snakes that are excellent climbers and feed on insects.', imagePath: 'images/green-snake.jpeg' }
];

async function seed() {
  await connectDB();
  await Animal.deleteMany({});
  await Animal.insertMany(animals);
  console.log(`✅ Seeded ${animals.length} animals into the database.`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
