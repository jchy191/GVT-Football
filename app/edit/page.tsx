import React from 'react';
import Form from '../form';
import { fetchFormInputs } from '../lib/data';

export default async function Home() {
  const form = await fetchFormInputs();

  return (
    <>
      <Form data={form} />
    </>
  );
}
