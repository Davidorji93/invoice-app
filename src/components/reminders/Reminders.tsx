import React from 'react';

interface Reminder {
  label: string;
  color: string;
}

const reminders: Reminder[] = [
  { label: '14 days before due date', color: 'bg-[#E6FFF0] text-[14px]' },
  { label: '7 days before due date', color: 'bg-[#E6FFF0] text-[14px]' },
  { label: '3 days before due date', color: 'bg-white border text-[14px]' },
  { label: '24 hrs before due date', color: 'bg-white border text-[14px]' },
  { label: 'On the due date', color: 'bg-white border text-[14px] leading-[18px]' },
];

const Reminders: React.FC = () => {
  return (
    <div className="flex flex-wrap space-y-2 md:space-y-0 md:space-x-2 p-4 bg-white rounded-md shadow-sm">
      {reminders.map((reminder, index) => (
        <div
          key={index}
          className={`w-full md:w-auto px-4 py-2 text-sm font-medium rounded-full ${reminder.color}`}
        >
          {reminder.label}
        </div>
      ))}
    </div>
  );
};

export default Reminders;
