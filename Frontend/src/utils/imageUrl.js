const apiUrl = import.meta.env.VITE_API_URL || "https://slamcorps.onrender.com";

export function getImageUrl(imagePath) {
  if (!imagePath) {
    return `${import.meta.env.BASE_URL}placeholder.jpg`;
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads/")) {
    return `${apiUrl}${imagePath}`;
  }

  return `${import.meta.env.BASE_URL}${imagePath.replace(/^\/+/, "")}`;
}
