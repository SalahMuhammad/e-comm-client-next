'use client';

import React, { useState } from 'react';
import useGenericResponseHandler from '@/components/custom hooks/useGenericResponseHandler';
import { updateStatus } from './actions';
import { useTranslations } from 'next-intl';
import { CheckIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function Toggle({ obj, type, className = '' }) {
  const t = useTranslations('finance');
  const handleResponse = useGenericResponseHandler();
  const [status, setStatus] = useState(Boolean(obj.paid));
  const [isChanging, setIsChanging] = useState(false);

  const toggleRepositoryStatus = async () => {
    if (isChanging) return;
    setIsChanging(true);

    // optimistic UI: toggle visually immediately for snappy feel
    const optimistic = !status;
    setStatus(optimistic);

    try {
      const res = await updateStatus(obj.hashed_id, type, obj.paid)
      if (handleResponse(res)) {
        setStatus(prev => !prev);
        setIsChanging(false);
        return;
      }

      if (res.status === 200) {
        // success; keep optimistic state
      } else {
        // revert on non-200
        setStatus(prev => !prev);
      }
    } catch (err) {
      // network / unexpected error -> revert
      setStatus(prev => !prev);
    } finally {
      // give a little time for the transition/animation to finish
      setTimeout(() => setIsChanging(false), 280);
    }
  };

  // Shared visual classes to match InvoiceListTable feel
  const base = `group inline-flex items-center px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 ease-in-out select-none shadow-sm ${className}`;

  return (
    <button
      type="button"
      aria-pressed={status}
      onClick={toggleRepositoryStatus}
      disabled={isChanging}
      className={
        base +
        ` ` +
        (status
          ? `bg-green-600 text-white border border-green-700 hover:bg-green-700 hover:shadow-md transform ${isChanging ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}`
          : `bg-yellow-50 dark:bg-transparent text-amber-600 border border-amber-200 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900 hover:text-amber-500 ${isChanging ? 'opacity-70 scale-95' : 'opacity-100 scale-100'}`)
      }
    >
      {/* Icon: animates on hover and while changing */}
      <span
        className={`flex items-center mr-2 transition-transform duration-300 ease-in-out transform origin-center group-hover:scale-110 ${
          isChanging ? 'animate-spin-slow' : ''
        }`
      }
      >
        {status ? (
          <CheckIcon className={`h-4 w-4`} aria-hidden="true" />
        ) : (
          <ClockIcon className={`h-4 w-4`} aria-hidden="true" />
        )}
      </span>

      {/* Label: fades in/out smoothly */}
      <span className={`transition-opacity duration-300 ease-in-out`}>{status ? t('status.paid') : t('status.onHold')}</span>

      {/* subtle micro interaction: small dot that appears while changing */}
      {isChanging && (
        <span className="ml-2 h-2 w-2 rounded-full bg-white/70 dark:bg-white/40 shadow-sm animate-pulse" />
      )}

      <style jsx>{`
        /* small custom animation for a slower spin that's less harsh than default animate-spin */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 0.9s linear infinite;
        }
      `}</style>
    </button>
  );
}
