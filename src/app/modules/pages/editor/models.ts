/**
 * TODO: also accept null values for title, description and url
 */
export interface MetaMapperData {
  title: string;
  description: string;
  image?: string | null;
  iconUrl?: string | null;
  url: string;
}
