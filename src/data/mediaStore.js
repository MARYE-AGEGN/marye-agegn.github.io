/**
 * Scalable Local Media & Document Store
 *
 * Implements an honest client-side media management system for static hosting (Vite / React / GitHub Pages / Vercel).
 * Separates browser session memory/previews from physical project asset deployment.
 */

const STORAGE_KEY = 'marye_media_library';

export const MEDIA_TYPES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video',
};

export const MAX_FILE_SIZES = {
  image: 15 * 1024 * 1024, // 15 MB
  document: 25 * 1024 * 1024, // 25 MB
  video: 50 * 1024 * 1024, // 50 MB
};

export const ALLOWED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
  document: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt'],
  video: ['.mp4', '.webm'],
};

export const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.js', '.jsx', '.ts', '.tsx',
  '.html', '.htm', '.php', '.py', '.env', '.vbs', '.msi', '.cgi'
];

/**
 * Format bytes into human readable string
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Determine media category from filename and mimeType
 */
export function inferMediaType(file) {
  const extension = `.${file.name.split('.').pop().toLowerCase()}`;
  if (ALLOWED_EXTENSIONS.image.includes(extension) || file.type.startsWith('image/')) {
    return MEDIA_TYPES.IMAGE;
  }
  if (ALLOWED_EXTENSIONS.video.includes(extension) || file.type.startsWith('video/')) {
    return MEDIA_TYPES.VIDEO;
  }
  if (ALLOWED_EXTENSIONS.document.includes(extension) || file.type.startsWith('application/') || file.type.startsWith('text/')) {
    return MEDIA_TYPES.DOCUMENT;
  }
  return null;
}

/**
 * Determine canonical project asset path
 */
export function getCanonicalProjectPath(filename, mediaType) {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  switch (mediaType) {
    case MEDIA_TYPES.IMAGE:
      return `/assets/images/${sanitized}`;
    case MEDIA_TYPES.VIDEO:
      return `/assets/videos/${sanitized}`;
    case MEDIA_TYPES.DOCUMENT:
    default:
      return `/assets/documents/${sanitized}`;
  }
}

/**
 * Validate selected file against security rules, allowed extensions, and size limits
 */
export function validateFile(file, expectedType = null) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const extension = `.${file.name.split('.').pop().toLowerCase()}`;

  // Security check: reject executable or dangerous script extensions
  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Security violation: File extension "${extension}" is not permitted for upload.`
    };
  }

  const detectedType = inferMediaType(file);
  if (!detectedType) {
    return {
      valid: false,
      error: `Unsupported file format: "${file.name}". Allowed types: Images (JPG, PNG, WebP, SVG), Documents (PDF, DOCX, PPTX, XLSX), Videos (MP4, WebM).`
    };
  }

  if (expectedType && expectedType !== 'all' && detectedType !== expectedType) {
    return {
      valid: false,
      error: `Expected a ${expectedType} file, but detected ${detectedType}.`
    };
  }

  // Size limit validation
  const maxSize = MAX_FILE_SIZES[detectedType] || 25 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File exceeds maximum size of ${formatFileSize(maxSize)} (selected size: ${formatFileSize(file.size)}).`
    };
  }

  return { valid: true, detectedType };
}

/**
 * Pre-populate initial media items from verified project documents & media
 */
