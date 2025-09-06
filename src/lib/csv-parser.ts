import { type Transaction } from './types';

const findHeaderIndex = (header: string[], possibleNames: string[]): number => {
    for (const name of possibleNames) {
        const index = header.indexOf(name);
        if (index !== -1) return index;
    }
    return -1;
};

// This parser handles quoted fields but is not fully RFC 4180 compliant.
// It assumes that quotes are only used to enclose fields containing commas.
export function parseCSV(csvText: string): Transaction[] {
    const lines = csvText.trim().split(/\r\n|\n/);
    if (lines.length < 2) return [];

    const headerLine = lines.shift()!;
    const header = headerLine.split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));

    const dateIndex = findHeaderIndex(header, ['date', 'transaction date']);
    const descriptionIndex = findHeaderIndex(header, ['description', 'details', 'memo']);
    const categoryIndex = findHeaderIndex(header, ['category', 'type']);
    const amountIndex = findHeaderIndex(header, ['amount', 'value', 'price']);

    if (dateIndex === -1 || amountIndex === -1) {
        throw new Error("CSV must contain columns for 'date' and 'amount'. Common names like 'transaction date' are also accepted.");
    }
    
    const data: Transaction[] = [];

    for (const line of lines) {
        if (!line) continue;
        const values = (line.match(/(".*?"|[^",\r]+)(?=\s*,|\s*$)/g) || []).map(v => v.trim().replace(/"/g, ''));
        
        const dateStr = values[dateIndex];
        const amountStr = values[amountIndex];

        if (!dateStr || !amountStr) continue;

        const date = new Date(dateStr);
        // Remove currency symbols, thousands separators, and parse as float
        const amount = parseFloat(amountStr.replace(/[^0-9.-]+/g,""));

        if (isNaN(date.getTime()) || isNaN(amount)) {
            console.warn(`Skipping invalid row: ${line}`);
            continue;
        }

        data.push({
            date,
            amount,
            description: values[descriptionIndex] || 'N/A',
            category: values[categoryIndex] || 'Uncategorized',
        });
    }
    return data;
}
