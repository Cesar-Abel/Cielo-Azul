import {readFileSync} from 'node:fs';
export const content=JSON.parse(readFileSync(new URL('../content.json',import.meta.url),'utf8'));
export const {agency,destinations,trips,socials}=content;
