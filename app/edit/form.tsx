'use client';

import { createTable } from '../lib/actions';
import { useFormState } from 'react-dom';
import { CreateTableFormState, UserFormInput } from '../lib/definitions';
import type { LogType } from '@prisma/client';

export default function Form({ data }: Readonly<{ data: UserFormInput }>) {
  const initialState: CreateTableFormState = {};
  let action: LogType = 'UPDATE';
  if (!data) {
    action = 'CREATE';
  }
  const createTableWithParams = createTable.bind(null, 6, action);
  const [state, formAction] = useFormState(createTableWithParams, initialState);

  return (
    <form action={formAction}>
      <label className="block text-xl font-semibold" htmlFor="teams">
        Enter team details
      </label>
      <p>Syntax:</p>
      <p className="my-2 text-sm text-gray-600 whitespace-pre">{`<Team A name> <Team A reg date in DD/MM> <Team A group number>
<Team B name> <Team B reg date in DD/MM> <Team B group number>
<Team C name> <Team C reg date in DD/MM> <Team C group number>`}</p>
      <p className="text-error">{state.errors?.teams}</p>
      <textarea
        className="block w-96 h-80 resize-none"
        id="teams"
        name="teams"
        defaultValue={data ? data.teams : ''}
      />
      <label className="text-xl font-semibold block mt-6" htmlFor="match">
        Enter match results
      </label>
      <p>Syntax:</p>
      <p className="my-2 text-sm text-gray-600 whitespace-pre">{`<Team A name> <Team B name> <Team A goals scored> <Team B goals scored>
<Team B name> <Team C name> <Team B goals scored> <Team C goals scored>
<Team C name> <Team D name> <Team C goals scored> <Team D goals scored>`}</p>
      <p className="text-error">{state.errors?.matches}</p>
      <textarea
        className="block w-96 h-96 resize-none"
        id="matches"
        name="matches"
        defaultValue={data ? data.matches : ''}
      />
      <button
        type="submit"
        className="rounded-md mt-6 bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-primary border border-primary"
      >
        Save
      </button>
      <p className="text-error">{state.errors?.other}</p>
    </form>
  );
}
