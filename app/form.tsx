'use client';

import { createTable } from './lib/actions';
import { useFormState } from 'react-dom';
import { UserFormInput } from './lib/declaration';
import Link from 'next/link';
import type { LogType } from '@prisma/client';

export const maxDuration = 40;

export default function Form({ data }: { data: UserFormInput }) {
  const initialState = '';
  let action: LogType = 'UPDATE';
  if (!data) {
    action = 'CREATE';
  }
  const createTableWithParams = createTable.bind(null, 6, action);
  const [state, formAction] = useFormState(createTableWithParams, initialState);

  return (
    <form action={formAction}>
      <p>{state}</p>
      <label className="block" htmlFor="teams">
        Enter team details
      </label>
      <textarea
        className="block"
        id="teams"
        name="teams"
        defaultValue={data ? data.teams : ''}
      />
      <label className="block" htmlFor="match">
        Enter match results
      </label>
      <textarea
        className="block"
        id="matches"
        name="matches"
        defaultValue={data ? data.matches : ''}
      />
      <Link href={'/'}>
        <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          Back
        </button>
      </Link>
      <button
        type="submit"
        className="rounded-md ml-3 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Save
      </button>
    </form>
  );
}
