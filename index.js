const fsp = require('fs').promises;
const fs = require("fs");
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const BATCH_SIZE = 100; // Number of rows to process in each batch

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
    try {
        // Load saved credentials from the token file if it exists
        const content = await fsp.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        // If no saved credentials exist, return null
        return null;
    }
}

async function saveCredentials(client) {
    // Read credentials from the credentials file
    const content = await fsp.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    // Prepare payload with necessary authentication data
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    // Save the authentication data to the token file
    await fsp.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        // Use saved credentials if available
        return client;
    }
    // Authenticate and obtain new credentials if saved credentials don't exist
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        // Save the obtained credentials for future use
        await saveCredentials(client);
    }
    return client;
}

// Main logic to upload CSV data to Google Sheets
async function uploadCSVToSpreadsheet(auth, csvFilePath) {
    const sheets = google.sheets({ version: 'v4', auth });

    const stream = fs.createReadStream(csvFilePath, { encoding: 'utf-8' });
    const rl = require('readline').createInterface({
        input: stream,
        terminal: false
    });

    let rows = [];
    let rowCount = 0;

    for await (const line of rl) {
        const values = line.split(',');
        rows.push(values);

        if (rows.length >= BATCH_SIZE) {
            await processBatch(sheets, rows);
            rows = [];
        }

        rowCount++;
    }

    // Process any remaining rows in the last batch
    if (rows.length > 0) {
        await processBatch(sheets, rows);
    }

    console.log(`Total ${rowCount} rows processed.`);
}

async function processBatch(sheets, rows) {
    try {
        // For Filtering Out the data
        const columnsRequiredInSpreadSheet = ['Description',"Ayush Cleo Badminton"]; // Example column names to include
        const actualDataWithSpecifiedColumns = [];
        for (let i = 0; i < rows.length; i++) {
            const temp = [];
            for (let j = 0; j < rows[0].length; j++) {
                if (columnsRequiredInSpreadSheet.includes(rows[0][j])) {
                    temp.push(rows[i][j]);
                }
            }
            actualDataWithSpecifiedColumns.push(temp);
        }

        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: "1MljFUBE-nBTcSUOPJg9XnJtm1UUNk9oXt3v7gLEvAb8",
            range: 'A:Z', // Specify the range (total number of columns)
            valueInputOption: 'RAW',
            resource: { values: actualDataWithSpecifiedColumns }
        })
        if (response && response.data) {
            console.log(`${response.data.updatedCells} cells updated.`);
        } else {
            console.error('Invalid API response:');
        }
    } catch (error) {
        console.error('Error updating rows:', error);
    }
}

// Main function to authenticate and run the logic
async function run() {
    try {
        const auth = await authorize();
        const csvFilePath = '/Users/ayushgupta/Documents/export.csv'; // Replace with your CSV file path
        await uploadCSVToSpreadsheet(auth, csvFilePath);
    } catch (error) {
        console.error('Error:', error);
    }
}
// Execute the main function
run();