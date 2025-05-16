// _data/artwork.js
const fs = require('fs');
const path = require('path');

// Mapping of titles to filenames
const titleToFilename = {
  "Spheres in Pink, 2025": "Engorged.jpg",
  "Urban Installation, 2024": "Fit+in.jpg",
  "Paper Series #4, 2024": "Josiah+Heads.jpg"
  // Add more as needed
};

module.exports = function() {
  // Path to your file list
  const filePath = path.join(__dirname, 'assets/filelist.txt');
  
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the file list
    const fileData = {};
    fileContent.split('\n').forEach(line => {
      const [filename, size] = line.split(',');
      if (filename && size) {
        fileData[filename.trim()] = parseInt(size.trim());
      }
    });
    
    // Create the images object
    const images = {};
    Object.entries(titleToFilename).forEach(([title, filename]) => {
      images[title] = {
        filename,
        filesize: fileData[filename] || null,
        alt: `${title} - an artwork by Jessica Akerman`
      };
    });
    
    return {
      baseUrl: "https://s3.eu-west-1.amazonaws.com/jessicaakerman.com/",
      images
    };
  } catch (error) {
    console.error("Error loading or parsing the file list:", error);
    return {
      baseUrl: "https://s3.eu-west-1.amazonaws.com/jessicaakerman.com/",
      images: {}
    };
  }
};