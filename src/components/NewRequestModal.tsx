/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Droplet } from 'lucide-react';
import { CitizenRequestForm } from './CitizenRequestForm';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-sky-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Municipal Water Tanker Demand Registration</h3>
              <p className="text-xs text-slate-500">Official citizen & community water request submission form</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto pt-4 pr-1">
          <CitizenRequestForm
            isModal={true}
            onSuccess={() => {
              setTimeout(() => {
                onClose();
                setActiveTab('requests');
              }, 1200);
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};
