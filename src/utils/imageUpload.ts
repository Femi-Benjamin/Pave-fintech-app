export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

/** Returns an error message, or "" when the image may be uploaded (JPG/PNG, max 5MB). */
export function validateImageUpload(file: {
  size: number;
  type?: string;
}): string {
  if (!file.size) return "That file is empty.";
  if (!file.type || !ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return "Please choose a JPG or PNG image.";
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return "Image is too large. The maximum size is 5MB.";
  }
  return "";
}
