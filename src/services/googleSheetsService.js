// Google Sheets API Service
class GoogleSheetsService {
  constructor() {
    this.apiKey = null;
    this.spreadsheetId = null;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  // Initialize with API key and spreadsheet ID
  initialize(apiKey, spreadsheetId) {
    this.apiKey = apiKey;
    this.spreadsheetId = spreadsheetId;
  }

  // Generic method to read data from a sheet
  async readSheet(sheetName, range = '') {
    if (!this.apiKey || !this.spreadsheetId) {
      throw new Error('Google Sheets service not initialized');
    }

    const url = `${this.baseUrl}/${this.spreadsheetId}/values/${sheetName}${range ? '!' + range : ''}?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error reading from Google Sheets:', error);
      throw error;
    }
  }

  // Generic method to write data to a sheet
  async writeSheet(sheetName, range, values) {
    if (!this.apiKey || !this.spreadsheetId) {
      throw new Error('Google Sheets service not initialized');
    }

    const url = `${this.baseUrl}/${this.spreadsheetId}/values/${sheetName}!${range}?valueInputOption=RAW&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error writing to Google Sheets:', error);
      throw error;
    }
  }

  // Append data to a sheet
  async appendToSheet(sheetName, values) {
    if (!this.apiKey || !this.spreadsheetId) {
      throw new Error('Google Sheets service not initialized');
    }

    const url = `${this.baseUrl}/${this.spreadsheetId}/values/${sheetName}:append?valueInputOption=RAW&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error appending to Google Sheets:', error);
      throw error;
    }
  }

  // Get players data from Google Sheets
  async getPlayers() {
    try {
      const data = await this.readSheet('Players');
      if (!data || data.length === 0) return [];

      // Assuming first row is headers
      const headers = data[0];
      return data.slice(1).map(row => {
        const player = {};
        headers.forEach((header, index) => {
          player[header.toLowerCase()] = row[index] || '';
        });
        return player;
      });
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  }

  // Get matchdays data from Google Sheets
  async getMatchdays() {
    try {
      const data = await this.readSheet('Matchdays');
      if (!data || data.length === 0) return [];

      // Parse matchdays data - this will depend on your sheet structure
      // You'll need to adapt this based on how you structure your Google Sheet
      return this.parseMatchdaysData(data);
    } catch (error) {
      console.error('Error fetching matchdays:', error);
      return [];
    }
  }

  // Add a new matchday to Google Sheets
  async addMatchday(matchdayData) {
    try {
      // Convert matchday object to array format for Google Sheets
      const rowData = this.formatMatchdayForSheet(matchdayData);
      return await this.appendToSheet('Matchdays', [rowData]);
    } catch (error) {
      console.error('Error adding matchday:', error);
      throw error;
    }
  }

  // Update an existing matchday in Google Sheets
  async updateMatchday(matchdayId, matchdayData) {
    try {
      // This would require finding the row and updating it
      // Implementation depends on your sheet structure
      console.log('Updating matchday:', matchdayId, matchdayData);
      // TODO: Implement based on your Google Sheets structure
    } catch (error) {
      console.error('Error updating matchday:', error);
      throw error;
    }
  }

  // Helper method to parse matchdays data from sheet format
  parseMatchdaysData(data) {
    // TODO: Implement based on your Google Sheets structure
    // This is a placeholder - you'll need to adapt this
    return [];
  }

  // Helper method to format matchday data for sheet
  formatMatchdayForSheet(matchdayData) {
    // TODO: Implement based on your Google Sheets structure
    // This is a placeholder - you'll need to adapt this
    return [];
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
