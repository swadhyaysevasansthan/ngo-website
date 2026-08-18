import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { eventPassAPI } from '../../utils/api';
import Card from '../Card';
import Button from '../Button';

const BulkImport = ({ selectedEventId, onImportComplete }) => {
  const [importText, setImportText] = useState('');
  const [importPreview, setImportPreview] = useState([]);
  const [importSummary, setImportSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleParse = () => {
    if (!importText.trim()) {
      toast.warning('Please paste spreadsheet data or CSV content first');
      return;
    }

    const lines = importText.split('\n');
    const parsed = [];
    let duplicatesCount = 0;
    let invalidCount = 0;
    const namesSet = new Set();

    lines.forEach((line, index) => {
      if (!line.trim()) return;

      const delimiter = line.includes('\t') ? '\t' : ',';
      const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));

      if (index === 0 && (parts[0].toLowerCase().includes('name') || parts[0].toLowerCase().includes('guest'))) {
        return;
      }

      const guestName = parts[0] || '';
      const mobile = parts[1] || '';
      const email = parts[2] || '';
      const category = parts[3] || 'General';
      const notes = parts[4] || '';

      const isValid = guestName.length > 0;
      const isDuplicate = namesSet.has(guestName.toLowerCase() + mobile);

      if (!isValid) invalidCount++;
      if (isDuplicate && isValid) duplicatesCount++;
      if (isValid) namesSet.add(guestName.toLowerCase() + mobile);

      parsed.push({ guestName, mobile, email, category, notes, isValid, isDuplicate });
    });

    setImportPreview(parsed);
    setImportSummary({
      total: parsed.length,
      valid: parsed.filter((p) => p.isValid && !p.isDuplicate).length,
      duplicates: duplicatesCount,
      invalid: invalidCount,
    });
  };

  const handleSubmit = async () => {
    const validGuests = importPreview.filter((p) => p.isValid && !p.isDuplicate);
    if (validGuests.length === 0) {
      toast.error('No valid, non-duplicate guests to import.');
      return;
    }

    setLoading(true);
    try {
      const res = await eventPassAPI.bulkImportPasses({
        eventId: parseInt(selectedEventId),
        guests: validGuests.map(({ guestName, mobile, email, category, notes }) => ({
          guestName,
          mobile,
          email,
          category,
          notes,
        })),
      });
      if (res.data.success) {
        toast.success(`Successfully imported ${res.data.count} guest passes!`);
        setImportText('');
        setImportPreview([]);
        setImportSummary(null);
        onImportComplete?.();
      }
    } catch {
      toast.error('Failed to import guest passes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-5 border border-gray-100 space-y-6">
      <div>
        <h3 className="font-bold text-gray-800 text-lg">Bulk Import Guest List</h3>
        <p className="text-sm text-gray-500 mt-1">
          Copy rows from Excel or Google Sheets (columns:{' '}
          <strong>Name, Mobile, Email, Category, Notes</strong>) and paste them below.
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          rows="8"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder={`Jane Doe\t9876543210\tjane@example.com\tVIP\tVIP Guest\nBob Smith\t9999988888\tbob@example.com\tGuest\tRegular entry`}
          className="w-full p-4 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
        />

        <div className="flex gap-2">
          <Button variant="primary" className="text-xs py-2 px-6" onClick={handleParse}>
            🔍 Parse &amp; Validate
          </Button>
          {importSummary && (
            <Button variant="secondary" className="text-xs py-2 px-6" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Importing…' : `📥 Import ${importSummary.valid} Valid Guests`}
            </Button>
          )}
        </div>
      </div>

      {/* Summary Counters */}
      {importSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border">
          <div>
            <div className="text-gray-500 text-xs font-bold uppercase">Total Parsed</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">{importSummary.total}</div>
          </div>
          <div>
            <div className="text-green-600 text-xs font-bold uppercase">Valid (Ready)</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{importSummary.valid}</div>
          </div>
          <div>
            <div className="text-amber-600 text-xs font-bold uppercase">Duplicate Rows</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{importSummary.duplicates}</div>
          </div>
          <div>
            <div className="text-red-600 text-xs font-bold uppercase">Invalid (Empty Name)</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{importSummary.invalid}</div>
          </div>
        </div>
      )}

      {/* Parse Preview Table */}
      {importPreview.length > 0 && (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-500 font-bold">
                <th className="p-3">Guest Name</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Email</th>
                <th className="p-3">Category</th>
                <th className="p-3">Notes</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {importPreview.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-gray-50/50 ${
                    !row.isValid ? 'bg-red-50/30' : row.isDuplicate ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="p-3 font-semibold text-slate-800">
                    {row.guestName || <em className="text-red-400">Empty Guest Name</em>}
                  </td>
                  <td className="p-3 text-gray-600">{row.mobile}</td>
                  <td className="p-3 text-gray-600">{row.email}</td>
                  <td className="p-3 text-gray-600">{row.category}</td>
                  <td className="p-3 text-gray-500 text-xs">{row.notes}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        !row.isValid
                          ? 'bg-red-100 text-red-800'
                          : row.isDuplicate
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {!row.isValid ? 'INVALID' : row.isDuplicate ? 'DUPLICATE' : 'OK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default BulkImport;
