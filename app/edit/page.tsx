import React from 'react';
import Form from '../form';
import { fetchFormInputs } from '../lib/data';
import Container from '../ui/container';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }
  const form = await fetchFormInputs();

  return (
    <Container>
      <Form data={form} />
    </Container>
  );
}
