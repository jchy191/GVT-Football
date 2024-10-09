import React from 'react';
import Form from './form';
import { fetchFormInputs } from '../lib/data';
import Container from '../ui/container';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }
  const form = await fetchFormInputs();

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-5">Annual Football Championship</h1>
      <Link href={'/'}>
        <button className="rounded-md bg-primary px-3 py-2 mb-6 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-primary border border-primary">
          Back
        </button>
      </Link>

      <Form data={form} />
    </Container>
  );
}
