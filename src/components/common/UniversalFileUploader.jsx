import React, { useState, useEffect, useRef } from 'react';
import {
  MEDIA_TYPES,
  MAX_FILE_SIZES,
  ALLOWED_EXTENSIONS,
  formatFileSize,
  inferMediaType,
  getCanonicalProjectPath,
  validateFile,
} from '../../data/mediaStore';

/**
 * UniversalFileUploader
 *
 * Professional, high-contrast local file upload component supporting Images, Documents, and Videos.
 * Handles drag-and-drop, browser file picking, validation, aspect-ratio-preserving previews,
 * metadata extraction (dimensions, duration), and safe Object URL memory cleanup.
 */
export function UniversalFileUploader({
  onFileSelected,
  onFileRemoved,
  acceptedType = 'all', // 'all' | 'image' | 'document' | 'video'
  initialValue = null,
  label = 'Select or Upload Local File',
  helpText = '',
  required = false,
  showPathCopy = true,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [metadata, setMetadata] = useState({ dimensions: null, duration: null });
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const fileInputRef = useRef(null);
  const activeBlobUrlRef = useRef(null);

  // Initialize from initialValue if provided
  useEffect(() => {
    if (initialValue && !selectedFile) {
      setPreviewUrl(initialValue.file_url || initialValue.path || initialValue.localPreviewUrl || null);
      setMediaType(initialValue.media_type || initialValue.type || 'document');
      setSelectedFile({
        name: initialValue.file_name || initialValue.filename || 'Existing Project Asset',
        size: initialValue.file_size_bytes || null,
        formattedSize: initialValue.file_size || initialValue.fileSizeFormatted || '—',
        projectPath: initialValue.path || initialValue.file_url || '',
      });
      if (initialValue.dimensions) {
        setMetadata((prev) => ({ ...prev, dimensions: initialValue.dimensions }));
      }
      if (initialValue.duration) {
        setMetadata((prev) => ({ ...prev, duration: initialValue.duration }));
      }
    }
  }, [initialValue]);

  // Clean up Object URL on component unmount
  useEffect(() => {
    return () => {
      if (activeBlobUrlRef.current && activeBlobUrlRef.current.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(activeBlobUrlRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  function revokeCurrentBlob() {
    if (activeBlobUrlRef.current && activeBlobUrlRef.current.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      } catch {
        // ignore
      }
      activeBlobUrlRef.current = null;
    }
  }

  function handleFileProcessing(file) {
    if (!file) return;
    setError('');

    // Validate file
    const validation = validateFile(file, acceptedType);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Revoke previous blob if any
    revokeCurrentBlob();

    // Create fresh object URL
    const blobUrl = URL.createObjectURL(file);
    activeBlobUrlRef.current = blobUrl;

    const detectedType = validation.detectedType;
    const formattedSize = formatFileSize(file.size);
    const projectPath = getCanonicalProjectPath(file.name, detectedType);

    setPreviewUrl(blobUrl);
    setMediaType(detectedType);
    setSelectedFile({
      rawFile: file,
      name: file.name,
      size: file.size,
      formattedSize,
      projectPath,
      mimeType: file.type,
    });

    // Reset metadata
    setMetadata({ dimensions: null, duration: null });

    // Extract Dimensions for Images
    if (detectedType === MEDIA_TYPES.IMAGE) {
      const img = new Image();
      img.onload = () => {
        const dims = { width: img.naturalWidth, height: img.naturalHeight };
        setMetadata((prev) => ({ ...prev, dimensions: dims }));
        notifyParent(file, detectedType, formattedSize, projectPath, blobUrl, dims, null);
      };
      img.onerror = () => {
        notifyParent(file, detectedType, formattedSize, projectPath, blobUrl, null, null);
      };
      img.src = blobUrl;
    } else {
      notifyParent(file, detectedType, formattedSize, projectPath, blobUrl, null, null);
    }
  }

  function notifyParent(file, type, formattedSize, projectPath, blobUrl, dimensions, duration) {
    if (onFileSelected) {
      onFileSelected({
        file,
        filename: file.name,
        size: file.size,
        fileSizeFormatted: formattedSize,
        type,
        mimeType: file.type,
        localPreviewUrl: blobUrl,
        path: projectPath,
        dimensions,
        duration,
        isProjectAsset: false,
      });
    }
  }

  function handleVideoMetadata(e) {
    const video = e.target;
    if (!video) return;
    const seconds = Math.floor(video.duration || 0);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedDuration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const dims = { width: video.videoWidth, height: video.videoHeight };

    setMetadata({
      dimensions: dims,
      duration: formattedDuration,
    });

    if (selectedFile?.rawFile && onFileSelected) {
      onFileSelected({
        file: selectedFile.rawFile,
        filename: selectedFile.name,
        size: selectedFile.size,
        fileSizeFormatted: selectedFile.formattedSize,
        type: MEDIA_TYPES.VIDEO,
        mimeType: selectedFile.mimeType,
        localPreviewUrl: previewUrl,
        path: selectedFile.projectPath,
        dimensions: dims,
        duration: formattedDuration,
        isProjectAsset: false,
      });
    }
  }

  function handleRemove(e) {
    e?.stopPropagation();
    revokeCurrentBlob();
    setSelectedFile(null);
    setPreviewUrl(null);
    setMediaType(null);
    setMetadata({ dimensions: null, duration: null });
    setError('');
    setShowPdfPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileRemoved) {
      onFileRemoved();
    }
  }

  function handleReplace(e) {
    e?.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleCopyPath(e) {
    e?.stopPropagation();
    if (selectedFile?.projectPath) {
      navigator.clipboard.writeText(selectedFile.projectPath).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  // Determine accepted extensions attribute
  function getAcceptString() {
    switch (acceptedType) {
      case 'image':
        return ALLOWED_EXTENSIONS.image.join(',');
      case 'video':
        return ALLOWED_EXTENSIONS.video.join(',');
      case 'document':
        return ALLOWED_EXTENSIONS.document.join(',');
      default:
        return [
          ...ALLOWED_EXTENSIONS.image,
          ...ALLOWED_EXTENSIONS.document,
          ...ALLOWED_EXTENSIONS.video,
        ].join(',');
    }
  }

  const isPdf = selectedFile?.name?.toLowerCase().endsWith('.pdf') || selectedFile?.mimeType === 'application/pdf';

  return (
    <div className="universal-file-uploader-container mb-4">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="form-label font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
            {label} {required && <span className="text-danger">*</span>}
          </label>
          {helpText && <span className="text-xs text-muted">{helpText}</span>}
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcessing(e.target.files[0]);
          }
        }}
      />

      {/* Error state */}
      {error && (
        <div
          className="p-3 mb-3 text-sm rounded flex items-start justify-between"
          style={{
            background: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            border: '1px solid var(--color-error-border)',
          }}
        >
          <span>⚠️ {error}</span>
          <button
            type="button"
            className="text-xs font-bold ml-2 underline"
            onClick={() => setError('')}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Selected File State with Live Preview */}
      {selectedFile && previewUrl ? (
        <div
          className="uploader-selected-preview-card p-4 rounded-md"
          style={{
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          {/* Header row: Status chip, controls */}
          <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <span
                className="badge"
                style={{
                  background: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  border: '1px solid var(--color-success-border)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                ✓ File Attached
              </span>
              <span className="text-xs text-muted font-mono">
                {mediaType?.toUpperCase() || 'FILE'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {showPathCopy && selectedFile.projectPath && (
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={handleCopyPath}
                  title="Copy relative project asset path"
                >
                  {copied ? '✓ Path Copied!' : '📋 Copy Path'}
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={handleReplace}
              >
                Replace
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-xs"
                onClick={handleRemove}
              >
                Remove ✕
              </button>
            </div>
          </div>

          {/* Media Previews */}
          <div className="uploader-preview-body my-3">
            {/* IMAGE PREVIEW */}
            {mediaType === MEDIA_TYPES.IMAGE && (
              <div
                className="image-preview-wrapper flex items-center justify-center p-2 rounded"
                style={{
                  background: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)',
                  maxHeight: '340px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={previewUrl}
                  alt={selectedFile.name}
                  style={{
                    maxHeight: '320px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-xs)',
                  }}
                />
              </div>
            )}

            {/* VIDEO PREVIEW */}
            {mediaType === MEDIA_TYPES.VIDEO && (
              <div
                className="video-preview-wrapper rounded p-2"
                style={{
                  background: '#0f172a',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}
              >
                <video
                  src={previewUrl}
                  controls
                  onLoadedMetadata={handleVideoMetadata}
                  style={{
                    maxHeight: '320px',
                    maxWidth: '100%',
                    borderRadius: 'var(--radius-xs)',
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* DOCUMENT PREVIEW */}
            {mediaType === MEDIA_TYPES.DOCUMENT && (
              <div className="document-preview-block">
                <div
                  className="flex items-center gap-3 p-3 rounded"
                  style={{ background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}
                >
                  <span style={{ fontSize: '2rem' }}>
                    {isPdf ? '📕' : selectedFile.name.endsWith('.doc') || selectedFile.name.endsWith('.docx') ? '📘' : '📄'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      Size: {selectedFile.formattedSize} • Target: <code className="font-mono">{selectedFile.projectPath}</code>
                    </div>
                  </div>
                  {isPdf && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => setShowPdfPreview(!showPdfPreview)}
                    >
                      {showPdfPreview ? 'Hide Preview' : 'Preview PDF ↗'}
                    </button>
                  )}
                </div>

                {isPdf && showPdfPreview && (
                  <div
                    className="pdf-preview-embed mt-3 rounded overflow-hidden"
                    style={{ border: '1px solid var(--color-border)', height: '420px' }}
                  >
                    <iframe
                      src={previewUrl}
                      title="PDF Preview"
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metadata Footer */}
          <div className="flex flex-wrap items-center justify-between text-xs text-muted pt-2" style={{ borderTop: '1px dashed var(--color-border)' }}>
            <div className="flex items-center gap-3">
              <span><strong>File:</strong> {selectedFile.name}</span>
              <span><strong>Size:</strong> {selectedFile.formattedSize}</span>
              {metadata.dimensions && (
                <span><strong>Resolution:</strong> {metadata.dimensions.width} × {metadata.dimensions.height} px</span>
              )}
              {metadata.duration && (
                <span><strong>Duration:</strong> {metadata.duration}</span>
              )}
            </div>
            <div className="font-mono text-xs" style={{ color: 'var(--color-primary)' }}>
              Target: {selectedFile.projectPath}
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Dropzone State */
        <div
          className={`file-upload-dropzone ${dragOver ? 'dragover' : ''}`}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileProcessing(e.dataTransfer.files[0]);
            }
          }}
          style={{
            border: '2px dashed var(--color-border-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            backgroundColor: dragOver ? 'var(--color-accent-subtle)' : 'var(--color-surface-subtle)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div className="file-upload-icon mb-2" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
            {acceptedType === 'image' ? '🖼️' : acceptedType === 'video' ? '🎥' : acceptedType === 'document' ? '📄' : '📁'}
          </div>

          <div className="font-semibold text-base mb-1" style={{ color: 'var(--color-text)' }}>
            Drag &amp; drop file here, or click to browse
          </div>

          <p className="text-xs text-muted mb-3">
            Select an asset directly from your local computer to use in your portfolio.
          </p>

          <button
            type="button"
            className="btn btn-secondary btn-sm inline-block"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current && fileInputRef.current.click();
            }}
          >
            Browse Files from Computer
          </button>

          <div className="mt-4 pt-3 flex flex-wrap justify-center gap-2 text-xs text-muted" style={{ borderTop: '1px dashed var(--color-border)' }}>
            <span className="badge" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              🖼️ Images: JPG, PNG, WebP, SVG (Max 15MB)
            </span>
            <span className="badge" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              📄 Docs: PDF, DOCX, PPTX, XLSX (Max 25MB)
            </span>
            <span className="badge" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              🎥 Video: MP4, WebM (Max 50MB)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UniversalFileUploader;
