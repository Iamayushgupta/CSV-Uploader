## Problem Statement**:
Make a CSV Importer for Google Sheets that lets users drag and drop CSV files onto the Google Sheet. The moment they drop the CSV file, allow them to select which columns to import 🗂️.

## Approach to the Problem
The approach to this problem is that we can write the logic for getting the CSV file (i.e getting the input as a file) which when uploaded, directly gets appended to the current active spreadsheet. Now to implement the backend of the part, we can do it in two ways :- 
1. Utilize Google-APIs, via Nodejs OR Javascrip OR Python to write the code in the local where data can be read and dumped. We can upload the CSV file by specifying the spreadsheetID in which CSV has to be uploaded. Before uploading, we can for taking only specific columns too.
2. We can open a new Spreadsheet, Navigate to Extensions and Open Appscrips, we can create a new .gs file write the logic for uploading the data in the specified format.

## Google APIs 
Notion doc for implementing google-apis
https://www.notion.so/Uploading-CSV-file-to-Google-Spreadsheet-66758525d4ac41198944f980e2d7da4c

## Steps to run the code
1. Create a new Folder
2. git clone 
3. Run the following commands :-
4. npm init -y
5. npm install
6. Either create your own GCP project(Follow the Notion link) or please ask for credentials.json and token.json file by contacting ayushgupta71011@gmail.com 
7. Provide your own FilePath for csv and the columns which you need the array
8. node index.js  (To run the project)
