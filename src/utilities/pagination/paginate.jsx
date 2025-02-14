import _ from 'lodash';

export function Paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;
  return _(items) // Wraps the array with Lodash
    .slice(startIndex) // Skips items before the start index
    .take(pageSize) // Extracts only the number of items per page
    .value(); // Converts Lodash wrapper back to an array
}
