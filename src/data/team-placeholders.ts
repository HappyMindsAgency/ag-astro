import type { TeamMember } from '../types/content';

// TODO Strapi: sostituire questi membri e testi provvisori con i dati di Strapi ed eliminare questo commento.
const leadershipBiography = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut accumsan magna vitae vestibulum efficitur. Sed ligula enim, tincidunt ut blandit in, porta consectetur orci. Donec in dignissim sem.';
const operationalBiography = `${leadershipBiography} Duis quis tortor congue, aliquet ante sit amet, vestibulum quam. Proin quis porttitor mauris.`;
export const leadershipPlaceholder: TeamMember[] = [
  { firstName: 'Rossano', lastName: 'Ruggeri', role: 'Presidente', portrait: 'rossano-ruggeri' },
  { firstName: 'Sabrina', lastName: 'Numa', role: 'Amministratore Delegato', portrait: 'sabrina-numa' },
  { firstName: 'Marco', lastName: 'Montefameglio', role: 'Amministratore Delegato', portrait: 'marco-montefameglio' },
].map(({ portrait, ...member }) => ({
  ...member,
  biography: leadershipBiography,
  expertise: 'Amministrazione fiduciaria · Operazioni straordinarie · Fiscalità internazionale · Trust · Antiriciclaggio',
  image: { src: `/assets/immagini/team/${portrait}.webp`, alt: `${member.firstName} ${member.lastName}`, width: 526, height: 1248 },
  relatedArticle: { title: 'Governance patrimoniale e responsabilità nel tempo', href: '/ag-informa/' },
}));
export const operationalPlaceholder: TeamMember[] = [
  { firstName: 'Beatrice', lastName: 'Montefameglio', portrait: 'beatrice-montefameglio', expertise: 'Trust · Trustee · Pianificazione', email: 'b.montefameglio@agtrustees.it' },
  { firstName: 'Francesco', lastName: 'Di Corcia', portrait: 'francesco-di-corcia', expertise: 'Front office · Pratiche telematiche · Supporto clienti', email: 'f.dicorcia@agtrustees.it' },
  { firstName: 'Sonia', lastName: 'Franchini', portrait: 'sonia-franchini', expertise: 'Front office · Pratiche telematiche · Supporto clienti', email: 's.franchini@agtrustees.it' },
  { firstName: 'Ilaria', lastName: 'Monetti', portrait: 'ilaria-monetti', expertise: 'Mandati fiduciari · Amministrazione · Rapporti bancari · Back office', email: 'i.monetti@agtrustees.it' },
  { firstName: 'Silvia', lastName: 'Vaccari', portrait: 'silvia-vaccari', expertise: 'Trust · Trustee · Pianificazione', email: 's.vaccari@agtrustees.it' },
  { firstName: 'Michela', lastName: '', portrait: 'michela', expertise: 'Trust · Trustee · Pianificazione', email: 'michela@agtrustees.it' },
].map(({ portrait, ...member }) => ({
  ...member,
  role: 'Ruolo',
  biography: operationalBiography,
  image: { src: `/assets/immagini/team/${portrait}.webp`, alt: ['Sonia', 'Michela'].includes(member.firstName) ? '' : `${member.firstName} ${member.lastName}`, width: 584, height: 1086 },
}));
export const counselPlaceholder: TeamMember[] = [
  { firstName: 'Antonella', lastName: 'Vannacci', portrait: 'antonella-vannacci' },
  { firstName: 'Giuseppina', lastName: 'Ranzenigo', portrait: 'giuseppina-ranzenigo' },
  { firstName: 'Maria Grazia', lastName: 'Monegati', portrait: 'maria-grazia-monegati' },
  { firstName: 'Igor', lastName: 'Valas', portrait: 'igor-valas' },
  { firstName: 'Fabrizio', lastName: 'Vedana', portrait: 'fabrizio-vedana' },
].map(({ portrait, ...member }) => ({
  ...member,
  role: 'Ruolo',
  image: { src: `/assets/immagini/team/${portrait}.webp`, alt: member.firstName === 'Giuseppina' ? '' : `${member.firstName} ${member.lastName}`, width: 322, height: 513 },
}));
