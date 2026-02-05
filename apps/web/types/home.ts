import { StaticImageData } from "next/image";

export type Stat = {
  id: string;
  title: string;
  stat: number;
  suffix: string;
};

export interface Event {
  id: string;
  title: string;
  image: StaticImageData;
  description?: string;
  date?: string;
  location?: string;
  link?: string;
}

export type Sponsor = {
  name: string;
  logo: StaticImageData;
  type?: string;
  link?: string;
};

export type QandA = {
  id: string;
  question: string;
  answer: string;
};
