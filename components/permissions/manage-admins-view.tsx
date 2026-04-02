'use client';

import { useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const admins = [
  { id: '1', name: 'Hannah Priyanka', role: 'Super Admin', status: 'invitation pending', dateAdded: 'Date added' },
  { id: '2', name: 'Hannah Priyanka', role: 'Support Admin', status: 'active', dateAdded: 'Date added' },
  { id: '3', name: 'Hannah Priyanka', role: 'Super Admin', status: 'active', dateAdded: 'Date added' },
];

export default function ManageAdminsView() {
  const [activeFilter, setActiveFilter] = useState('All admins');

  const filters = ['All admins', 'Super admins', 'Operational Admins', 'Support Admins'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all border",
              activeFilter === filter 
                ? "bg-brand-light text-brand border-brand" 
                : "bg-white text-content-muted border-surface-subtle hover:border-brand/50"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <div 
            key={admin.id} 
            className="p-6 bg-white border border-surface-subtle rounded-[24px] space-y-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            {/* Status indicator bar */}
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1",
              admin.status === 'invitation pending' ? "bg-orange-400" : "bg-brand"
            )} />

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-content-primary">{admin.role}</h3>
                    {admin.status === 'invitation pending' && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase">
                        invitation pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-content-muted mt-1">{admin.name}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-content-muted uppercase tracking-wider">{admin.dateAdded}</p>
                <p className="text-sm text-content-muted">Oct 24, 2023</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 rounded-xl border-surface-subtle text-content-muted hover:text-brand hover:border-brand h-10 font-bold text-xs"
              >
                <RefreshCw size={14} className="mr-2" />
                Re-assign access
              </Button>
              
              {admin.status === 'invitation pending' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 h-10 font-bold text-xs px-4"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Revoke invitation
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 h-10 font-bold text-xs px-4"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete this admin
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
