/**
 * The domain object
 *
 * TODO: also accept null values for title, description and url
 */
export interface MetaMapperData {
  title: string;
  description: string;
  image?: string | null;
  iconUrl?: string | null;
  url: string;
  displayPrice?: string | null;
  otherTexts?: string[]; // TODO: this should also have a position {text: 'lorem', position: 'pos1'}, to found the correct position in preset
  otherImages?: string[];
}
