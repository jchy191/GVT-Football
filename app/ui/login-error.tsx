'use client';

import { useSearchParams } from 'next/navigation';

export default function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  if (!error) return <></>;

  return <p className="text-error">There was an error trying to log in.</p>;
}
