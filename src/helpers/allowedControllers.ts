import { 
    Collection,
  } from '../../generated/schema';
  
export function getOrCreateCollection(
  id: String,
  createIfNotFound: boolean = true,
): Collection {
  // @ts-ignore: assign wrapper object to primitive
  let collection = Collection.load(id);
  
  if (collection == null && createIfNotFound) {
    // @ts-ignore: assign wrapper object to primitive
    collection = new Collection(id);
  }
  
  return collection as Collection;
}