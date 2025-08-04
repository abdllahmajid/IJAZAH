/**
 * Google Apps Script untuk Aplikasi Data Ijazah - GitHub Integration
 * 
 * Struktur Sheet DATABASE:
 * Kolom A: NO URUT
 * Kolom B: NO INDUK  
 * Kolom C: NAMA
 * Kolom D: ASRAMA
 * Kolom E: KELAS
 * Kolom F: NAMA IJAZAH
 * Kolom G: WALI IJAZAH
 * Kolom H: NISN
 * Kolom I: TTL
 * Kolom J: TAUHID
 * Kolom K: AKHLAQ
 * Kolom L: TAFSIR
 * Kolom M: HADITS
 * Kolom N: FIQH
 * Kolom O: NAHWU
 * Kolom P: SHOROF
 * Kolom Q: B. ARAB
 * Kolom R: TARIKH
 * Kolom S: FAROIDL
 * Kolom T: JUMLAH
 * Kolom U: RATA RATA
 * Kolom V: CEK BERKAS
 * Kolom W: KESALAHAN INDUK
 * Kolom X: KESALAHAN NISN
 * Kolom Y: KESALAHAN NAMA
 * Kolom Z: KESALAHAN TTL
 * Kolom AA: KESALAHAN NAMA WALI
 * Kolom AB: SUDAH DITULIS
 */

// Konfigurasi
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Ganti dengan ID spreadsheet Anda
const SHEET_NAME = 'DATABASE';

// CORS headers untuk GitHub Pages
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Kolom mapping
const COLUMNS = {
  NO_URUT: 1,           // A
  NO_INDUK: 2,          // B
  NAMA: 3,              // C
  ASRAMA: 4,            // D
  KELAS: 5,             // E
  NAMA_IJAZAH: 6,       // F
  WALI_IJAZAH: 7,       // G
  NISN: 8,              // H
  TTL: 9,               // I
  TAUHID: 10,           // J
  AKHLAQ: 11,           // K
  TAFSIR: 12,           // L
  HADITS: 13,           // M
  FIQH: 14,             // N
  NAHWU: 15,            // O
  SHOROF: 16,           // P
  B_ARAB: 17,           // Q
  TARIKH: 18,           // R
  FAROIDL: 19,          // S
  JUMLAH: 20,           // T
  RATA_RATA: 21,        // U
  CEK_BERKAS: 22,       // V
  KESALAHAN_INDUK: 23,  // W
  KESALAHAN_NISN: 24,   // X
  KESALAHAN_NAMA: 25,   // Y
  KESALAHAN_TTL: 26,    // Z
  KESALAHAN_NAMA_WALI: 27, // AA
  SUDAH_DITULIS: 28     // AB
};

/**
 * Handle GET requests
 */
function doGet(e) {
  try {
    // Handle CORS preflight
    if (e.parameter.action === 'test') {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'Connection successful' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(CORS_HEADERS);
    }
    
    // Default response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: 'Use POST for data operations' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(CORS_HEADERS);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(CORS_HEADERS);
  }
}

/**
 * Handle POST requests from GitHub Pages
 */
function doPost(e) {
  try {
    let data;
    
    // Parse JSON data
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Invalid JSON data' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(CORS_HEADERS);
    }
    
    const action = data.action;
    let result;
    
    // Route requests based on action
    switch (action) {
      case 'searchStudent':
        result = searchStudent(data.noInduk);
        break;
      case 'saveStudent':
        result = saveStudent(data);
        break;
      case 'deleteStudent':
        result = deleteStudent(data.noInduk);
        break;
      case 'getAllStudents':
        result = getAllStudents();
        break;
      case 'addStudent':
        result = addStudent(data);
        break;
      default:
        result = { success: false, message: 'Unknown action: ' + action };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(CORS_HEADERS);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(CORS_HEADERS);
  }
}

/**
 * Get spreadsheet object
 */
function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    // If SPREADSHEET_ID is not set or invalid, use active spreadsheet
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

/**
 * Get worksheet
 */
function getWorksheet() {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Create sheet if it doesn't exist
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    initializeSheet(sheet);
  }
  
  return sheet;
}

/**
 * Initialize sheet with headers
 */
