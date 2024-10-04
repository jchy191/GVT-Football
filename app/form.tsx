'use client';

import { createTable } from './lib/actions';
import { useFormState } from 'react-dom';

export const maxDuration = 40;

export default function Form() {
  const initialState = '';
  const createTableWithParams = createTable.bind(null, 6);
  const [state, formAction] = useFormState(createTableWithParams, initialState);

  return (
    <form action={formAction}>
      <p>{state}</p>
      <label className="block" htmlFor="teams">
        Enter team details
      </label>
      <textarea className="block" id="teams" name="teams" defaultValue={''} />
      <label className="block" htmlFor="match">
        Enter match results
      </label>
      <textarea
        className="block"
        id="matches"
        name="matches"
        defaultValue={''}
      />
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        Save
      </button>
    </form>
  );
}