const INITIAL_SEED_ITEMS = [
  {
    id: 'seed-doc-cv',
    filename: 'Marye_Agegn_Academic_CV.pdf',
    title: 'Academic Curriculum Vitae — Marye Agegn',
    type: MEDIA_TYPES.DOCUMENT,
    mimeType: 'application/pdf',
    category: 'CV',
    size: 245760,
    fileSizeFormatted: '240 KB',
    path: '/assets/documents/Marye_Agegn_Academic_CV.pdf',
    localPreviewUrl: './assets/documents/Marye_Agegn_Academic_CV.pdf',
    altText: 'Official Academic Curriculum Vitae of Marye Agegn',
    description: 'Current verified academic CV detailing clinical engineering background and M.Eng research at Anna University.',
    isProjectAsset: true,
    created_at: '2025-08-20T10:00:00Z',
  },
  {
    id: 'seed-doc-capstone',
    filename: 'rTMS_Capstone_Summary_Marye_Agegn.pdf',
    title: 'Undergraduate Capstone Summary — Low-Cost rTMS System',
    type: MEDIA_TYPES.DOCUMENT,
    mimeType: 'application/pdf',
    category: 'Report',
    size: 389120,
    fileSizeFormatted: '380 KB',
    path: '/assets/documents/rTMS_Capstone_Summary_Marye_Agegn.pdf',
    localPreviewUrl: './assets/documents/rTMS_Capstone_Summary_Marye_Agegn.pdf',
    altText: 'Technical Summary of rTMS Undergraduate Capstone Thesis',
    description: 'Design summary of high-voltage capacitor-discharge circuit and magnetic coils for low-resource clinics.',
    isProjectAsset: true,
    created_at: '2021-07-15T12:00:00Z',
  },
  {
    id: 'seed-img-profile',
    filename: 'marye-agegn-profile.jpg',
    title: 'Marye Agegn — Academic Profile Portrait',
    type: MEDIA_TYPES.IMAGE,
    mimeType: 'image/jpeg',
    category: 'General',
    size: 201753,
    fileSizeFormatted: '197 KB',
    path: '/assets/images/marye-agegn-profile.jpg',
    localPreviewUrl: './assets/images/marye-agegn-profile.jpg',
    dimensions: { width: 540, height: 1200 },
    altText: 'Marye Agegn, Graduate Researcher in Biomedical Engineering at Anna University',
    description: 'Official academic profile portrait of Marye Agegn.',
    isProjectAsset: true,
    created_at: '2025-08-01T10:00:00Z',
  },
  {
    id: 'seed-img-clinical',
    filename: 'marye-agegn-clinical.jpg',
    title: 'Marye Agegn — Clinical Engineering & Hospital Operations',
    type: MEDIA_TYPES.IMAGE,
    mimeType: 'image/jpeg',
    category: 'Clinical',
    size: 97152,
    fileSizeFormatted: '95 KB',
    path: '/assets/images/marye-agegn-clinical.jpg',
    localPreviewUrl: './assets/images/marye-agegn-clinical.jpg',
    dimensions: { width: 768, height: 1024 },
    altText: 'Marye Agegn standing in clinical healthcare facility corridor during hospital engineering practice',
    description: 'Photograph documenting Marye Agegn during hospital clinical engineering and technology management practice.',
    isProjectAsset: true,
    created_at: '2025-08-01T10:00:00Z',
  },
  {
    id: 'seed-img-bhn-logo',
    filename: 'bhn-logo.jpg',
    title: 'Biomedical Horizon Network (BHN) Logo',
    type: MEDIA_TYPES.IMAGE,
    mimeType: 'image/jpeg',
    category: 'Project',
    size: 66455,
    fileSizeFormatted: '65 KB',
    path: '/assets/images/bhn-logo.jpg',
    localPreviewUrl: './assets/images/bhn-logo.jpg',
    dimensions: { width: 1024, height: 1024 },
    altText: 'Biomedical Horizon Network (BHN) Emblem — Enabling Impossible',
    description: 'Official initiative brand emblem and logo for Biomedical Horizon Network.',
    isProjectAsset: true,
    created_at: '2025-08-01T10:00:00Z',
  },
  {
    id: 'seed-img-brand-banner',
    filename: 'marye-agegn-brand-banner.jpg',
    title: 'Marye Agegn Gebrie — Brand Emblem & Banner',
    type: MEDIA_TYPES.IMAGE,
    mimeType: 'image/jpeg',
    category: 'General',
    size: 112493,
    fileSizeFormatted: '110 KB',
    path: '/assets/images/marye-agegn-brand-banner.jpg',
    localPreviewUrl: './assets/images/marye-agegn-brand-banner.jpg',
    dimensions: { width: 1024, height: 576 },
    altText: 'Marye Agegn Gebrie — Innovator & Professional Personal Brand Monogram',
    description: 'Personal brand signature banner and emblem with stylized monogram.',
    isProjectAsset: true,
    created_at: '2025-08-01T10:00:00Z',
  },
  {
    id: 'seed-video-rtms',
    filename: 'rtms-circuit-topology.mp4',
    title: 'rTMS Circuit Topology & Magnetic Field Modeling Demo',
    type: MEDIA_TYPES.VIDEO,
    mimeType: 'video/mp4',
    category: 'Research',
    size: 14680064,
    fileSizeFormatted: '14.0 MB',
    path: '/assets/videos/rtms-circuit-topology.mp4',
    localPreviewUrl: './assets/media/rtms-circuit-topology.mp4',
    duration: '04:12',
    altText: 'Presentation on rTMS circuit topology and pulse discharge waveforms',
    description: 'Demonstration and technical explanation of pulse power circuit and magnetic field simulations.',
    isProjectAsset: true,
    created_at: '2025-06-10T14:00:00Z',
  }
];

/**
 * Retrieve all items from the Media Library
 */
export function getMediaLibrary() {
  if (typeof window === 'undefined') return INITIAL_SEED_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_ITEMS));
      return INITIAL_SEED_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_SEED_ITEMS;
    // Ensure all seed items exist in the library
    const existingIds = new Set(parsed.map((p) => p.id));
    const missingSeeds = INITIAL_SEED_ITEMS.filter((s) => !existingIds.has(s.id));
    if (missingSeeds.length > 0) {
      const merged = [...missingSeeds, ...parsed];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (err) {
    console.warn('Error reading media library from localStorage:', err);
    return INITIAL_SEED_ITEMS;
  }
}

/**
 * Save or update an item in the Media Library
 */
export function saveMediaLibraryItem(item) {
  const current = getMediaLibrary();
  let updated;
  if (item.id && current.some((m) => m.id === item.id)) {
    updated = current.map((m) => (m.id === item.id ? { ...m, ...item, updated_at: new Date().toISOString() } : m));
  } else {
    const newItem = {
      ...item,
      id: item.id || `media-${Date.now()}`,
      created_at: item.created_at || new Date().toISOString(),
    };
    updated = [newItem, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving media library item:', err);
  }
  return updated;
}

/**
 * Delete an item from the Media Library
 */
export function deleteMediaLibraryItem(id) {
  const current = getMediaLibrary();
  const target = current.find((m) => m.id === id);

  // Revoke object URL if it was an active local blob
  if (target?.localPreviewUrl && target.localPreviewUrl.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(target.localPreviewUrl);
    } catch {
      // ignore
    }
  }

  const filtered = current.filter((m) => m.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Error deleting media library item:', err);
  }
  return filtered;
}

/**
 * Verify whether an asset physically exists in the public asset structure via HEAD fetch
 */
export async function verifyProjectAssetPresence(assetPath) {
  if (!assetPath) return false;
  try {
    const response = await fetch(assetPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