function initializeSheet(sheet) {
  const headers = [
    'NO URUT', 'NO INDUK', 'NAMA', 'ASRAMA', 'KELAS',
    'NAMA IJAZAH', 'WALI IJAZAH', 'NISN', 'TTL',
    'TAUHID', 'AKHLAQ', 'TAFSIR', 'HADITS', 'FIQH',
    'NAHWU', 'SHOROF', 'B. ARAB', 'TARIKH', 'FAROIDL',
    'JUMLAH', 'RATA RATA', 'CEK BERKAS',
    'KESALAHAN INDUK', 'KESALAHAN NISN', 'KESALAHAN NAMA',
    'KESALAHAN TTL', 'KESALAHAN NAMA WALI', 'SUDAH DITULIS'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  
  // Add some sample data
  const sampleData = [
    [1, '001', 'Ahmad Fadilah', 'Al-Hikmah', '12A', 'Ahmad Fadilah bin Sulaiman', 'Sulaiman Ahmad', '1234567890', 'Tuban, 17 Agustus 1945', 85, 88, 82, 86, 84, 87, 83, 89, 85, 86, 855, 85.5, 'https://drive.google.com/file/d/example1', false, false, false, false, false, false],
    [2, '002', 'Fatimah Zahra', 'An-Nur', '12B', 'Fatimah Zahra binti Abdullah', 'Abdullah Rahman', '1234567891', 'Surabaya, 15 Maret 2005', 90, 92, 88, 91, 89, 90, 87, 93, 88, 90, 898, 89.8, '', false, false, false, false, false, false],
    [3, '003', 'Muhammad Rizki', 'As-Salam', '12C', 'Muhammad Rizki bin Hasan', 'Hasan Ali', '1234567892', 'Jakarta, 10 Juli 2005', 88, 85, 90, 87, 86, 84, 89, 91, 83, 88, 871, 87.1, 'https://drive.google.com/file/d/example3', false, false, false, false, false, false]
  ];
  
  sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);
}

/**
 * Find student row by NO INDUK
 */
function findStudentRow(noInduk) {
  const sheet = getWorksheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) { // Start from row 2 (skip header)
    if (data[i][COLUMNS.NO_INDUK - 1] == noInduk) {
      return i + 1; // Return 1-based row number
    }
  }
  
  return -1; // Not found
}

/**
 * Convert row data to student object
 */
function rowToStudent(rowData) {
  return {
    noUrut: rowData[COLUMNS.NO_URUT - 1],
    noInduk: rowData[COLUMNS.NO_INDUK - 1],
    nama: rowData[COLUMNS.NAMA - 1],
    asrama: rowData[COLUMNS.ASRAMA - 1],
    kelas: rowData[COLUMNS.KELAS - 1],
    namaIjazah: rowData[COLUMNS.NAMA_IJAZAH - 1] || '',
    waliIjazah: rowData[COLUMNS.WALI_IJAZAH - 1] || '',
    nisn: rowData[COLUMNS.NISN - 1] || '',
    ttl: rowData[COLUMNS.TTL - 1] || '',
    tauhid: rowData[COLUMNS.TAUHID - 1] || '',
    akhlaq: rowData[COLUMNS.AKHLAQ - 1] || '',
    tafsir: rowData[COLUMNS.TAFSIR - 1] || '',
    hadits: rowData[COLUMNS.HADITS - 1] || '',
    fiqh: rowData[COLUMNS.FIQH - 1] || '',
    nahwu: rowData[COLUMNS.NAHWU - 1] || '',
    shorof: rowData[COLUMNS.SHOROF - 1] || '',
    bArab: rowData[COLUMNS.B_ARAB - 1] || '',
    tarikh: rowData[COLUMNS.TARIKH - 1] || '',
    faroidl: rowData[COLUMNS.FAROIDL - 1] || '',
    jumlah: rowData[COLUMNS.JUMLAH - 1] || '',
    rataRata: rowData[COLUMNS.RATA_RATA - 1] || '',
    cekBerkas: rowData[COLUMNS.CEK_BERKAS - 1] || '',
    kesalahanInduk: rowData[COLUMNS.KESALAHAN_INDUK - 1] || false,
    kesalahanNisn: rowData[COLUMNS.KESALAHAN_NISN - 1] || false,
    kesalahanNama: rowData[COLUMNS.KESALAHAN_NAMA - 1] || false,
    kesalahanTtl: rowData[COLUMNS.KESALAHAN_TTL - 1] || false,
    kesalahanNamaWali: rowData[COLUMNS.KESALAHAN_NAMA_WALI - 1] || false,
    sudahDitulis: rowData[COLUMNS.SUDAH_DITULIS - 1] || false
  };
}

