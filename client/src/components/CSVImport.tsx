
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface CSVImportProps {
  onClose: () => void;
}

export function CSVImport({ onClose }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importCSVData } = useApp();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      setResult({ success: false, message: 'Please select a valid CSV file.' });
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header and one data row.');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return data;
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const csvText = await file.text();
      const data = parseCSV(csvText);
      
      // Import the data
      const importResult = await importCSVData(data);
      
      if (importResult.success) {
        setResult({ 
          success: true, 
          message: `Successfully imported ${importResult.imported} records. ${importResult.skipped} records were skipped.` 
        });
        
        // Close modal after successful import
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setResult({ 
          success: false, 
          message: importResult.message || 'Import failed. Please check your CSV format.' 
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import CSV Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Import previously exported data from this app. The CSV should contain columns for weights, water intake, meals, exercises, and other tracked data.
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!file ? (
            <div>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Click to select a CSV file
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Choose File
              </Button>
            </div>
          ) : (
            <div>
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          )}
        </div>

        {result && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            result.success 
              ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' 
              : 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {result.success ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{result.message}</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleImport}
            disabled={!file || importing}
            className="flex-1"
          >
            {importing ? 'Importing...' : 'Import Data'}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            disabled={importing}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
