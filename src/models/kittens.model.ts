export class KittenModel {
  id: string | null;
  name: string;
  age: number;
  image_url: string | null;
  breed: string;
  vaccinations: {
    type: string;
    date: Date;
  }[];

  constructor(kitten: Kitten) {
    this.id = kitten._id;
    this.name = kitten.name;
    this.age = kitten.age;
    this.breed = kitten.breed;
    this.image_url = `images/${kitten.image_url}`;
    this.vaccinations = kitten.vaccinations;
  }
}

export interface Kitten {
  _id: string | null;
  name: string;
  breed: string;
  age: number;
  image_url: string | null;
  vaccinations: {
    type: string;
    date: Date;
  }[];
}