/**
 * Calculate jumlah and rata-rata from grades
 */
function calculateGrades(student) {
  const subjects = [
    parseFloat(student.tauhid) || 0,
    parseFloat(student.akhlaq) || 0,
    parseFloat(student.tafsir) || 0,
    parseFloat(student.hadits) || 0,
    parseFloat(student.fiqh) || 0,
    parseFloat(student.nahwu) || 0,
    parseFloat(student.shorof) || 0,
    parseFloat(student.bArab) || 0,
    parseFloat(student.tarikh) || 0,
    parseFloat(student.faroidl) || 0
  ];
  
  const jumlah = subjects.reduce((sum, grade) => sum + grade, 0);
  const rataRata = jumlah / subjects.length;
  
  return {
    jumlah: jumlah,
    rataRata: Math.round(rataRata * 100) / 100
  };
}

/**
 * Search student by NO INDUK
 */
function searchStudent(noInduk) {
  try {
    const sheet = getWorksheet();
    const rowNum = findStudentRow(noInduk);
    
    if (rowNum === -1) {
      return { success: false, message: 'Student not found' };
    }
    
    const rowData = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
    const student = rowToStudent(rowData);
    
    // Recalculate grades
    const grades = calculateGrades(student);
    student.jumlah = grades.jumlah;
    student.rataRata = grades.rataRata;
    
    return { success: true, student: student };
    
  } catch (error) {
    console.error('Error searching student:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Save student data
 */
function saveStudent(data) {
  try {
    const sheet = getWorksheet();
    const rowNum = findStudentRow(data.noInduk);
    
    if (rowNum === -1) {
      return { success: false, message: 'Student not found' };
    }
    
    // Get current data
    const rowData = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
    const student = rowToStudent(rowData);
    
    // Update with new data
    if (data.namaIjazah !== undefined) student.namaIjazah = data.namaIjazah;
    if (data.waliIjazah !== undefined) student.waliIjazah = data.waliIjazah;
    if (data.nisn !== undefined) student.nisn = data.nisn;
    if (data.ttl !== undefined) student.ttl = data.ttl;
    if (data.cekBerkas !== undefined) student.cekBerkas = data.cekBerkas;
    if (data.sudahDitulis !== undefined) student.sudahDitulis = data.sudahDitulis;
    if (data.kesalahanInduk !== undefined) student.kesalahanInduk = data.kesalahanInduk;
    if (data.kesalahanNisn !== undefined) student.kesalahanNisn = data.kesalahanNisn;
    if (data.kesalahanNama !== undefined) student.kesalahanNama = data.kesalahanNama;
    if (data.kesalahanTtl !== undefined) student.kesalahanTtl = data.kesalahanTtl;
    if (data.kesalahanNamaWali !== undefined) student.kesalahanNamaWali = data.kesalahanNamaWali;
    
    // Recalculate grades
    const grades = calculateGrades(student);
    student.jumlah = grades.jumlah;
    student.rataRata = grades.rataRata;
    
    // Update specific cells
    sheet.getRange(rowNum, COLUMNS.NAMA_IJAZAH).setValue(student.namaIjazah);
    sheet.getRange(rowNum, COLUMNS.WALI_IJAZAH).setValue(student.waliIjazah);
    sheet.getRange(rowNum, COLUMNS.NISN).setValue(student.nisn);
    sheet.getRange(rowNum, COLUMNS.TTL).setValue(student.ttl);
    sheet.getRange(rowNum, COLUMNS.JUMLAH).setValue(student.jumlah);
    sheet.getRange(rowNum, COLUMNS.RATA_RATA).setValue(student.rataRata);
    sheet.getRange(rowNum, COLUMNS.CEK_BERKAS).setValue(student.cekBerkas);
    sheet.getRange(rowNum, COLUMNS.KESALAHAN_INDUK).setValue(student.kesalahanInduk);
    sheet.getRange(rowNum, COLUMNS.KESALAHAN_NISN).setValue(student.kesalahanNisn);
    sheet.getRange(rowNum, COLUMNS.KESALAHAN_NAMA).setValue(student.kesalahanNama);
    sheet.getRange(rowNum, COLUMNS.KESALAHAN_TTL).setValue(student.kesalahanTtl);
    sheet.getRange(rowNum, COLUMNS.KESALAHAN_NAMA_WALI).setValue(student.kesalahanNamaWali);
    sheet.getRange(rowNum, COLUMNS.SUDAH_DITULIS).setValue(student.sudahDitulis);
    
    return { success: true, student: student };
    
  } catch (error) {
    console.error('Error saving student:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Delete student completely
 */
function deleteStudent(noInduk) {
  try {
    const sheet = getWorksheet();
    const rowNum = findStudentRow(noInduk);
    
    if (rowNum === -1) {
      return { success: false, message: 'Student not found' };
    }
    
    // Delete the entire row
    sheet.deleteRow(rowNum);
    
    return { success: true, message: 'Student deleted successfully' };
    
  } catch (error) {
    console.error('Error deleting student:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Get all students
 */
function getAllStudents() {
  try {
    const sheet = getWorksheet();
    const data = sheet.getDataRange().getValues();
    const students = [];
    
    for (let i = 1; i < data.length; i++) { // Start from row 2 (skip header)
      const student = rowToStudent(data[i]);
      const grades = calculateGrades(student);
      student.jumlah = grades.jumlah;
      student.rataRata = grades.rataRata;
      students.push(student);
    }
    
    return { success: true, students: students };
    
  } catch (error) {
    console.error('Error getting all students:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Add new student
 */
function addStudent(studentData) {
  try {
    const sheet = getWorksheet();
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    // Get next NO URUT
    const noUrut = lastRow; // Since row 1 is header, lastRow equals the count of students + 1
    
    const grades = calculateGrades(studentData);
    
    const rowData = [
      noUrut,
      studentData.noInduk,
      studentData.nama,
      studentData.asrama,
      studentData.kelas,
      studentData.namaIjazah || '',
      studentData.waliIjazah || '',
      studentData.nisn || '',
      studentData.ttl || '',
      studentData.tauhid || '',
      studentData.akhlaq || '',
      studentData.tafsir || '',
      studentData.hadits || '',
      studentData.fiqh || '',
      studentData.nahwu || '',
      studentData.shorof || '',
      studentData.bArab || '',
      studentData.tarikh || '',
      studentData.faroidl || '',
      grades.jumlah,
      grades.rataRata,
      studentData.cekBerkas || '',
      studentData.kesalahanInduk || false,
      studentData.kesalahanNisn || false,
      studentData.kesalahanNama || false,
      studentData.kesalahanTtl || false,
      studentData.kesalahanNamaWali || false,
      studentData.sudahDitulis || false
    ];
    
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    return { success: true, message: 'Student added successfully' };
    
  } catch (error) {
    console.error('Error adding student:', error);
    return { success: false, message: error.toString() };
  }
}

/**
 * Test function - untuk testing di script editor
 */
function testSearchStudent() {
  const result = searchStudent('001');
  console.log(result);
}

/**
 * Setup function - jalankan ini sekali untuk setup awal
 */
function setupSpreadsheet() {
  const sheet = getWorksheet();
  console.log('Spreadsheet setup complete. Sheet name:', sheet.getName());
  console.log('Last row:', sheet.getLastRow());
  console.log('Last column:', sheet.getLastColumn());
}

/**
 * Deploy as web app:
 * 1. Go to Extensions > Apps Script
 * 2. Paste this code
 * 3. Save and rename project
 * 4. Click Deploy > New Deployment
 * 5. Choose "Web app" as type
 * 6. Set Execute as "Me" and Access to "Anyone"
 * 7. Copy the web app URL
 * 8. Use this URL in the GitHub Pages app configuration
 */