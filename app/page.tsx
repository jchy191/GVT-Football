import React from 'react';
import Form from './form';
import { fetchTable } from './lib/data';
import { generateTableFromData } from './lib/utils';
import Table from './table';

export default async function Home() {
  const { teams, matches } = await fetchTable();
  const table = generateTableFromData(teams, matches);

  return (
    <>
      <Form />
      <h1 className="font-bold text-2xl mb-4">Group 1</h1>
      <Table entries={table.group1} />
      <h1 className="font-bold text-2xl mt-6 mb-4">Group 2</h1>
      <Table entries={table.group2} />
    </>
  );
}
