/**
 * @file exportService.ts
 * @description Generates real file exports (CSV, JSON) using browser Blob APIs.
 */

import { Scholarship, TrackedApplication, UserProfile } from '../types';

export class ExportService {
  /**
   * Generates and triggers download of a CSV aid portfolio report.
   */
  static exportApplicationsToCsv(
    trackedApps: Record<string, TrackedApplication>,
    scholarships: Scholarship[],
    profile: UserProfile
  ): void {
    const trackedList = Object.values(trackedApps);
    
    const headers = [
      'Scholarship Title',
      'Provider',
      'Award Amount ($)',
      'Status',
      'Deadline',
      'Renewable',
      'Category',
      'Date Added',
      'Notes'
    ];

    const rows = trackedList.map(t => {
      const sch = scholarships.find(s => s.id === t.scholarshipId);
      const title = sch?.title || 'Unknown Opportunity';
      const provider = sch?.provider || 'N/A';
      const amount = t.status === 'awarded' && t.awardedAmount ? t.awardedAmount : (sch?.amount || 0);
      const deadline = sch?.deadline || 'N/A';
      const renewable = sch?.isRenewable ? 'Yes' : 'No';
      const category = sch?.category || 'General';
      const dateAdded = t.dateAdded || '';
      const notes = (t.notes || '').replace(/"/g, '""');

      return `"${title}","${provider}",${amount},"${t.status}","${deadline}","${renewable}","${category}","${dateAdded}","${notes}"`;
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Grantly_Aid_Portfolio_${profile.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generates a complete JSON backup of the user's data.
   */
  static exportBackupJson(data: Record<string, unknown>, filename = 'grantly_backup.json'): void {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
