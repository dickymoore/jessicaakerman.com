// _data/artwork.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function() {
  // Define a failsafe object to use if anything goes wrong
  const fallbackData = {
    baseUrl: "https://s3.eu-west-1.amazonaws.com/jessicaakerman.com/",
    images: {
      "Spheres in Pink": {
        filename: "Engorged.jpg",
        filesize: 240900,
        alt: "Spheres in Pink - an artwork by Jessica Akerman"
      },
      "Urban Installation": {
        filename: "Fit+in.jpg",
        filesize: 172000,
        alt: "Urban Installation - an artwork by Jessica Akerman"
      },
      "Paper Series #4": {
        filename: "Josiah+Heads.jpg",
        filesize: 137500,
        alt: "Paper Series #4 - an artwork by Jessica Akerman"
      }
    }
  };

//   try {
//     // Path to your CSV file
//     const csvFilePath = path.join(__dirname, 'assets/images.csv');
    
//     // Check if file exists
//     if (!fs.existsSync(csvFilePath)) {
//       console.error(`CSV file not found at ${csvFilePath}`);
//       return fallbackData;
//     }
    
//     // Read the CSV file
//     const csvFile = fs.readFileSync(csvFilePath, 'utf8');
//     console.log("CSV file loaded successfully");
    
//     // Skip the first line if it's a comment/URL
//     let csvContent = csvFile;
//     if (csvFile.startsWith('#')) {
//       const lines = csvFile.split('\n');
//       csvContent = lines.slice(1).join('\n');
//     }
    
//     // Parse the CSV
//     const results = Papa.parse(csvContent, {
//       header: true,
//       skipEmptyLines: true,
//       // Add this to handle CSV issues
//       dynamicTyping: true,
//       delimiter: ",",
//       transform: (value) => {
//         // Handle empty values
//         return value ? value.trim() : value;
//       },
//       error: (error) => {
//         console.error('CSV parsing error:', error);
//       }
//     });
    
//     if (results.errors && results.errors.length > 0) {
//       console.warn("CSV parsing warnings (non-fatal):", results.errors);
//     }
    
//     console.log(`Parsed ${results.data.length} rows from CSV`);
    
//     // Create the images object 
//     const images = {};
    
//     // Process specific keys we care about first
//     const specialKeys = [
//       ["Spheres in Pink", "Engorged.jpg"],
//       ["Urban Installation", "Fit+in.jpg"],
//       ["Paper Series #4", "Josiah+Heads.jpg"]
//     ];
    
//     // Add our special keys first
//     specialKeys.forEach(([name, filename]) => {
//       // Look for this filename in the results
//       const matchingRow = results.data.find(row => 
//         row.filename === filename || 
//         row.name === name
//       );
      
//       if (matchingRow) {
//         images[name] = {
//           filename: matchingRow.filename,
//           filesize: parseInt(matchingRow.filesize || 0, 10),
//           alt: `${name} - an artwork by Jessica Akerman`
//         };
//         console.log(`Found special key: ${name} -> ${matchingRow.filename}`);
//       } else {
//         // Use fallback if not found
//         images[name] = fallbackData.images[name];
//         console.log(`Using fallback for: ${name}`);
//       }
//     });
    
//     // Add all other rows from CSV
//     results.data.forEach(row => {
//       if (row.name && row.filename) {
//         // Skip if we already processed this name as a special key
//         if (!specialKeys.some(([name]) => name === row.name)) {
//           images[row.name] = {
//             filename: row.filename,
//             filesize: parseInt(row.filesize || 0, 10),
//             alt: `${row.name} - an artwork by Jessica Akerman`
//           };
//         }
//       }
//     });
    
//     // Extract base URL from the first line of the CSV
//     let baseUrl = "https://s3.eu-west-1.amazonaws.com/jessicaakerman.com/";
//     if (csvFile.startsWith('#')) {
//       const firstLine = csvFile.split('\n')[0].trim();
//       if (firstLine.startsWith('#')) {
//         baseUrl = firstLine.substring(1).trim();
//       }
//     }
    
//     return {
//       baseUrl,
//       images
//     };
//   } catch (error) {
//     console.error("Error loading or parsing the CSV:", error);
//     return fallbackData;
//   }
}