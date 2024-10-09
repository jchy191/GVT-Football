'use client';

import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import type { Log } from '@prisma/client';

export default function LogEntry({ log }: { log: Log }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-sm border-b border-t py-1">
      <div className="flex justify-between items-center">
        <div className="flex-initial basis-1/6">
          <p>{log.createdAt.toUTCString().split(' ').slice(0, 4).join(' ')}</p>
          <p>{log.createdAt.toUTCString().split(' ').slice(4).join(' ')}</p>
        </div>
        <div className="mx-2 flex-initial basis-1/12">
          <Image
            src={log.image ?? ''}
            alt={log.name ?? ''}
            className="rounded-full"
            width={32}
            height={32}
          />
        </div>
        <div className="flex-initial basis-1/3">
          <p>{log.name}</p>
          <p>{log.email}</p>
        </div>
        <p className="flex-initial basis-1/12">{log.action}</p>
        <div className="flex-initial basis-1/12">
          {log.action !== 'DELETE' &&
            (open ? (
              <button onClick={() => setOpen(false)}>
                <MinusIcon width={25} />
              </button>
            ) : (
              <button onClick={() => setOpen(true)}>
                <PlusIcon width={25} />
              </button>
            ))}
        </div>
      </div>
      {log.action !== 'DELETE' && (
        <div className={clsx(open ? `block mt-2` : `hidden`)}>
          <p className="font-bold">Teams:</p>
          {log.formTeams}
          <p className="font-bold mt-1">Matches:</p>
          {log.formMatches}
        </div>
      )}
    </div>
  );
}
