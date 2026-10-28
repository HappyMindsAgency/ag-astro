import type { TeamMember } from '../types/content';
import { getCollectionDocuments } from './strapi-client';

export type Ruolo = 'Direttivo' | 'Operativo' | 'Consulente';

const toMember = ({ nome, titolo, descrizione, ambito, email, immagine, autori }: any): TeamMember => {
  // ponytail: divide al primo spazio, sbaglia con i nomi doppi ("Maria Grazia"); serve un campo cognome in Strapi
  const [firstName, ...lastName] = nome.trim().split(/\s+/);
  const article = autori?.articolis?.[0];
  return {
    firstName,
    lastName: lastName.join(' '),
    role: titolo ?? undefined,
    biography: descrizione?.map((block: any) => block.children?.map((child: any) => child.text).join('')).join('\n') || undefined,
    expertise: ambito ?? undefined,
    email: email ?? undefined,
    image: immagine && { src: immagine.url, alt: immagine.alternativeText ?? nome, width: immagine.width, height: immagine.height },
    // Il link resta italiano: TeamMemberCard lo localizza.
    relatedArticle: article && { title: article.titolo, href: `/ag-informa/${article.slug}/` },
  };
};

// Restituisce i membri del team di una lingua, divisi per ruolo e ordinati per `ordine`.
export async function getTeamByRuolo(locale: 'it-IT' | 'en'): Promise<Record<Ruolo, TeamMember[]>> {
  const { data } = await getCollectionDocuments('teams', {
    locale,
    sort: ['ordine:asc'],
    populate: { immagine: true, autori: { populate: { articolis: { fields: ['titolo', 'slug'] } } } },
  });
  const byRuolo = (ruolo: Ruolo) => data.filter((item) => item.ruolo === ruolo).map(toMember);
  return { Direttivo: byRuolo('Direttivo'), Operativo: byRuolo('Operativo'), Consulente: byRuolo('Consulente') };
}
