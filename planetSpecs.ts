export interface Planet {
    name: string;
    size: number;
    color: number;
    distance: number;
    speedFactor: number;
  }
  
export const planets: Array<Planet> = [
    {
      name: 'sun',
      size: 10,
      color: 0xF4E99B,
      distance: 0,
      speedFactor: 1,
    },
    {
      name: 'mercury',
      size: 1,
      color: 0x1a1a1a,
      distance: 20,
      speedFactor: 1 / .241,
    },
    {
      name: 'venus',
      size: 2,
      color: 0xe6e6e6,
      distance: 25,
      speedFactor: 1 / .615,
    },
    {
      name: 'earth',
      size: 2,
      color: 0x2f6a69,
      distance: 35,
      speedFactor: 1,
    },
    {
      name: 'mars',
      size: 1,
      color: 0x993d00,
      distance: 45,
      speedFactor: 1 / 1.881,
    },
    {
      name: 'jupiter',
      size: 5,
      color: 0xb07f35,
      distance: 60,
      speedFactor: 1 / 11.862,
    },
    {
      name: 'saturn',
      size: 4,
      color: 0xb08f36,
      distance: 75,
      speedFactor: 1 / 29.458,
    },
    {
      name: 'uranus',
      size: 3,
      color: 0x5580aa,
      distance: 85,
      speedFactor: 1 / 84.014,
    },
    {
      name: 'neptune',
      size: 3,
      color: 0x366896,
      distance: 95,
      speedFactor: 1 / 164.793,
    },
];