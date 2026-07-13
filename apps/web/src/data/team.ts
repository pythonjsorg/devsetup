import type { ImageMetadata } from 'astro';
import adityaSuthar from '../assets/team/aditya-suthar.jpeg';
import sanjayModi from '../assets/team/sanjay-modi.jpeg';
import kiranJoshi from '../assets/team/kiran-joshi.jpeg';
import bharatSwami from '../assets/team/bharat-swami.jpeg';
import pinkuKumar from '../assets/team/pinku-kumar.jpeg';

export interface Member {
  name: string;
  role: string;
  img?: ImageMetadata;
  pos?: string; // object-position for the photo crop
}

// Single source of truth — consumed by the homepage teaser (first 4) and the /team page (all).
export const members: Member[] = [
  { name: 'Full-stack Dev', role: 'web · apps' }, // 1 — free (placeholder)
  { name: 'Aditya Suthar', role: 'backend · infra', img: adityaSuthar, pos: 'center 52%' },
  { name: 'Kiran Joshi', role: 'SEO · ASO · content writer', img: kiranJoshi, pos: 'center 38%' },
  { name: 'Sanjay Modi', role: 'automation · data · bots', img: sanjayModi },
  { name: 'Bharat Swami', role: 'backend · apis', img: bharatSwami },
  { name: 'Pinku Kumar', role: 'frontend · apps', img: pinkuKumar, pos: 'center 22%' },
  { name: 'Product Designer', role: 'ui · brand' },
  { name: 'DevOps', role: 'cloud · ci/cd' },
];
