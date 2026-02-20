// ═══════════════════════════════════════════════════════════════════════════
// KELYLO RESOURCES MANAGER - File Upload & Video Embedding System
// ═══════════════════════════════════════════════════════════════════════════

// ── IndexedDB Setup ──────────────────────────────────────────────────────────
let db = null;

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KelyloResources', 2);

    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      // Files store
      if (!database.objectStoreNames.contains('files')) {
        const filesStore = database.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
        filesStore.createIndex('skillId', 'skillId', { unique: false });
        filesStore.createIndex('uploadDate', 'uploadDate', { unique: false });
      }
      
      // Videos store
      if (!database.objectStoreNames.contains('videos')) {
        const videosStore = database.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
        videosStore.createIndex('skillId', 'skillId', { unique: false });
        videosStore.createIndex('addedDate', 'addedDate', { unique: false });
      }
    };
  });
};

// ── File Management ──────────────────────────────────────────────────────────

const saveFile = async (skillId, file) => {
  if (!db) await initDB();
  
  // Generate thumbnail if applicable
  const thumbnail = await generateThumbnail(file);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const fileData = {
        skillId,
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result,
        thumbnail: thumbnail,
        uploadDate: new Date().toISOString()
      };
      
      const transaction = db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.add(fileData);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

const getFiles = async (skillId) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readonly');
    const store = transaction.objectStore('files');
    const index = store.index('skillId');
    const request = index.getAll(skillId);
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

const deleteFile = async (fileId) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['files'], 'readwrite');
    const store = transaction.objectStore('files');
    const request = store.delete(fileId);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// ── Video Management ─────────────────────────────────────────────────────────

const parseVideoUrl = (url) => {
  // Handle iframe embed HTML - extract src URL
  if (url.includes('<iframe')) {
    const srcMatch = url.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      url = srcMatch[1];
    }
  }

  // Clean URL (remove whitespace)
  url = url.trim();

  // YouTube formats (handle all variations including playlists)
  // Examples:
  // - https://youtu.be/UtF6Jej8yb4?list=RDUtF6Jej8yb4
  // - https://www.youtube.com/watch?v=UtF6Jej8yb4
  // - https://www.youtube.com/embed/UtF6Jej8yb4?list=RDUtF6Jej8yb4
  // - https://m.youtube.com/watch?v=UtF6Jej8yb4
  // - https://youtube.com/shorts/UtF6Jej8yb4
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    
    // Extract playlist if present
    let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
    const listMatch = url.match(/[?&]list=([^&]+)/);
    if (listMatch) {
      embedUrl += `list=${listMatch[1]}&`;
    }
    
    // Add essential parameters for best viewer experience with full controls
    embedUrl += 'rel=0&modestbranding=1&controls=1&fs=1&autoplay=0&enablejsapi=1&playsinline=1';
    
    return {
      type: 'youtube',
      id: videoId,
      embedUrl: embedUrl,
      originalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  }
  
  // Vimeo formats
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0&controls=1`,
      originalUrl: `https://vimeo.com/${vimeoMatch[1]}`,
      thumbnail: null
    };
  }
  
  // Direct video files
  if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
    return {
      type: 'direct',
      id: null,
      embedUrl: url,
      originalUrl: url,
      thumbnail: null
    };
  }
  
  // Google Drive
  const driveRegex = /drive\.google\.com\/file\/d\/([^\/]+)/;
  const driveMatch = url.match(driveRegex);
  if (driveMatch) {
    return {
      type: 'gdrive',
      id: driveMatch[1],
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      originalUrl: `https://drive.google.com/file/d/${driveMatch[1]}/view`,
      thumbnail: null
    };
  }
  
  // Fallback: iframe embed
  return {
    type: 'iframe',
    id: null,
    embedUrl: url,
    originalUrl: url,
    thumbnail: null
  };
};

const saveVideo = async (skillId, url, title) => {
  if (!db) await initDB();
  
  // Simple parsing - no validation, just accept any URL
  let videoInfo;
  try {
    videoInfo = parseVideoUrl(url);
  } catch (error) {
    // If parsing fails, use the URL as-is (fallback to iframe)
    videoInfo = {
      type: 'iframe',
      id: null,
      embedUrl: url,
      originalUrl: url,
      thumbnail: null
    };
  }
  
  const videoData = {
    skillId,
    title: title || `Video ${new Date().toLocaleDateString()}`,
    originalUrl: url,
    ...videoInfo,
    addedDate: new Date().toISOString()
  };
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['videos'], 'readwrite');
    const store = transaction.objectStore('videos');
    const request = store.add(videoData);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => {
      console.error('IndexedDB error:', e.target.error);
      // Always resolve even if DB fails
      resolve(null);
    };
  });
};

