import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export default function TeamSelector({
  teams,
  currentTeam,
}: Readonly<{
  teams: string[];
  currentTeam?: string;
}>) {
  return (
    <Listbox>
      <div className="flex items-center gap-x-6">
        <Label className="pt-2 text-lg font-semibold text-gray-900">
          Select Team
        </Label>
        <div className="relative mt-2">
          <ListboxButton className="relative inline rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-sm">
            <span className="block truncate capitalize">
              {currentTeam ?? 'All'}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {teams.map((team) => (
              <Link key={team} href={`/teams?name=${team}`}>
                <ListboxOption
                  value={team}
                  className="group relative select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-primary data-[focus]:text-white"
                >
                  <span className="block truncate font-normal group-data-[selected]:font-semibold">
                    {team}
                  </span>
                </ListboxOption>
              </Link>
            ))}
          </ListboxOptions>
        </div>
      </div>
    </Listbox>
  );
}
