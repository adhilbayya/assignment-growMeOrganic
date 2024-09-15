export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export const fetchArtworks = async (
  page: number
): Promise<{ artworks: Artwork[]; totalRecords: number }> => {
  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${page}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch artworks");
  }
  const data = await response.json();

  const artworks = data.data.map((artwork: any) => ({
    id: artwork.id,
    title: artwork.title,
    place_of_origin: artwork.place_of_origin || "Unknown",
    artist_display: artwork.artist_display || "Unknown",
    inscriptions: artwork.inscriptions || "None",
    date_start: artwork.date_start || "Unknown",
    date_end: artwork.date_end || "Unknown",
  }));

  return { artworks, totalRecords: data.pagination.total };
};