const getVideos = async (skillId) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['videos'], 'readonly');
    const store = transaction.objectStore('videos');
    const index = store.index('skillId');
    const request = index.getAll(skillId);
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

const deleteVideo = async (videoId) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['videos'], 'readwrite');
    const store = transaction.objectStore('videos');
    const request = store.delete(videoId);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// ── Format File Size ─────────────────────────────────────────────────────────

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// ── Generate File Thumbnail ──────────────────────────────────────────────────

const generateThumbnail = async (file) => {
  return new Promise((resolve) => {
    // For images, create thumbnail
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxSize = 200;
          
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } 
    // For videos, capture first frame
    else if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          video.currentTime = 1; // Seek to 1 second
        };
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 200;
          canvas.height = (video.videoHeight / video.videoWidth) * 200;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        video.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    // For PDFs and documents, return null (will use icon instead)
    else {
      resolve(null);
    }
  });
};

// ── Open File in Viewer ──────────────────────────────────────────────────────

const openFileViewer = (fileData) => {
  // Create viewer URL with file data
  const viewerUrl = `file-viewer.html?id=${fileData.id}&name=${encodeURIComponent(fileData.name)}`;
  
  // Open in new tab
  const viewer = window.open(viewerUrl, '_blank');
  
  // Store file data temporarily for viewer to access
  sessionStorage.setItem(`file_${fileData.id}`, JSON.stringify(fileData));
  
  return viewer;
};

// ── Get YouTube Video ID from URL ────────────────────────────────────────────

const getYouTubeVideoId = (url) => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
};

// ── Convert YouTube URL to Embed ─────────────────────────────────────────────

const convertToYouTubeEmbed = (url) => {
  // If it's already an iframe, extract the src
  if (url.includes('<iframe')) {
    const srcMatch = url.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      url = srcMatch[1];
    }
  }
  
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  
  // Extract playlist if present
  let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
  const listMatch = url.match(/[?&]list=([^&]+)/);
  if (listMatch) {
    embedUrl += `list=${listMatch[1]}&`;
  }
  
  // Add controls for full functionality
  embedUrl += 'rel=0&modestbranding=1&controls=1&fs=1&enablejsapi=1';
  
  return embedUrl;
};

// ── Summarize YouTube Video with Gemini ──────────────────────────────────────

const summarizeYouTubeVideo = async (videoUrl) => {
  try {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    // Use AI Manager to summarize
    if (window.aiManager) {
      const prompt = `Please provide a comprehensive summary of this YouTube video: https://www.youtube.com/watch?v=${videoId}

Include:
1. Main topic and key points
2. Important concepts explained
3. Practical takeaways
4. Target audience
5. Recommended for (beginner/intermediate/advanced)

Note: Provide a general educational summary based on the video context.`;

      const summary = await window.aiManager.generateContent(prompt);
      return summary;
    }
    
    return 'AI summarization service is not available. Please watch the video directly.';
  } catch (error) {
    console.error('Error summarizing video:', error);
    return `Unable to generate summary: ${error.message}`;
  }
};

// ── Get File Icon ────────────────────────────────────────────────────────────

const getFileIcon = (type) => {
  if (type.includes('pdf')) return 'fa-file-pdf';
  if (type.includes('word') || type.includes('document')) return 'fa-file-word';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'fa-file-excel';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'fa-file-powerpoint';
  if (type.includes('image')) return 'fa-file-image';
  if (type.includes('video')) return 'fa-file-video';
  if (type.includes('audio')) return 'fa-file-audio';
  if (type.includes('zip') || type.includes('rar')) return 'fa-file-zipper';
  if (type.includes('text')) return 'fa-file-lines';
  return 'fa-file';
};

// ── Export Functions ─────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  window.ResourcesManager = {
    initDB,
    saveFile,
    getFiles,
    deleteFile,
    saveVideo,
    getVideos,
    deleteVideo,
    formatFileSize,
    getFileIcon,
    parseVideoUrl,
    generateThumbnail,
    openFileViewer,
    getYouTubeVideoId,
    convertToYouTubeEmbed,
    summarizeYouTubeVideo
  };
}
