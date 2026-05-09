const adjectives = [
  "lazy", "crazy", "sleepy", "angry", "disco", "chaotic", "sneaky", "crying", "turbo", "zombie",
  "spicy", "floating", "ninja", "grumpy", "melted", "suspicious", "funky", "confused", "ghostly", "radioactive",
  "screaming", "depressed", "kungfu", "cosmic", "neon", "pixel", "retro", "cyber", "quantum", "hyper",
  "chill", "toxic", "mystic", "heavy", "astral", "binary", "static", "void", "solar", "lunar",
  "rogue", "mecha", "sonic", "glitchy", "savage", "magical", "cursed", "epic", "sad", "happy"
];

const nouns = [
  "panda", "popsicle", "cat", "toaster", "broccoli", "pickle", "wizard", "muffin", "banana", "nugget",
  "pigeon", "lollipop", "meow", "samosa", "cupcake", "taco", "penguin", "idli", "waffle", "potato",
  "donut", "mango", "noodlesaurus", "espresso", "biscuit", "marshmallow", "papaya", "ferret", "goblin", "cyborg",
  "hacker", "phantom", "samurai", "gremlin", "raptor", "yeti", "gargoyle", "squid", "burrito", "noodle",
  "glitch", "wombat", "vortex", "matrix", "robot", "dragon", "cactus", "koala", "corgi", "platypus"
];

export const generateUsername = (identifier: string): string => {
  if (!identifier) return "unknown_entity";

  // Convert the unique identifier (email or ID) into a reliable numeric hash
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Force positive integer
  hash = Math.abs(hash);

  // Extract two distinct indices based on the hash (0-49)
  const adjIndex = hash % 50;
  const nounIndex = Math.floor(hash / 50) % 50;

  return `${adjectives[adjIndex]}_${nouns[nounIndex]}`;
};