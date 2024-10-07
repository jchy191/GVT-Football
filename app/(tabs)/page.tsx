import React from 'react';
import { fetchTable } from '../lib/data';
import Table from '../table';
import ClearForm from '../clear-form';
import Link from 'next/link';

export default async function Home() {
  const table = await fetchTable();

  return (
    <>
      <Link href={'/edit'}>
        <button className="rounded-md bg-blue-600 text-white hover:text-blue-600 hover:bg-white hover:border-blue-600 border px-2 py-1">
          {table['1'].length === 0 ? 'Add' : 'Edit'}
        </button>
      </Link>
      <h1 className="font-bold text-2xl mb-4">Group 1</h1>
      <Table entries={table['1']} />
      <h1 className="font-bold text-2xl mt-6 mb-4">Group 2</h1>
      <Table entries={table['2']} />
      {table['1'].length !== 0 && <ClearForm />}
    </>
  );
}
