export const COLLECTIONS = {
  software: "Software",
  etree: "Concerts",
  image: "Images",
  texts: "Books & Texts",
  audio: "Audio",
  movies: "Videos",
};

export const YEARS = Array.from(
  { length: 2025 - 1980 },
  (_, i) => 1980 + i
).reverse();

export async function fetchArchiveItems(year, collection, mode, theme) {
  try {
    const queryYear = year || YEARS[Math.floor(Math.random() * YEARS.length)];
    let query = "";

    if (mode === "vintagetube") {
      // VintageTube – historical videos: commercials, newsreels, documentaries.
      query = `mediatype:movies AND (commercial OR newsreel OR documentary)`;
      if (year) query += ` AND year:${queryYear}`;
    } else if (mode === "lostmedia") {
      // Lost Media Explorer – look for items described as lost, forgotten, or obscure.
      query = `(lost OR forgotten OR obscure OR "lost media")`;
      if (collection) query += ` AND mediatype:${collection}`;
      if (year) query += ` AND year:${queryYear}`;
    } else if (mode === "deepdive") {
      // Deep Dive Mode – use the free text theme input (default to "internet" if blank).
      const themeKeyword = theme || "internet";
      query = `${themeKeyword}`;
      if (collection) query += ` AND mediatype:${collection}`;
      if (year) query += ` AND year:${queryYear}`;
      query += ` AND (_exists_:thumbs OR format:(MP4 OR JPEG OR GIF OR PNG))`;
    } else {
      // Default mode – random content using year and (optionally) collection.
      query = `year:${queryYear}`;
      if (collection) query += ` AND mediatype:${collection}`;
      query += ` AND (_exists_:thumbs OR format:(MP4 OR JPEG OR GIF OR PNG))`;
    }

    const queryParams = new URLSearchParams({
      q: query,
      fl: "identifier,title,year,description,mediatype,thumbs,downloads,format",
      sort: "random",
      rows: "1",
      page: Math.floor(Math.random() * 100).toString(),
      output: "json",
    });

    const response = await fetch(
      `https://archive.org/advancedsearch.php?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return {
      items: data.response.docs,
      total: data.response.numFound,
    };
  } catch (error) {
    console.error("Error fetching from Archive:", error);
    return { items: [], total: 0 };
  }
}

export function getImageUrl(identifier) {
  return `https://archive.org/services/img/${identifier}`;
}
