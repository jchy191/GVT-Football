import { ArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TeamDetails } from '../lib/declaration';
import {
  totalMatchPoints,
  totalAlternateMatchPoints,
  extractStringFromDate,
} from '../lib/utils';

export default function Table({ entries }: { entries: TeamDetails[] }) {
  return (
    <div className="max-w-screen-xl mx-auto">
      <table className="table-auto divide-y divide-gray-500 min-w-full">
        <thead>
          <tr>
            <td className="px-4">Rank</td>
            <td className="px-4">Team name</td>
            <td className="px-4">Wins</td>
            <td className="px-4">Draws</td>
            <td className="px-4">Losses</td>
            <td className="px-4">Points</td>
            <td className="px-4">Goals</td>
            <td className="px-4">Alt. Points</td>
            <td className="px-4">Reg. Date</td>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={entry.name} className="odd:bg-primary-light">
              <td className="px-4 flex items-center">
                <p>{i + 1}</p>
                {i <= 3 ? (
                  <ArrowUpIcon width={32} className="text-green-700" />
                ) : (
                  <XMarkIcon width={32} className="text-error" />
                )}
              </td>
              <td className="font-bold px-4">{entry.name}</td>
              <td className="px-4 py-2 text-gray-600">{entry.wins}</td>
              <td className="px-4 py-2 text-gray-600">{entry.draws}</td>
              <td className="px-4 py-2 text-gray-600">{entry.losses}</td>
              <td className="px-4 py-2 text-gray-600">
                {totalMatchPoints(entry)}
              </td>
              <td className="px-4 py-2 text-gray-600">{entry.goals}</td>
              <td className="px-4 py-2 text-gray-600">
                {totalAlternateMatchPoints(entry)}
              </td>
              <td className="px-4 py-2 text-gray-600">
                {extractStringFromDate(entry.regdate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
